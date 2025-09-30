const { Router } = require("express");
const { signup, login } = require("../Controller/authController");
const { signUpValidator } = require("../validators/signup");

const router = Router();

router.post("/signup", signUpValidator, signup);
router.post("/login", loginValidator, login);

module.exports = router;
