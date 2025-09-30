const express = require("express");
const authRouter = require("./routes/auth.routes");
const AppError = require("./utils/AppError");
const { globalErrorHandler } = require("./middlewares/errorHandler");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);

// Handle unfound routes (404)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler());

module.exports = app;
