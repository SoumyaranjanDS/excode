import Groq from "groq-sdk";
import { Problem } from "../models/problem.model.js";

export const evaluateCode = async (req, res) => {
  const { problemId, code } = req.body;

  if (!problemId || !code) {
    return res.status(400).json({ message: "problemId and code are required." });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY in .env");
    return res.status(500).json({ message: "Server Configuration Error: Missing GROQ_API_KEY." });
  }

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
You are a CLI test runner (like Jest or Mocha) for a coding platform. 
A user has submitted code for a problem. 
Your ONLY job is to read their code (which is provided as a JSON object containing html, css, js, and react fields), evaluate it against the strict grading rubric, and output the result EXACTLY like a modern terminal test runner.

Problem Context:
Title: ${problem.title}
Secret Evaluation Rubric: ${problem.instructionPrompt}

User's Code Submission:
\`\`\`json
${typeof code === 'object' ? JSON.stringify(code, null, 2) : code}
\`\`\`

Strict Output Rules:
1. DO NOT write paragraphs of explanation or markdown headers.
2. DO NOT greet the user or say "Here is the output".
3. Format the output exactly like Jest. Use \`✓\` for passing tests and \`✕\` for failing tests.
4. If a test fails, provide ONE concise line clearly explaining WHAT was missing or incorrect (e.g., 'Missing class .profile-role on <p> tag'). Do NOT just repeat 'Expected X, Received X'.
5. When evaluating HTML or code, ignore formatting and whitespace. Evaluate the structural semantics, classes, and content.
6. At the bottom, provide a single "Test Suites" summary and ONE short hint (max 2 sentences) if they failed.
7. If they pass all requirements, output a green-style passing summary.
7. CRITICAL: On the very last line of your response, you MUST output a raw JSON object stringified in exactly this format, and absolutely nothing else after it:
__METADATA__={"passed": true/false, "timeComplexity": "...", "spaceComplexity": "..."}

Example Failure Output:
FAIL  src/solution.js
  ✕ Debounce behavior (12ms)
    → Expected: No network request until 500ms after user stops typing.
    → Received: Fetch is called on every keystroke.
  ✓ Empty query handling
  ✕ Error handling (4ms)
    → Expected: UI displays error message on fetch failure.
    → Received: No error state found.

Test Suites: 1 failed, 1 total
Tests:       2 failed, 1 passed, 3 total
Time:        0.8s

Hint: Try using \`setTimeout\` inside your \`useEffect\` and return a cleanup function that calls \`clearTimeout\`.
__METADATA__={"passed": false, "timeComplexity": "O(1)", "spaceComplexity": "O(1)"}
`;

    const stream = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: process.env.MODEL_ID || "llama-3.3-70b-versatile",
      temperature: 0.2,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        // SSE format requires data: payload \n\n
        // We encode the content safely
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    console.error("Error during evaluation:", error);
    // If headers are not sent, send a standard JSON error
    if (!res.headersSent) {
      return res.status(500).json({ message: "Evaluation failed." });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Evaluation failed internally." })}\n\n`);
      res.end();
    }
  }
};
