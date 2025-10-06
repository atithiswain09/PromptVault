const { Router } = require("express");
const { signup, login,logout } = require("../controllers/auth.controller");
const { signUpValidator } = require("../validators/signup");
const { loginValidator } = require("../validators/login");

const router = Router();

router.post("/signup", signUpValidator, signup);
router.post("/login", loginValidator, login);
router.get("/logout",logout)
module.exports = router;
