const { Job } = require("bull");
const nodeOutlook = require("nodejs-nodemailer-outlook");
require("dotenv").config();
const db = require("../models/index");
const { sendMail } = require("../common/email");

const emailProcess = async (job) => {
  //get incompleted tasks
  try {
    let tasks = await db.TodoTasks.findAll({
      where: { status: false },
      include: {
        model: db.User,
        attributes: {
          exclude: ["id","password","createdAt","updatedAt","roleId"],
        },
      },
    });


    //get userIds and tasks whos tasks are incompleted
    let task = {};
    let userIds = [];
    tasks.forEach((taskObj) => {
     
      if (task[taskObj.dataValues.User.email])
        task[taskObj.dataValues.User.email].push(taskObj.dataValues.taskName);
      else {
        // userIds.push(taskObj.dataValues.userId);
        task[taskObj.dataValues.User.email] = [taskObj.dataValues.taskName];
      }
    });

    // await Promise.all(
    //   userIds.map(async (userObj, index) => {
    //     //getting emails
    //     let userEmail = await db.User.findOne({ where: { id: userObj } });
    //     // console.log("userEmail", userEmail.email);
    //     // console.log("-----------------------",userTasks[userObj])
    //     task[userEmail.email] = task[userObj];
    //     delete task[userObj];
    //     //  userTasks[userEmail]=userTasks[userObj]
    //   })
    // );

    for (userEmail in task) {
      console.log("-----------------------------------------------------------------------tasks",task[userEmail])
      const subject = "Remainder : Incomplete Tasks";
      const text = `hey you have incomplete tasks in your dashboard please try to complete them 
                      Incomplete tasks details : ${task[userEmail]}`;
      await sendMail(userEmail, subject, text);
    }
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = emailProcess;
