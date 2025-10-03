const express = require("express");
const authRouter = require("./routes/auth.routes");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  const start = process.hrtime(); // High-resolution real time

  res.on("finish", () => {
    const end = process.hrtime(start);
    const duration = end[0] * 1000 + end[1] / 1000000; // Convert to milliseconds
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration.toFixed(
        3
      )}ms`
    );
  });
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);

module.exports = app;
