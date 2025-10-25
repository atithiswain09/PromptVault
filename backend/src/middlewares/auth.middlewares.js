// create a middleware
// verify the token from cookie, if fails return 401
// extract the decoded
const jwt = require('jsonwebtoken');
const userModel=require("../models/user.model");



const authMiddleware=async(req,res,next)=>{
    // Check the Cookie
   const token= req.cookies.token;

   if(!token){
    res.status(401).json({
        message:"Sorry You are unauthorized users!!"
    })
   }
   try{
    //   We decode the Cookie token from the cookie , where we store in token Varible
    const decode=jwt.verify(token,process.env.JWT_SECRET);
       
    const user=await userModel.findOne({
        _id:decode.id
    }) 
    req.user=user
    next();

   }catch(err){
     console.error("Unothorise !! ,Login Again!!");
        return res.status(401).json({
            message:"Inavalid Token,pleass Login Again!!!"
            ,err
        })
   }
}

module.exports={authMiddleware}