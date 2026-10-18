# Day 7 Assignment: Scaling a Photo-Sharing App

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and scroll through a feed containing photos from people they follow.

The following assumptions are used for the scaling calculations:

- Registered users: 10,000,000.
- Daily active users: 10% of registered users.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Average original photo size: 2 MB.
- Average thumbnail size: 50 KB.
- A year contains 365 days.
- There are 86,400 seconds in a day.
- Peak feed traffic is five times the average rate.
- Each upload produces one thumbnail.
- Storage estimates exclude database data, backups, replication overhead, and temporary files.
- Feed pages are counted as requests, and caching is assumed to reduce database load.

## 2. Scaling Calculations

### Daily Active Users

Daily active users = Registered users × Daily active percentage

= 10,000,000 × 10%

= **1,000,000 daily active users**

### Photo Uploads per Day and per Second

Each active user uploads one photo per day.

Uploads per day = 1,000,000 × 1

= **1,000,000 uploads per day**

Average uploads per second = 1,000,000 ÷ 86,400

= **11.57 uploads per second**

Therefore, SnapShare must handle approximately 12 uploads per second on average.

### Feed Views per Day and per Second

Each active user views 50 feed pages per day.

Feed views per day = 1,000,000 × 50

= **50,000,000 feed views per day**

Average feed views per second = 50,000,000 ÷ 86,400

= **578.70 feed views per second**

Peak feed views per second = 578.70 × 5

= **2,893.52 feed views per second**

The system should therefore be designed to handle approximately 2,900 feed requests per second during peak periods, with additional headroom for unexpected traffic.

### Photo Storage per Year

Each upload stores one original photo of 2 MB and one thumbnail of 50 KB.

Assuming 1 MB = 1,000 KB:

Original photo storage per day:

1,000,000 × 2 MB = 2,000,000 MB = 2,000 GB = 2 TB

Thumbnail storage per day:

1,000,000 × 50 KB = 50,000,000 KB = 50 GB

Total photo storage per day:

2,000 GB + 50 GB = **2,050 GB, or 2.05 TB**

Total photo storage per year:

2.05 TB × 365 = **748.25 TB per year**

SnapShare therefore needs approximately **748.25 TB of new photo storage annually**, before accounting for backups, replicas, additional image sizes, and storage overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users generate 50 feed views per day but upload only one photo per day. This produces 50 million feed views daily compared with one million photo uploads.

The design should prioritize fast feed delivery using a CDN, caching, scalable application servers, and a database read replica. Uploads still need reliable processing and storage, but the much larger volume of feed requests makes read performance a primary concern.

## 4. Why Photos Should Not Be Stored Inside the Database

Original photos and thumbnails should be stored in object storage rather than directly inside relational database tables. Photo files are large binary objects that can make database backups, queries, replication, and storage management more expensive if kept in the database. Object storage is designed for durable, scalable storage of files, while the database can store metadata such as photo ID, owner ID, object-storage key, upload time, caption, and visibility settings. This separation allows the database and photo files to scale independently.

## 5. Architecture Diagram

```text
                         USERS
                           |
                           v
                    +--------------+
                    |     CDN      |
                    | Cached photos|
                    +--------------+
                           |
                           v
                    +--------------+
                    | Load Balancer|
                    +--------------+
                           |
              +------------+------------+
              |            |            |
              v            v            v
        +-----------+ +-----------+ +-----------+
        | App Server| | App Server| | App Server|
        +-----------+ +-----------+ +-----------+
              |            |            |
              +------------+------------+
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
       +-----------+ +-----------+ +----------------+
       |   Cache   | |  Primary  | | Object Storage |
       |           | | Database  | | Original photos|
       +-----------+ +-----------+ | and thumbnails |
             |       +-----------+ +----------------+
             |             |
             |             v
             |       +-----------+
             |       | Read      |
             |       | Replica   |
             |       +-----------+
             |
             |     Upload processing
             |             |
             |             v
             |       +-----------+
             |       |   Queue   |
             |       +-----------+
             |             |
             |             v
             |       +-----------+
             |       | Thumbnail |
             |       |  Worker   |
             |       +-----------+
             |             |
             |             v
             +------> Object Storage
                      (thumbnail)
```

