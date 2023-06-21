require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY);

const static=true
const port= 4242
const YOUR_DOMAIN = 'http://localhost:4242'

const db=require("../models/index")

// CHECKOUT SESSION
exports.createCheckoutSession=async(req,res)=>{
//get the prices
    const prices = await stripe.prices.list({
        // lookup_keys: [params['lookup_key']],
        expand: ['data.product']
      });
      console.log("prices data---",req.params.type)
      //session
    try {
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          line_items: [{
            quantity: 1,
            price: prices.data[req.params.type].id
          }],
        //   succes surl
        success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
        // cancel url
        cancel_url: 'http://localhost:3000/login',
        subscription_data: {
          trial_period_days: 7
        }
        });
        
       
        res.send(session.url)
      } catch (error) {
        // Handle error
        console.error(error);
        // You can use the error message to display an appropriate response to the user
      }
      
}

//
exports.caretePortalSession=async(req,res)=>{
    //get session Id
    let sessionId = req.params.sessionId;

    try{
        // const checkoutSession=await stripe.checkout.sessions.retrieve(sessionId)
        // console.log("checkoutSessions",checkoutSession)

        // const session=await stripe.billingPortal.sessions.create({
        //     customer:checkoutSession.customer,
       
        // })
        console.log(req.params.userId)
        let [updated]=await db.User.update({isSubscribed:true},{where:{id:req.params.userId}})
        console.log(updated)
        if(updated){
        res.send({message:"Subscribed"})}
        else{
          res.send({message:"Not updated"})
        }
    }
    catch(err){
        console.log(err)
        res.send({message:err})
    }

}