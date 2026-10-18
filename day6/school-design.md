# School Database Design

## 1. Tables

### Students Table
The students table stores information about students, including their student ID, first name, last name, and email address. The student ID is the primary key, while the email address must be unique.

### Courses Table
The courses table stores information about courses offered by the school. It contains a course ID, course name, and unique course code.

### Enrolments Table
The enrolments table connects students to courses. It stores the enrolment ID, student ID, course ID, and grade. The student ID and course ID are foreign keys referencing the students and courses tables. A unique constraint prevents a student from enrolling in the same course twice.

## 2. Relationships

### One-to-Many Relationships
One student can have many enrolments, but each enrolment belongs to one student. Similarly, one course can have many enrolments, but each enrolment refers to one course.

### Many-to-Many Relationship
Students and courses have a many-to-many relationship because one student can take several courses, and one course can have several students.

The enrolments table acts as a junction table between students and courses. It resolves the many-to-many relationship and allows each student's grade to be recorded for a particular course.

## 3. Index

The database includes an index on the course_id column in the enrolments table. This index can improve queries that retrieve students enrolled in a particular course and queries that count enrolments per course. An index requires additional storage and can slightly slow down insertions and updates.

## 4. SQL vs NoSQL

I would choose a relational SQL database for this school system because students, courses, and enrolments have structured data and clearly defined relationships. SQL supports primary keys, foreign keys, unique constraints, and JOIN operations, which help maintain data integrity and make reporting easier. A NoSQL database may be more suitable for flexible or rapidly changing document structures, but a relational database is a good fit for this system because the relationships between students, courses, and enrolments are important.