The diagram represents the main components and their logical connections. In production, application servers submit thumbnail jobs to the queue after an upload, and workers retrieve those jobs asynchronously.

## 6. Components and the Problems They Solve

- **CDN:** Delivers frequently requested photos from geographically distributed edge locations, reducing latency and origin traffic.
- **Load balancer:** Distributes incoming requests across healthy application servers to prevent one server from becoming overloaded.
- **Application servers:** Handle authentication, uploads, feed generation, permissions, and communication between services.
- **Cache:** Keeps frequently requested feed data and metadata in fast memory to reduce repeated database queries.
- **Primary database:** Stores authoritative structured information such as users, follows, photo metadata, captions, and visibility settings.
- **Database read replica:** Serves eligible read queries so feed-related database traffic does not all reach the primary database.
- **Object storage:** Stores original photos and thumbnails durably without burdening the database with large image files.
- **Queue:** Holds thumbnail-generation jobs so image processing can happen asynchronously and can be retried if a worker fails.
- **Thumbnail worker:** Consumes queued jobs, resizes uploaded photos, creates thumbnails, and saves them to object storage.

## 7. Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.
2. The load balancer routes the upload request to a healthy application server.
3. The application server authenticates the user, validates the file type and size, checks permissions, and authorizes the upload.
4. The original photo is uploaded to object storage under a unique object key.
5. The application records the photo metadata and storage key in the primary database.
6. After the original upload and required metadata are safely stored, the application places a thumbnail-generation job on the queue.
7. A thumbnail worker retrieves the job and downloads or reads the original photo from object storage.
8. The worker resizes the image to create a 50 KB thumbnail and saves it in object storage.
9. The worker updates the photo metadata to indicate that the thumbnail is ready, or records a failure for retry if processing does not succeed.
10. The application makes the photo available in the feed according to the product's consistency and visibility rules; the CDN can cache the original and thumbnail when they are requested.

## 8. Trade-Offs

### Trade-Off 1: CDN and Cache Versus Freshness

A CDN and application cache make feed loading faster and reduce load on the origin servers and database. However, cached content can become stale when a user deletes a photo, changes its visibility, or updates a caption. Cache expiration, invalidation, and authorization checks are needed, which add complexity.

### Trade-Off 2: Asynchronous Thumbnails Versus Immediate Availability

Generating thumbnails through a queue keeps upload requests fast and allows workers to scale independently. However, thumbnails may not be available immediately after the original photo is uploaded. The application must handle a pending state, retries, failed jobs, and possible duplicate job processing.

### Trade-Off 3: Read Replica Versus Data Consistency

A read replica distributes read traffic and reduces pressure on the primary database. However, replication can lag, meaning a newly uploaded photo or updated metadata might not appear immediately when a feed is read from the replica. The application may need to read recent changes from the primary database or tolerate brief delays.

### Trade-Off 4: Object Storage Versus Operational Complexity

Object storage scales well for large files and separates image storage from database operations. However, the application must manage object keys, access permissions, upload failures, lifecycle policies, and cleanup of orphaned files when database operations fail.

## 9. Conclusion

SnapShare has one million daily active users, approximately 11.57 photo uploads per second on average, about 578.70 feed views per second on average, and about 2,893.52 feed views per second at the estimated peak. Original photos and thumbnails require approximately 748.25 TB of additional storage per year using decimal storage units. Because feed reads greatly outnumber uploads, the architecture prioritizes CDN delivery, caching, scalable application servers, and a read replica, while object storage and asynchronous thumbnail processing handle photo files efficiently.