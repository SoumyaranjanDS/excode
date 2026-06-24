import { Problem } from "../models/problem.model.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("title level description xp timeEstimation isPublished createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id).select("-instructionPrompt -expectedOutput");
    
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    
    res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Failed to fetch problem details" });
  }
};
