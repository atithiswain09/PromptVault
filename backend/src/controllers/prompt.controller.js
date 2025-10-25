const PromptModel = require("../models/prompt.model");

const createPrompt = async (req, res) => {
  try {
    const { title, content } = req.body;

    const CreatePrompt = await PromptModel.create({
      title,
      content,
      owner: req.user.id,
    });

    res.status(201).json({
      message: "Prompt Created Succesfully!!",
    });
  } catch (e) {
    return res.status(500).json({ message: "Title or content is empty", e });
  }
};

const listPrompt = async (req, res) => {
  try {
    const UserId = req.user.id;
    console.log(UserId);

    const userPrompts = await PromptModel.find({ owner: UserId });

    return res.status(200).json(userPrompts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Content is Not found!!!,", e });
  }
};

const updatePrompt = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const promptId = req.params.id;
    const prompt = await PromptModel.findById(promptId); 
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    if (prompt.owner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this prompt" });
    }

    if (title) prompt.title = title;
    if (content) prompt.content = content;

    await prompt.save();
    return res.status(200).json({
      message: "Prompt updated successfully",
      prompt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Update failed", error: err.message || err });
  }
}
const deletePrompt = async (req, res) => {
  try {
    const promptId=req.params.id;
    const userId=req.user.id;//the user Own Id 
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // useing prompt id we need to find  the user 
    // const prompt=await PromptModel.findById(promptId);
    const prompt = await PromptModel.findById(promptId);
    if (!prompt) return res.status(404).json({ message: "Prompt Not Found!!" });

    if (!prompt.owner || prompt.owner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this prompt" });
    }

    await prompt.deleteOne(); // perform the deletion
    return res.status(200).json({ message: "Prompt deleted successfully" });
  } catch (err) {
    console.err(err);
    return res.status(500).json({
      message: "Ohh no Prompt is Not DeletedSuccesFully!!",
    });
  }
};

module.exports = { createPrompt, listPrompt,updatePrompt,deletePrompt};
