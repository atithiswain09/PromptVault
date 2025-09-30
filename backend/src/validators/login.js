const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { loginValidator }