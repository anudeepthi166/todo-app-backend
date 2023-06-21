const expressAsyncHandler = require("express-async-handler");
//nodejs-nodemailer-outlook
const nodeOutlook = require("nodejs-nodemailer-outlook");

const sendNewEmail = require("../queues/email.queue");

const {sendMail}=require("../common/email")

require("dotenv").config();

//index file
const db = require("../models/index");

//setup the mailOptions
const mailOptions = {
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
};

// ADD TASK
exports.addTask = expressAsyncHandler(async (req, res) => {
  //insert the data
  req.body.createdAt = new Date();
  req.body.updatedAt = new Date();
  let taskObj = await db.TodoTasks.create(req.body);

  //get the admin roleId
  let adminRoleId = await db.Role.findOne({ where: { roleName: "admin" } });

  //get the admin mail
  let admin = await db.User.findAll({
    where: {
      roleId: adminRoleId.dataValues.id,
    },
  });

  let adminMail = admin.map((adminObj, index) => adminObj.dataValues.email);
  console.log(adminMail);

  if (taskObj?.dataValues) {
    to=[req.body.userEmail,... adminMail]
    subject="New Task Added",
    text=`${req.body.taskName} task was added by ${req.body.userEmail} `
    //send a mail
    sendMail(to,subject,text)
    
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

//get incompleted tasks
exports.inCompletedTasks = expressAsyncHandler(async (req, res) => {
  // //get incompleted tasks
  // let tasks = await db.TodoTasks.findAll({ where: { status: false } });
  // //get userIds and tasks whos tasks are incompleted
  // let task = tasks.map((taskObj, index) => {
  //   return {
  //     userId: taskObj.dataValues.userId,
  //     taskName: taskObj.dataValues.taskName,
  //   };
  // });

  // // get userIds
  // let userIds = task.map((taskObj, index) => {
  //   return taskObj.userId;
  // });

  // //convert to array
  // userIds = new Set(userIds);
  // userIds = Array.from(userIds);


  // //get the tasks of particular user
  // let userTasks = {};
  // for (id of userIds) {
  
  //   //get tasks
  //   let tasks = [];
  //   task.map((taskObj, index) => {
  //     if (taskObj.userId === id) {
  //       tasks.push(taskObj.taskName);
  //     }
  //   });
   
  //   //assign tasks of that user
  //   userTasks[id] = tasks;
  // }
  

 
  // await Promise.all(
  //   userIds.map(async (userObj, index) => {
  //     let userEmail = await db.User.findOne({ where: { id: userObj } });
  //     console.log("userEmail",userEmail.email)
  //     // console.log("-----------------------",userTasks[userObj])
  //     userTasks[userEmail.email]=userTasks[userObj]
  //     delete userTasks[userObj]
  //   //  userTasks[userEmail]=userTasks[userObj]
  //   })
  // );

  // console.log("----", userTasks);

  // await sendNewEmail(userTasks)

  // res.send({ message: "Ok" });
});
