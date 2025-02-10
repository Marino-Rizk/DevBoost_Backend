const db = require("../config/db");
const helper = require("../utils/helper");

class Notification {
    constructor(title, description, sent_date) {
        this.title = title;
        this.description = description;
        this.sent_date = sent_date;
    }

    static create(title, description) {
        const query = "INSERT INTO notifications (title, description, sent_date) VALUES (?, ?, NOW())";

        return new Promise((resolve, reject) => {
            db.query(query, [title, description], (err, result) => {
                if (err) return reject(err);

                const notificationId = result.insertId;

                db.query("SELECT * FROM notifications WHERE notification_id = ?", [notificationId], (err, rows) => {
                    if (err) return reject(err);
                    if (rows.length === 0) return reject(new Error("notification not found"));

                    // Fetch all user IDs from the users table
                    db.query("SELECT user_id FROM users", (err, users) => {
                        if (err) return reject(err);

                        if (users.length > 0) {
                            const userNotificationsQuery = "INSERT INTO user_notifications (user_id, notification_id, status) VALUES ?";
                            const values = users.map(user => [user.user_id, notificationId, 0]);

                            db.query(userNotificationsQuery, [values], (err) => {
                                if (err) return reject(err);
                                resolve(rows[0]);
                            });
                        } else {
                            resolve(rows[0]); // No users to notify
                        }
                    });
                });
            });
        });
    }
    static getUnreadNotifications(userId) {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT un.user_notification_id, n.title, n.description, n.sent_date  FROM notifications n
        LEFT JOIN user_notifications un ON n.notification_id = un.notification_id
        WHERE un.user_id = ? AND un.status = 0
      `;
            db.query(query, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }


    static markAsRead(userId, notificationId) {
        return new Promise((resolve, reject) => {
            const query = `
            UPDATE user_notifications 
            SET status = 1 
            WHERE user_id = ? AND notification_id = ?
        `;

            db.query(query, [userId, notificationId], (err, result) => {
                if (err) return reject(new Error(`Database query failed: ${err.message}`));

                if (result.affectedRows === 0) {
                    return reject(new Error("No notification found or already marked as read"));
                }

                resolve({ message: "Notification marked as read" });
            });
        });
    }
}
module.exports = Notification;
