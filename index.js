const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");

// Config dotev
require("dotenv").config({
  path: "./config/config.env",
});

const app = express();

// Connect to database
connectDB();

// body parser
app.use(bodyParser.json());
// Load routes
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const mediaRouter = require("./routes/media.route");
const postRouter = require("./routes/post.route");

// Dev Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
}

// Use Routes
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", mediaRouter);
app.use("/api", postRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: "Page not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
