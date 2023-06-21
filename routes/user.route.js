//express Router
const express = require("express");
const userApp = express.Router();

//import controllers
const { signUp, login } = require("../controllers/user.controller");
const { signUpValidations } = require("../middlewares/signUp.validations");
const { loginValidations } = require("../middlewares/login.validations");

//Body Parser
userApp.use(express.json());

//defining routes
userApp.post("/sign-up",signUpValidations, signUp);

userApp.post("/login", loginValidations,login);

//export userApp
module.exports = userApp;
