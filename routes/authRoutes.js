const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const { Router } = require("express");

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", logoutUser);

module.exports = authRouter;
