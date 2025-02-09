const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");

const port = process.env.PORT || 5000; // Backend should run on port 5000

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// File Upload Middleware
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const userRouter = require("./routes/api/userRoutes");
const courseRouter = require("./routes/api/courseRoutes");
const teacherRouter = require("./routes/api/teacherRoutes");
const notificationRouter = require("./routes/api/notificationRoutes");
const meetingRouter = require("./routes/api/meetingRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");

// Use routes
app.use("/", dashboardRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/meeting", meetingRouter);

app.options("*", cors());

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
