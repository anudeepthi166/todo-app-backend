const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const db = require("../models/index");

const jwt = require("jsonwebtoken");

//import dot-env
require("dotenv").config();

//import models
const { User } = require("../models/user");

//SIGN UP
exports.signUp = expressAsyncHandler(async (req, res) => {
  // Hashing the password
  let hashedPassword = await bcrypt.hash(req.body.password, 5);
  req.body.password = hashedPassword;
  //get the roleId for a user
  let roleId=await db.Role.findOne({where:{
    roleName:"user"
  }})

  //set roleId
  req.body.roleId=roleId.dataValues.id

  //inserting record
  let user = await db.User.create(req.body);

  // sending response
  if (user) {
    //remove password
    delete user.dataValues.password;
    res
      .status(201)
      .send({ message: "User Registered Successfully", payload: user });
  } else {
    res.send({ message: "Please Try Again" });
  }
});

// LOGIN
exports.login = expressAsyncHandler(async (req, res) => {
  //check user exists or not
  let user = await db.User.findOne({
    where: {
      email: req.body.email,
    },
  });

  

  //if user exists check password
  if (user) {
    //get the role
  let role = await db.Role.findOne({
    where: { id: user.dataValues.roleId },
    attributes: {
      exclude: ["id", "createdAt", "updatedAt"],
    },
  });
  //compare the password
    let result = await bcrypt.compare(
      req.body.password,
      user.dataValues.password
    );

    //Correct Password
    if (result) {
      //generate jwt token
      let token = jwt.sign(
        { role: role.dataValues.roleName },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      //remove password from user.dataValues
      delete user.dataValues.password;
      //send  response
      res.send({
        message: "Login Success",
        token: token,
        user: user.dataValues,
      });
    }
    //Incorrect password
    else {
      res.status(401).send({ payload: "Incorrect Password" });
    }
  }
  //if no user exists
  else {
    res.status(401).send({ payload: "Please Register" });
  }
});
