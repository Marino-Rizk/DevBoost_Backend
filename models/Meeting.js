const db = require("../config/db");
const helper = require("../utils/helper");

class Meeting {
    constructor(title, meeting_date_time, user_id, teacher_id) {
        this.title = title;
        this.meeting_date_time = meeting_date_time;
        this.user_id = user_id;
        this.teacher_id = teacher_id;

    }

    static create(title, meetingStart, meetingEnd, user_id, teacher_id) {
        return new Promise((resolve, reject) => {
            const meeting_date_time = JSON.stringify({ start: meetingStart, end: meetingEnd });

            const query = `
                INSERT INTO meetings (title, meeting_date_time, user_id, teacher_id) 
                VALUES (?, ?, ?, ?)
            `;

            db.query(query, [title, meeting_date_time, user_id, teacher_id], (err, result) => {
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
                SELECT meeting_id, title, 
                JSON_UNQUOTE(JSON_EXTRACT(meeting_date_time, '$.start')) AS meeting_start, 
                JSON_UNQUOTE(JSON_EXTRACT(meeting_date_time, '$.end')) AS meeting_end, 
                user_id, teacher_id 
                FROM meetings 
                WHERE user_id = ? OR teacher_id = ?
            `;

            db.query(query, [userId, userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = Meeting;
