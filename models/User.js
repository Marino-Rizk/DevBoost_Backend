const db = require("../config/db");
const helper = require("../utils/helper");

class User {
  constructor(email, password, full_name = "", roleId = 1) {
    this.email = email;
    this.password = password;
    this.full_name = full_name;
    this.roleId = roleId;
  }

  static create(newUser) {
    const query = "INSERT INTO users (full_name, email, password, role_id) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(query, [newUser.full_name, newUser.email, newUser.password, newUser.role_id], (err, result) => {
        if (err) return reject(err);

        db.query("SELECT * FROM users WHERE user_id = ?", [result.insertId], (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0]);
        });
      });
    });
  }

  static findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users u LEFT JOIN teacher t on u.user_id = t.teacher_id WHERE u.user_id = ?", [id], (err, results) => {
        if (err) return reject(err);
        if (!results.length) return resolve(null);

        let user = helper.appendMainUrlToKey(results[0], "image_url");
        resolve(user);
      });
    });
  }

  static delete(user_id) {
    return new Promise((resolve, reject) => {
      // First, check the role_id of the user
      const checkRoleQuery = "SELECT role_id FROM users WHERE user_id = ?";
      db.query(checkRoleQuery, [user_id], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return reject(new Error("User not found"));

        const role_id = result[0].role_id;
        if (role_id === 2) {
          const deleteTeacherQuery = "DELETE FROM teacher WHERE teacher_id = ?";
          db.query(deleteTeacherQuery, [user_id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error("User not found"));
          });
        }
        // Now delete the user
        const deleteQuery = "DELETE FROM users WHERE user_id = ?";
        db.query(deleteQuery, [user_id], (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) return reject(new Error("User not found"));
          resolve({ message: "User deleted successfully" });
        });
      });
    });
  }

  static updatePassword(password) {
    return new Promise((resolve, reject) => {
      let updateQuery = "UPDATE users SET password = ? WHERE role_id = 3";

      db.query(updateQuery, [password], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static updateTeacherProfile(user_id, { full_name, image_url, description, meeting_link }) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE users u 
            LEFT JOIN teacher t ON u.user_id = t.teacher_id
            SET u.full_name = ?, u.image_url = ?, 
                t.description = ?, t.meeting_link = ?
            WHERE u.user_id = ? AND u.role_id = 2`,
        [full_name, image_url, description, meeting_link, user_id],
        (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) return reject(new Error("User not found or not a teacher"));

          // Fetch updated profile after successful update
          db.query(
            `SELECT * FROM users u 
                    LEFT JOIN teacher t ON u.user_id = t.teacher_id
                    WHERE u.user_id = ?`,
            [user_id],
            (err, rows) => {
              if (err) return reject(err);
              if (!rows.length) return reject(new Error("User not found after update"));
              resolve(helper.appendMainUrlToKey(rows[0], "image_url"));
            }
          );
        }
      );
    });
  }

  static findByRoleId(roleId) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE role_id = ?", [roleId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

}

module.exports = User;
