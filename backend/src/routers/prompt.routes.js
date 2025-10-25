const {Router} = require('express');
const {createPrompt,listPrompt,updatePrompt}=require('../controllers/prompt.controller');
const{authMiddleware}=require("../middlewares/auth.middlewares")
const router = Router();

router.post("/createPrompts", authMiddleware,createPrompt);
router.get("/listPrompt", authMiddleware, listPrompt);
router.patch("/prompts/:id", authMiddleware, updatePrompt);
module.exports = router;