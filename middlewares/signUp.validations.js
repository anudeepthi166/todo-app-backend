const Joi =require("joi")

exports.signUpValidations=(req,res,next)=>{
    const user=Joi.object({
    userName:Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required(),

    email:Joi.string().email({tlds:{allow:['com']}}).required(),

    password:Joi.string().alphanum().min(3).required(),
   

})
try{let validation=user.validate(req.body)
if(validation.error){
   res.status(400).send(validation.error.details[0])
}
else{next()}}

catch(err){
   res.status(400).send("Validation Error",err)
}

}

