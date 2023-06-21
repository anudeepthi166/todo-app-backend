const Bull = require("bull");
const emailProcess = require("../processes/email.process");

require("dotenv").config();

const emailQueue = new Bull("emailQueue", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_URI,
    maxRetriesPerRequest: null,
  },
});

emailQueue.process(emailProcess);

emailQueue.add(
  {},
  {
    repeat: {
      cron: "0 19 * * *",
    },
  }
);
