const { body } = require("express-validator");

const signUpValidator = [body("username").toString().trim().]