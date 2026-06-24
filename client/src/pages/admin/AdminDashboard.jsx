import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { backendUser } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [brokenCode, setBrokenCode] = useState("");
  const [level, setLevel] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Generated Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hints, setHints] = useState(["", "", ""]);
  const [instructionPrompt, setInstructionPrompt] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  const handleGenerate = async () => {
    if (!idea && !brokenCode) return alert("Provide an idea or broken code.");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/admin/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ idea, brokenCode, level })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate");

      setDescription(data.description || "");
      setHints(data.hints || ["", "", ""]);
      setInstructionPrompt(data.instructionPrompt || "");
      setExpectedOutput(data.expectedOutput || "");
      
      // Auto-generate title if missing
      if (!title) setTitle(`Problem based on: ${idea.substring(0, 20)}...`);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !description || !brokenCode || !instructionPrompt) {
      return alert("Please fill all required fields (title, description, brokenCode, instructionPrompt)");
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/admin/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          level,
          description,
          brokenCode,
          hints,
          instructionPrompt,
          expectedOutput
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      alert("Problem saved successfully!");
      // Reset
      setTitle("");
      setIdea("");
      setBrokenCode("");
      setDescription("");
      setHints(["", "", ""]);
      setInstructionPrompt("");
      setExpectedOutput("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!backendUser || backendUser.email !== "excode@admin.in") {
    return (
      <div className="flex items-center justify-center h-full p-8 text-on-surface">
        <h1 className="text-2xl font-geist font-bold text-error">Access Denied. Admins Only.</h1>
        <button onClick={() => navigate("/login")} className="ml-4 bg-primary text-on-primary px-4 py-2 rounded">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background text-on-surface p-6 font-inter custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-geist font-bold text-primary">Admin Problem Authoring</h1>
          <p className="text-on-surface-variant text-sm">Create MERN problems using Groq AI.</p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h2 className="text-xl font-semibold">1. Input Setup</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Problem Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full bg-surface-container border border-outline-variant rounded p-2 text-on-surface focus:border-primary outline-none"
                placeholder="e.g. Implement a Debounced Search"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Difficulty Level</label>
              <select 
                value={level} 
                onChange={e => setLevel(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant rounded p-2 text-on-surface focus:border-primary outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Problem Idea / Topic</label>
              <textarea 
                value={idea} 
                onChange={e => setIdea(e.target.value)} 
                className="w-full bg-surface-container border border-outline-variant rounded p-2 h-24 text-on-surface focus:border-primary outline-none custom-scrollbar"
                placeholder="e.g. Create a React context for a shopping cart..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Broken Code (Starter Code)</label>
              <textarea 
                value={brokenCode} 
                onChange={e => setBrokenCode(e.target.value)} 
                className="w-full bg-surface-container border border-outline-variant rounded p-2 h-40 font-jetbrains text-sm text-on-surface focus:border-primary outline-none custom-scrollbar"
                placeholder="import React from 'react';\n\nexport default function App() {\n  return <div>Fix me</div>;\n}"
              />
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined">auto_awesome</span>
              )}
              {loading ? "Generating with Groq..." : "Generate AI Draft"}
            </button>
          </div>

          {/* Output Section */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 space-y-4">
            <h2 className="text-xl font-semibold text-primary">2. AI Generated Content</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-1 text-primary">Problem Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full bg-surface-container border border-outline-variant rounded p-2 h-32 text-on-surface focus:border-primary outline-none custom-scrollbar"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-primary">Hints (Max 3)</label>
              <div className="space-y-2">
                {[0, 1, 2].map(i => (
                  <input 
                    key={i}
                    type="text" 
                    value={hints[i] || ""} 
                    onChange={e => {
                      const newHints = [...hints];
                      newHints[i] = e.target.value;
                      setHints(newHints);
                    }} 
                    className="w-full bg-surface-container border border-outline-variant rounded p-2 text-on-surface focus:border-primary outline-none"
                    placeholder={`Hint ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-primary">Instruction Prompt (Secret Rubric)</label>
              <textarea 
                value={instructionPrompt} 
                onChange={e => setInstructionPrompt(e.target.value)} 
                className="w-full bg-surface-container border border-outline-variant rounded p-2 h-32 text-on-surface focus:border-primary outline-none custom-scrollbar"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1 text-primary">Expected Output</label>
              <textarea 
                value={expectedOutput} 
                onChange={e => setExpectedOutput(e.target.value)} 
                className="w-full bg-surface-container border border-outline-variant rounded p-2 h-20 text-on-surface focus:border-primary outline-none custom-scrollbar"
              />
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#10B981] text-background font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? "Saving..." : "Save Problem to Database"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
