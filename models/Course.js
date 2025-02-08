const db = require("../config/db");
const helper = require("../utils/helper");

class Course {
  constructor(title, description, cover_url, teacher_id) {
    this.title = title;
    this.description = description;
    this.cover_url = cover_url;
    this.teacher_id = teacher_id;
  }

  static create(newCourse) {
    const query =
      "INSERT INTO courses (title, description, cover_url, teacher_id) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [newCourse.title, newCourse.description, newCourse.cover_url, newCourse.teacher_id],
        (err, result) => {
          if (err) return reject(err);

          db.query("SELECT * FROM courses WHERE course_id = ?", [result.insertId], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return reject(new Error("Course not found"));

            const course = helper.appendMainUrlToKey(rows[0], "cover_url");
            resolve(course);
          });
        }
      );
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM courses WHERE id = ?", [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);

        const course = helper.appendMainUrlToKey(results[0], "cover_url");
        resolve(course);
      });
    });
  }

  static searchCourse(q) {
    if (!q || typeof q !== 'string' || q.trim() === '') {
      return Promise.resolve([]); // Return an empty array if query is invalid
    }

    const query = `
      SELECT 
            c.course_id, 
            c.title, 
            d.domain_description, 
            c.cover_url, 
            c.description,
            u.user_id, 
            u.full_name 
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.user_id
      LEFT JOIN teacher t ON c.teacher_id = t.teacher_id
      LEFT JOIN domain d ON t.domain_id = d.domain_id 
      WHERE c.title LIKE ?
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [`%${q.trim()}%`], (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return reject(err);
        }
        const courses = results.map(course => helper.appendMainUrlToKey(course, "cover_url"));
        resolve(courses);
      });
    });
  }

  static delete(courseId) {
    return new Promise((resolve, reject) => {
      const deleteQuery = "DELETE FROM courses WHERE course_id = ?";
      db.query(deleteQuery, [courseId], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return reject(new Error("Course not found"));
        resolve({ message: "Course deleted successfully" });
      });
    });
  }

  static getRandom() {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
            c.course_id, 
            c.title, 
            d.domain_description, 
            c.cover_url, 
            c.description,
            u.user_id,  
            u.full_name 
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.user_id
      LEFT JOIN teacher t ON c.teacher_id = t.teacher_id
      LEFT JOIN domain d ON t.domain_id = d.domain_id
      ORDER BY RAND()
      LIMIT 8`;
      db.query(query, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static getByDomain(domain_id) {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
            c.course_id, 
            c.title, 
            d.domain_description, 
            c.cover_url, 
            c.description,
            u.user_id, 
            u.full_name 
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.user_id
      LEFT JOIN teacher t ON c.teacher_id = t.teacher_id
      LEFT JOIN domain d ON t.domain_id = d.domain_id
      WHERE t.domain_id = ?`;
      db.query(query, [domain_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static addContent(newContent) {
    const query =
      "INSERT INTO content (title, description, url, course_id) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [newContent.title, newContent.description, newContent.url, newContent.course_id],
        (err, result) => {
          if (err) return reject(err);

          db.query("SELECT * FROM content WHERE content_id = ?", [result.insertId], (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return reject(new Error("Course not found"));
            resolve(rows[0]);
          });
        }
      );
    });
  }

  static getContent(course_id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM content WHERE course_id = ?";
      db.query(query, [course_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
  static enroll(user_id, course_id) {
    const query = "INSERT INTO enrollment (user_id, course_id, enrollment_date) VALUES (?, ?, NOW())";

    return new Promise((resolve, reject) => {
      db.query(query, [user_id, course_id], (err, result) => {
        if (err) return reject(err);

        db.query("SELECT * FROM enrollment WHERE enrollment_id = ?", [result.insertId], (err, rows) => {
          if (err) return reject(err);
          if (rows.length === 0) return reject(new Error("Enrollment not found"));
          resolve(rows[0]);
        });
      });
    });
  }

}

module.exports = Course;
