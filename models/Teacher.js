const db = require("../config/db");
const helper = require("../utils/helper");

class Teacher {
  constructor(title, description, domain, coverUrl) {
    this.title = title;
    this.description = description;
    this.domain = domain;
    this.coverUrl = coverUrl;
  }

  static create(newTeacher) {
    const query = "INSERT INTO teacher (teacher_id, image_url, description, domain_id, meeting_link) VALUES (?, ?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(query, [newTeacher.teacher_id, newTeacher.image_url, newTeacher.description, newTeacher.domain_id, newTeacher.meeting_link], (err, result) => {
        if (err) return reject(err);
        
        db.query("SELECT * FROM teacher WHERE teacher_id = ?", [newTeacher.teacher_id], (err, rows) => {
          if (err) return reject(err);
          
          if (rows.length > 0) {
            helper.appendMainUrlToKey(rows[0], "image_url");
          }
          
          resolve(rows[0]);
        });
      });
    });
  }

  static searchTeacher(q) {
    const query = `
    SELECT 
      u.user_id, 
      u.full_name, 
      u.email, 
      t.image_url, 
      t.description, 
      d.domain_description
    FROM users u 
    LEFT JOIN teacher t ON u.user_id = t.teacher_id
    LEFT JOIN domain d ON t.domain_id = d.domain_id
    WHERE u.role_id = 2 
    AND u.full_name LIKE ?;
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [`%${q}%`], (err, results) => {
        if (err) return reject(err);
        
        results.forEach(row => helper.appendMainUrlToKey(row, "image_url"));
        
        resolve(results);
      });
    });
  }

  static getRandom() {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
        u.user_id, 
        u.full_name, 
        u.email, 
        t.image_url, 
        t.description, 
        d.domain_description
      FROM users u 
      LEFT JOIN teacher t ON u.user_id = t.teacher_id
      LEFT JOIN domain d ON t.domain_id = d.domain_id
      WHERE u.role_id = 2
      ORDER BY RAND()
      LIMIT 8; 
      `;
      
      db.query(query, (err, result) => {
        if (err) return reject(err);
        
        result.forEach(row => helper.appendMainUrlToKey(row, "image_url"));
        
        resolve(result);
      });
    });
  }

  static getTeachers() {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
        u.user_id, 
        u.full_name, 
        u.email, 
        t.image_url, 
        t.description, 
        d.domain_description
      FROM users u 
      LEFT JOIN teacher t ON u.user_id = t.teacher_id
      LEFT JOIN domain d ON t.domain_id = d.domain_id
      WHERE u.role_id = 2 ;
      `;
      
      db.query(query, (err, result) => {
        if (err) return reject(err);
        
        result.forEach(row => helper.appendMainUrlToKey(row, "image_url"));
        
        resolve(result);
      });
    });
  }
}

module.exports = Teacher;
