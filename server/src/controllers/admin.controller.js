import Groq from "groq-sdk";
import { Problem } from "../models/problem.model.js";


export const generateProblemDetails = async (req, res) => {
  const { idea, brokenCode, level = 'Medium' } = req.body;
  
  if (!idea && !brokenCode) {
    return res.status(400).json({ message: "Provide either a problem idea or broken code to generate." });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY in .env");
    return res.status(500).json({ message: "Server Configuration Error: Missing GROQ_API_KEY. Did you restart the server?" });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `
You are an expert technical interviewer and software architect.
I need to create a coding challenge for a platform like LeetCode but for full-stack/MERN problems.

Here is the context:
Idea/Topic: ${idea || "None provided"}
Broken Code / Starter Code: ${brokenCode || "None provided"}
Difficulty: ${level}

Please generate the following fields in strict JSON format:
1. "description": A professional, clear problem description explaining what the user needs to build or fix.
2. "hints": An array of exactly 3 progressive hints to help the user without giving away the answer.
3. "instructionPrompt": The secret evaluation rubric. This must detail the exact requirements, constraints, and test scenarios. An AI evaluator will use this to grade the user's code later.
4. "expectedOutput": A string describing the exact expected behavior, UI changes, or console output.

Return ONLY a valid JSON object with the keys: "description", "hints", "instructionPrompt", "expectedOutput". Do not include markdown blocks or any other text.
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: process.env.MODEL_ID || "llama3-70b-8192",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    const generatedData = JSON.parse(responseContent);

    res.status(200).json(generatedData);
  } catch (error) {
    console.error("Error generating problem with Groq:", error);
    res.status(500).json({ message: "Failed to generate AI content" });
  }
};

export const saveProblem = async (req, res) => {
  const { title, level, description, brokenCode, hints, expectedOutput, instructionPrompt } = req.body;
  
  try {
    const newProblem = new Problem({
      title,
      level,
      description,
      brokenCode,
      hints,
      expectedOutput,
      instructionPrompt,
      author: req.user.id // Assuming auth middleware is used
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem saved successfully!", problem: newProblem });
  } catch (error) {
    console.error("Error saving problem:", error);
    res.status(500).json({ message: "Failed to save problem" });
  }
};
