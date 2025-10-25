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
    console.log(title, content);
    const UserId = req.user.id;
    const promptId = req.params.id;

    // First we Find the User by Given Id
    const TrueUser = await PromptModel.findById(promptId);
    if (!TrueUser) {
      return res.status(404).json({ message: "Prompt Creater is Not Found" });
    }
    if (prompt.owner.toString() !== UserId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this prompt" });
    }
     if (title) prompt.title = title;
    if (content) prompt.content = content;

    return res.status(200).json({
        message:"Prompt updated successfully",prompt
    })

  } catch (err) {
    console.err(err);
    return res
      .status(500)
      .json({ message: "UpdatePrompt Not Succesfully Complited" });
  }
};

// const deletePrompt = async (req, res) => {
//   try {
//   } catch (err) {
//     console.err(err);
//     return res.status(500).json({
//       message: "Ohh no Prompt is Not DeletedSuccesFully!!",
//     });
//   }
// };

module.exports = { createPrompt, listPrompt,updatePrompt };
