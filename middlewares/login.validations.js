const Joi =require("joi")

exports.loginValidations=(req,res,next)=>{
    const user=Joi.object({
    

    email:Joi.string().email({tlds:{allow:['com']}}).required(),

    password:Joi.string().alphanum().required(),
   

})
try{let validation=user.validate(req.body)
if(validation.error){
   res.send(validation.error.details[0])
}
else{next()}}

catch(err){
   res.status(400).send("Validation Error",err)
}

}

