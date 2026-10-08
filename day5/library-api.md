# Library API Design

This API manages a library's **books** resource using RESTful endpoints.

## Endpoints

### 1. List all books

* **Method:** `GET`
* **Path:** `/books`
* **Description:** Returns a list of all books in the library.
* **Success status:** `200 OK`

### 2. Get one book

* **Method:** `GET`
* **Path:** `/books/:id`
* **Description:** Returns a single book using its unique ID.
* **Success status:** `200 OK`

### 3. Create a book

* **Method:** `POST`
* **Path:** `/books`
* **Description:** Creates a new book in the library.
* **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
  ```
* **Success status:** `201 Created`

### 4. Update a book

* **Method:** `PUT`
* **Path:** `/books/:id`
* **Description:** Updates an existing book using its unique ID.
* **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
  ```
* **Success status:** `200 OK`

### 5. Delete a book

* **Method:** `DELETE`
* **Path:** `/books/:id`
* **Description:** Deletes a book using its unique ID.
* **Success status:** `204 No Content`

### 6. List books by author

* **Method:** `GET`
* **Path:** `/books?author=Chinua%20Achebe`
* **Description:** Returns books written by the specified author.
* **Success status:** `200 OK`

## Error Codes

### 400 Bad Request

This happens when the request contains invalid or missing data.

**Example:** A `POST /books` request does not include the required `title` or `author`.

### 404 Not Found

This happens when the requested book or resource does not exist.

**Example:** A `GET /books/999` request is made but book `999` does not exist.
