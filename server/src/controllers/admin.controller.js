import Groq from "groq-sdk";
import { Problem } from "../models/problem.model.js";


export const generateProblemDetails = async (req, res) => {
  const { idea, starterCode, type = 'REACT', level = 'Medium' } = req.body;
  
  if (!idea) {
    return res.status(400).json({ message: "Provide a problem idea to generate." });
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
I need to create a coding challenge for a platform like LeetCode but for web development (HTML/CSS/JS, React, or Node.js).

Here is the context:
Idea/Topic: ${idea || "None provided"}
Problem Type: ${type}
Starter Code HTML: ${starterCode?.html || "None"}
Starter Code CSS: ${starterCode?.css || "None"}
Starter Code JS: ${starterCode?.js || "None"}
Starter Code React: ${starterCode?.react || "None"}
Difficulty: ${level}

Please generate the following fields in strict JSON format:
1. "description": A professional, clear problem description formatted in Markdown. It MUST include these sections:
   - A general description paragraph.
   - "### Examples" with at least two examples (each containing Input, Output, and Explanation).
   - "### Constraints" listing bullet points of constraints.
   - "### Follow-up" with a follow up question.
2. "hints": An array of exactly 3 progressive hints to help the user without giving away the answer.
3. "instructionPrompt": The secret evaluation rubric. This must detail the exact requirements, constraints, and test scenarios. An AI evaluator will use this to grade the user's code later.
4. "expectedOutput": A string describing the exact expected behavior, UI changes, or console output.
5. "hiddenCode" (Optional): If the problem requires a beautiful pre-defined CSS environment, output a JSON object with a "css" key containing the styles. The problem description MUST instruct the user to use those specific class names to see the design.

Return ONLY a valid JSON object with the keys: "description", "hints", "instructionPrompt", "expectedOutput", and optionally "hiddenCode". Do not include markdown blocks or any other text.
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
  const { title, level, description, starterCode, hiddenCode, type, hints, instructionPrompt, expectedOutput } = req.body;
  
  try {
    const newProblem = new Problem({
      title,
      level,
      description,
      starterCode,
      hiddenCode,
      type,
      hints,
      expectedOutput,
      instructionPrompt,
      author: req.user.id
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem saved successfully!", problem: newProblem });
  } catch (error) {
    console.error("Error saving problem:", error);
    res.status(500).json({ message: "Failed to save problem" });
  }
};

export const getAllProblemsAdmin = async (req, res) => {
  try {
    const problems = await Problem.find().select("-instructionPrompt").sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { title, level, description, starterCode, hiddenCode, type, hints, instructionPrompt, expectedOutput } = req.body;
  
  try {
    const problem = await Problem.findByIdAndUpdate(
      id,
      { title, level, description, starterCode, hiddenCode, type, hints, expectedOutput, instructionPrompt },
      { new: true, runValidators: true }
    );
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ message: "Problem updated successfully!", problem });
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: "Failed to update problem" });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findByIdAndDelete(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ message: "Problem deleted successfully!" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Failed to delete problem" });
  }
};
