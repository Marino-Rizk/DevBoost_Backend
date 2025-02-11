const db = require("../config/db");
const helper = require("../utils/helper");

class Meeting {
    constructor(title, meeting_start, user_id, teacher_id) {
        this.title = title;
        this.meeting_start = meeting_start;
        this.user_id = user_id;
        this.teacher_id = teacher_id;
    }

    static create(title, meeting_start, user_id, teacher_id) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO meetings (title, meeting_start, user_id, teacher_id) 
                VALUES (?, ?, ?, ?)
            `;

            db.query(query, [title, meeting_start, user_id, teacher_id], (err, result) => {
                if (err) return reject(err);

                const meetingId = result.insertId;

                db.query("SELECT * FROM meetings WHERE meeting_id = ?", [meetingId], (err, rows) => {
                    if (err) return reject(err);
                    if (rows.length === 0) return reject(new Error("Meeting not found"));

                    resolve(rows[0]);
                });
            });
        });
    }

    // Get meetings by user ID
    static getMeetingsByUser(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT m.meeting_id, m.title, 
                m.meeting_start, 
                m.user_id, m.teacher_id, t.meeting_link
                FROM meetings m 
                LEFT JOIN teacher t on m.teacher_id = t.teacher_id 
                WHERE m.user_id = ? OR m.teacher_id = ?
            `;

            db.query(query, [userId, userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static delete(meetingId) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM meetings WHERE meeting_id = ?`;
            db.query(query, [meetingId], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }
}

module.exports = Meeting;
