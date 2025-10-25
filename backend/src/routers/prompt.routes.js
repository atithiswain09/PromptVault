const {Router} = require('express');
const {createPrompt,listPrompt,deletePrompt,updatePrompt}=require('../controllers/prompt.controller');
const{authMiddleware}=require("../middlewares/auth.middlewares")
const router = Router();

router.post("/createPrompts", authMiddleware,createPrompt);
router.get("/listPrompt", authMiddleware, listPrompt);
router.patch("/updatePrompt/:id", authMiddleware, updatePrompt);
router.delete("/deletePrompt/:id", authMiddleware, deletePrompt);
module.exports = router;