const Joi =require("joi")

exports.taskNameValidation=(req,res,next)=>{
    const user=Joi.object({
    

    taskName:Joi.string().required(),
    userId:Joi.number().integer(),
    userEmail:Joi.string().required()


    
   

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

