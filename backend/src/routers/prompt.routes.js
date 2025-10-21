const {Router} = require('express');
const {createPrompt}=require('../controllers/prompt.controller');

const router = Router();

router.post("/createPrompts",createPrompt);

module.exports = router;