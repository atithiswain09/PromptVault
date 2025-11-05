const express = require("express");
const authRouter = require("./routers/auth.routes");
const cookieParser = require('cookie-parser');
const AppError = require("./utils/AppError");
const { globalErrorHandler } = require("./middlewares/errorHandler");
const app = express();
const promptRouter=require('./routers/prompt.routes');

app.use(express.json());
app.use(cookieParser());



app.use("/api/prompts", promptRouter);
app.use("/api/auth", authRouter);

// Handle unfounded routes (404)
app.all("/*path", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler());

module.exports = app;
