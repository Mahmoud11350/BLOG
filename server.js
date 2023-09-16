require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
// Database
const connectDB = require("./db/connectDB");
// middlewares
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const routeNotFound = require("./middlewares/notFound");
const errorsHandler = require("./middlewares/errorsHandler");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");
const articlesRouter = require("./routes/articlesRoutes");
const authanticatedUser = require("./middlewares/authMiddleware");

// pre middleware
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// routes
app.use("/auth", authRouter);
app.use("/user", authanticatedUser, userRouter);
app.use("/articles", authanticatedUser, articlesRouter);

// post middlewares
app.use(routeNotFound);
app.use(errorsHandler);

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`server start on port ${PORT}`));
  } catch (error) {}
};

start();
