//express Router
const express = require("express");
const subscription = express.Router();

//import controllers
const { createCheckoutSession ,caretePortalSession} = require("../controllers/subscription.controller");

//Body Parser
subscription.use(express.json());

//defining routes
subscription.post("/createCheckoutSession/:type",createCheckoutSession);
subscription.get("/createPortalSession/:sessionId/:userId",caretePortalSession)



//export userApp
module.exports = subscription;
