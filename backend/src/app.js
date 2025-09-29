const express = require("express");
const authRouter = require("./routes/auth.routes");
const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", authRouter);

module.exports = app;
