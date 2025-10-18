const {Router} = require('express');
const {createPrompt}=require('../controllers/prompt.controller');

const router = Router();

router.post("/createPrompts", (req, res, next) => {
  
  next();
},createPrompt);

module.exports = router;