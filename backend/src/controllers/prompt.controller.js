
const PromptModel = require('../models/prompt.model');






const createPrompt=async(req,res)=>{
    try{
        
      const {title, content} = req.body;

       const createPrompt=await PromptModel.create({title,content})
       res.status(201).json({
        message:"Prompt Created Succesfully!!",createPrompt
       })


    }catch(e){
        return res.status(500).json({ message: "Title or content is empty", e });
    }
}


module.exports={createPrompt}