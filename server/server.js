// dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// local dependencies
import { connectDB } from "./lib/db.js";

// routes
import authRotes from "./routes/auth.route.js";

// load environment variables
dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authRotes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

// error handle
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
