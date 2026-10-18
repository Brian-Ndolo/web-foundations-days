-- Day 6 Assignment: A School Database

PRAGMA foreign_keys = ON;

-- 1. Students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL UNIQUE
);

-- 3. Enrolments table
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

-- Index to help find students enrolled in a course
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
-- 4. Insert sample students
INSERT INTO students (student_id, first_name, last_name, email) VALUES
(1, 'Amina', 'Otieno', 'amina.otieno@example.com'),
(2, 'Brian', 'Kamau', 'brian.kamau@example.com'),
(3, 'Grace', 'Wanjiku', 'grace.wanjiku@example.com'),
(4, 'Peter', 'Mwangi', 'peter.mwangi@example.com');

-- 5. Insert sample courses
INSERT INTO courses (course_id, course_name, course_code) VALUES
(1, 'Database Fundamentals', 'DB101'),
(2, 'Web Development', 'WD101'),
(3, 'Computer Networks', 'CN101');

-- 6. Insert sample enrolments
INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'B'),
(4, 2, 3, 'A'),
(5, 3, 2, 'A');

-- 7. Query 1: Find all courses taken by one student
SELECT
    s.first_name || ' ' || s.last_name AS student_name,
    c.course_name,
    e.grade
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.first_name = 'Amina'
  AND s.last_name = 'Otieno';

-- 8. Query 2: Find all students enrolled in one course
SELECT
    c.course_name,
    s.first_name || ' ' || s.last_name AS student_name,
    e.grade
FROM courses AS c
JOIN enrolments AS e ON c.course_id = e.course_id
JOIN students AS s ON e.student_id = s.student_id
WHERE c.course_name = 'Web Development';

-- 9. Query 3: Count the students enrolled in each course
SELECT
    c.course_name,
    COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

-- 10. Query 4: Find students who have no enrolments
SELECT
    s.student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    s.email
FROM students AS s
LEFT JOIN enrolments AS e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- 11. Query 5: Update an enrolment grade
UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 3;