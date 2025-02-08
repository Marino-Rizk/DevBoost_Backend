const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// File Upload Middleware
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    useTempFiles: true, // Better file handling
    tempFileDir: "/tmp/", // Temporary file directory
  })
);

// Define the path to the uploads directory
const uploadsDirectory = path.join(__dirname, "uploads");

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDirectory));

// routes
const userRouter = require("./routes/api/userRoutes");
const courseRouter = require("./routes/api/courseRoutes");
const teacherRouter = require("./routes/api/teacherRoutes");
const notificationRouter = require("./routes/api/notificationRoutes");
const meetingRouter = require("./routes/api/meetingRoutes");

const dashboardRouter = require("./routes/dashboardRoutes"); 

// Use user routes
app.use("/", dashboardRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/notification",notificationRouter );
app.use("/api/meeting",meetingRouter );

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
