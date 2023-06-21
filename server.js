//import express module
const express = require("express");
const cors = require("cors");

const app = express();



//import dot-env
require("dotenv").config();

//import index file
const db = require("./models/index");

//import routes
const userApp = require("./routes/user.route");
const taskApp = require("./routes/task.route");
const adminApp = require("./routes/admin.route");
const commentApp = require("./routes/comment.route");
const subscription=require("./routes/subscription.route")

//start the webserver
const PORT = process.env.PORT;
app.listen(5000, () => console.log(`HTTP server started on port 5000...`));
//cors policy
app.use(cors());
//Check DB Connection
db.sequelize
  .authenticate()
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("Error in DB Connection"));
//Routes
app.use("/user", userApp);
app.use("/admin", adminApp);
app.use("/task", taskApp);
app.use("/comment", commentApp);
app.use("/subscription",subscription)

//Error Handler for Invalid Path
app.use("*", (req, res) => {
  res.send({ message: "Invalid Path" });
});

//Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.send({ message: "Error Occurred", payload: err });
});
