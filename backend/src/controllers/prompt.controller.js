const Prompt = require("../models/prompt.model");
//  Requre model prompt

// We Are Useing Dummy id for ---->
//Create PostMethod ---->Creating Prompt
const createPrompt = async (req, res) => {
  // Extracting Given DataFrom User Like :
  //  When User Create prommpt then it is need to Give promot_title,Prompt_Description,Prompt_tags
  try {          
    const { title, description, tags } = req.body;
          const DummyId="68e290b67a053604aabe87ab"    
    //we Destructure all of Our data , which User Send in ReqObject!
    //2. Now We check the Validation of the Data. Is the Data which is User Given is Correct or Not!!!
    //(i)Then Check String is there or Not!
    // (ii) Then title Type is String Or Not!
    //(iii) first we Remove the Soace of the String...after That Check The Length of the String

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Title is required." });
    }
    // Now we Check the Validation of the description:-Description is That thing that user want to Get Informetion!!!
    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Description is required and max 5000 chars" });
    }
    if (tags) {
      if (
        !Array.isArray(tags) ||
        tags.length > 10 ||
        !tags.every((tag) => typeof tag === "string")
      )
        return res.status(400).json({
          message: "Tags must be array of max 10 strings, each max 30 chars",
        });
    }

    // create prompt

    const prompt = new Prompt({
      title: title.trim(),
      description: description.trim(),
      owner:DummyId,
      tags: tags || [],
    });

     const savedPrompt = await prompt.save();
    return res.status(201).json({
      message: "Prompt created successfully!",
      savedPrompt
      // prompt: savedPrompt, 
    });

  } catch (error) {
    // catch(error):this Error is Catch all of the Error is Object Form
    // if any uneXpected Error is Occer then :-This Console Error Will Print
    console.error("Error creating prompt:", error);
    // 500 (Internal Server Error)--->this Error is Came!!!When Clinet Make Any Mistek
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
};

module.exports = { createPrompt };
