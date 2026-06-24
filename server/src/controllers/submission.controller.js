import { Submission } from "../models/submission.model.js";
import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";

// Save a new submission
export const saveSubmission = async (req, res) => {
  try {
    const { problemId, code, timeComplexity, spaceComplexity, status } = req.body;
    const userId = req.user.id;

    if (!problemId || !code) {
      return res.status(400).json({ message: "problemId and code are required." });
    }

    let submission = await Submission.findOne({ userId, problemId });

    if (submission) {
      // Update existing
      submission.code = code;
      submission.timeComplexity = timeComplexity;
      submission.spaceComplexity = spaceComplexity;
      submission.status = status;
      if (status === 'PASS' && !submission.firstPassedAt) {
        submission.firstPassedAt = new Date();
      }
      await submission.save();
    } else {
      // Create new
      submission = await Submission.create({
        userId,
        problemId,
        code,
        timeComplexity,
        spaceComplexity,
        status,
        firstPassedAt: status === 'PASS' ? new Date() : null
      });
    }

    res.status(200).json({ message: "Submission saved successfully!", submission });
  } catch (error) {
    console.error("Save submission error:", error);
    res.status(500).json({ message: "Failed to save submission." });
  }
};

// Get user's submission for a specific problem
export const getSubmission = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findOne({ userId, problemId });
    if (!submission) {
      return res.status(200).json({ code: null, message: "No submission found." });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error("Get submission error:", error);
    res.status(500).json({ message: "Failed to fetch submission." });
  }
};

export const getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all submissions for the user that passed
    const submissions = await Submission.find({ userId, status: 'PASS' }).populate('problemId', 'level xp');

    let totalXP = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    const submissionDates = [];

    // Group dates to calculate streak
    const activeDates = new Set();
    const solvedProblemIds = [];

    submissions.forEach(sub => {
      // XP and Level stats
      if (sub.problemId) {
        solvedProblemIds.push(sub.problemId._id);
        totalXP += sub.problemId.xp || 0;
        if (sub.problemId.level === 'Easy') easySolved++;
        else if (sub.problemId.level === 'Medium') mediumSolved++;
        else if (sub.problemId.level === 'Hard') hardSolved++;
      }

      // Heatmap dates using firstPassedAt
      if (sub.firstPassedAt) {
        submissionDates.push(sub.firstPassedAt);
        const dateStr = new Date(sub.firstPassedAt).toISOString().split('T')[0];
        activeDates.add(dateStr);
      } else if (sub.updatedAt) {
        // Fallback for older documents before firstPassedAt existed
        submissionDates.push(sub.updatedAt);
        const dateStr = new Date(sub.updatedAt).toISOString().split('T')[0];
        activeDates.add(dateStr);
      }
    });

    const totalSolved = easySolved + mediumSolved + hardSolved;

    // Calculate basic streak (consecutive days ending today or yesterday)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sortedDates = Array.from(activeDates).sort().reverse();
    
    if (sortedDates.length > 0) {
      const lastActiveDate = new Date(sortedDates[0]);
      lastActiveDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - lastActiveDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays <= 1) {
        streak = 1;
        let currentDate = lastActiveDate;
        for (let i = 1; i < sortedDates.length; i++) {
          const nextDate = new Date(sortedDates[i]);
          nextDate.setHours(0, 0, 0, 0);
          const diff = Math.ceil(Math.abs(currentDate - nextDate) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streak++;
            currentDate = nextDate;
          } else {
            break;
          }
        }
      }
    }


    // Fetch total problem counts
    const totalEasy = await Problem.countDocuments({ level: 'Easy' });
    const totalMedium = await Problem.countDocuments({ level: 'Medium' });
    const totalHard = await Problem.countDocuments({ level: 'Hard' });
    const totalProblems = totalEasy + totalMedium + totalHard;

    // Fetch total users for global rank UI
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalProblems,
      totalEasy,
      totalMedium,
      totalHard,
      totalXP,
      streak,
      submissionDates,
      totalUsers,
      solvedProblemIds
    });

  } catch (error) {
    console.error("Get profile stats error:", error);
    res.status(500).json({ message: "Failed to fetch profile stats." });
  }
};
