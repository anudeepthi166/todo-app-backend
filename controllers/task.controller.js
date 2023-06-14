const expressAsyncHandler = require("express-async-handler");
//nodejs-nodemailer-outlook
const nodeOutlook = require('nodejs-nodemailer-outlook');


require("dotenv").config();

//index file
const db = require("../models/index");



// ADD TASK
exports.addTask = expressAsyncHandler(async (req, res) => {
  //insert the data
  req.body.createdAt=new Date();
  req.body.updatedAt=new Date()
  let taskObj = await db.TodoTasks.create(req.body);

  //get the admin roleId
  let adminRoleId=await db.Role.findOne({where:{roleName:"admin"}})

  //get the admin mail
  let admin=await db.User.findAll({where:{
    roleId:adminRoleId.dataValues.id
  }})

  let adminMail=admin.map((adminObj,index)=>adminObj.dataValues.email)
    console.log(adminMail)
 
  if (taskObj?.dataValues) {
    //send a mail
    nodeOutlook.sendEmail({
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
      },
      from: process.env.EMAIL,
      to: [req.body.userEmail,adminMail],
      subject: 'New Task Added',
     
      text: `${req.body.taskName} task was added by ${req.body.userEmail} `, onError: (e) => console.log(e),
      onSuccess: (i) => console.log(i)})
   
   
    // send response
    res.status(201).send({
      message: "Task added successfully",
      payload: taskObj.dataValues,
    });
  }
});

//UPDATE TASK
exports.editTask = expressAsyncHandler(async (req, res) => {
  //perform update operation
  let [updated] = await db.TodoTasks.update(
    { taskName: req.body.taskName },
    {
      where: {
        id: req.params.taskId,
      },
    }
  );

  if (updated) {
    // send response
    res.send({ message: "Updated Successfully" });
  }
});

//COMPLETED THE TASK
exports.completedTask = expressAsyncHandler(async (req, res) => {
  //update status
  let [updated] = await db.TodoTasks.update(
    { status: true },
    {
      where: {
        id: req.params.taskId,
      },
    }
  );
  if (updated) {
    // send response
    res.send({ message: "Task Completed" });
  }
});

//GET ALL TASKS OF A USER
exports.allTasks = expressAsyncHandler(async (req, res) => {
  //get tasks
  let tasks = await db.TodoTasks.findAll({
    where: {
      userId: req.params.userId,
    },
    // include models
    include: {
      model: db.Comment,
      attributes: {
        exclude: ["createdAt", "taskId"],
      },
    },
    attributes: {
      exclude: ["userId"],
    },
  });
  tasks = tasks?.map((taskObj) => taskObj.dataValues);
  // send response
  res.send({ message: "All Tasks", payload: tasks });
});
