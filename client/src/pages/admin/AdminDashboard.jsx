import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

const AdminDashboard = () => {
  const { backendUser } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [starterCode, setStarterCode] = useState({ html: "", css: "", js: "", react: "" });
  const [hiddenCode, setHiddenCode] = useState({ css: "", js: "" });
  const [type, setType] = useState("REACT");
  const [activeCodeTab, setActiveCodeTab] = useState("react");
  const [level, setLevel] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Generated Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hints, setHints] = useState(["", "", ""]);
  const [instructionPrompt, setInstructionPrompt] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  const [problems, setProblems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [codePreviewMode, setCodePreviewMode] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  
  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme('ExcodeAdminTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '8791a3' },
        { token: 'string', foreground: 'c0c6db' },
        { token: 'comment', foreground: '424754', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'adc6ff' }
      ],
      colors: {
        'editor.background': '#1c2028',
        'editor.lineHighlightBackground': '#262a33',
        'editorLineNumber.foreground': '#424754',
        'editorIndentGuide.background': '#31353e',
      }
    });
    monaco.editor.setTheme('ExcodeAdminTheme');
    document.fonts.ready.then(() => {
      monaco.editor.remeasureFonts();
    });
  };

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/admin/problems", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadProblemForEdit = (p) => {
    setEditMode(true);
    setEditId(p._id);
    setTitle(p.title);
    setLevel(p.level);
    setDescription(p.description);
    setStarterCode(p.starterCode || { html: "", css: "", js: "", react: p.brokenCode || "" });
    setHiddenCode(p.hiddenCode || { css: "", js: "" });
    setType(p.type || "REACT");
    setHints(p.hints && p.hints.length === 3 ? p.hints : [p.hints[0]||"", p.hints[1]||"", p.hints[2]||""]);
    setInstructionPrompt(p.instructionPrompt || "");
    setExpectedOutput(p.expectedOutput || "");
    setIdea(""); // clear idea since we are editing
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setTitle("");
    setIdea("");
    setStarterCode({ html: "", css: "", js: "", react: "" });
    setHiddenCode({ css: "", js: "" });
    setType("REACT");
    setDescription("");
    setHints(["", "", ""]);
    setInstructionPrompt("");
    setExpectedOutput("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/admin/problems/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProblems();
        if (editId === id) resetForm();
      }
    } catch (e) {
      console.error(e);
    }
  };


  const handleGenerate = async () => {
    if (!idea) return alert("Provide an idea or broken code.");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/admin/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ idea, starterCode, type, level })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate");

      if (data.hiddenCode) {
        setHiddenCode({ css: data.hiddenCode.css || "", js: data.hiddenCode.js || "" });
      }
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
    if (!title || !description || !instructionPrompt) {
      return alert("Please fill all required fields (title, description, starterCode, instructionPrompt)");
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const url = editMode ? `http://localhost:3000/api/admin/problems/${editId}` : "http://localhost:3000/api/admin/problems";
      const method = editMode ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          level,
          description,
          starterCode,
          hiddenCode,
          type,
          hints,
          instructionPrompt,
          expectedOutput
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      alert(`Problem ${editMode ? 'updated' : 'saved'} successfully!`);
      resetForm();
      fetchProblems();
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
      <div className="max-w-screen-2xl mx-auto pb-20 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar List */}
        <div className="w-full lg:w-1/4 glass-panel p-4 rounded-xl border border-outline-variant/30 flex flex-col h-[calc(100vh-100px)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">Problems</h2>
            <button onClick={resetForm} className="bg-primary/20 text-primary p-2 rounded hover:bg-primary/30 transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {problems.map(p => (
              <div key={p._id} className={`p-3 rounded border cursor-pointer group ${editId === p._id ? 'border-primary bg-primary/10' : 'border-outline-variant/30 hover:border-primary/50'}`} onClick={() => loadProblemForEdit(p)}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm truncate pr-2">{p.title}</h3>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} className="text-error/50 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
                <div className="text-xs text-on-surface-variant mt-1">{p.level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-geist font-bold text-primary">{editMode ? 'Edit Problem' : 'Create Problem'}</h1>
              <p className="text-on-surface-variant text-sm">Create or modify coding problems using Groq AI.</p>
            </div>
            {editMode && (
              <button onClick={resetForm} className="text-sm bg-surface-container px-3 py-1 rounded border border-outline-variant hover:bg-white/5">
                Cancel Edit
              </button>
            )}
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
              <label className="block text-sm font-semibold mb-1">Problem Type</label>
              <select 
                value={type} 
                onChange={e => {
                  setType(e.target.value);
                  if (e.target.value === 'REACT') setActiveCodeTab('react');
                  else setActiveCodeTab('html');
                }}
                className="w-full bg-surface-container border border-outline-variant rounded p-2 text-on-surface focus:border-primary outline-none mb-4"
              >
                <option value="REACT">React / MERN</option>
                <option value="HTML">HTML Only</option>
                <option value="CSS">CSS Only</option>
                <option value="JS">JS Only</option>
                <option value="MIX">Frontend Mix (HTML/CSS/JS)</option>
              </select>
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
                placeholder="e.g. Create a vanilla JS toggle button, or a React context..."
              />
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-semibold">Starter Code</label>
                <div className="flex bg-surface-container rounded border border-outline-variant/30 overflow-hidden text-xs">
                  <button onClick={() => setCodePreviewMode(false)} className={`px-3 py-1 ${!codePreviewMode ? 'bg-primary text-background' : 'hover:bg-white/5'}`}>Edit</button>
                  <button onClick={() => setCodePreviewMode(true)} className={`px-3 py-1 ${codePreviewMode ? 'bg-primary text-background' : 'hover:bg-white/5'}`}>Run Preview</button>
                </div>
              </div>
              
              {!codePreviewMode ? (
                <div className="w-full bg-surface-container border border-outline-variant rounded overflow-hidden flex flex-col h-56">
                  {/* Tabs */}
                  <div className="flex border-b border-outline-variant/30 bg-[#181c24] overflow-x-auto custom-scrollbar">
                    {['HTML', 'MIX'].includes(type) && (
                      <button onClick={() => setActiveCodeTab('html')} className={`px-3 py-1.5 text-xs font-jetbrains ${activeCodeTab === 'html' ? 'border-b-2 border-primary text-white bg-white/5' : 'text-on-surface-variant hover:text-white'}`}>index.html</button>
                    )}
                    {['CSS', 'MIX'].includes(type) && (
                      <button onClick={() => setActiveCodeTab('css')} className={`px-3 py-1.5 text-xs font-jetbrains ${activeCodeTab === 'css' ? 'border-b-2 border-primary text-white bg-white/5' : 'text-on-surface-variant hover:text-white'}`}>styles.css</button>
                    )}
                    {['JS', 'MIX'].includes(type) && (
                      <button onClick={() => setActiveCodeTab('js')} className={`px-3 py-1.5 text-xs font-jetbrains ${activeCodeTab === 'js' ? 'border-b-2 border-primary text-white bg-white/5' : 'text-on-surface-variant hover:text-white'}`}>script.js</button>
                    )}
                    {type === 'REACT' && (
                      <button onClick={() => setActiveCodeTab('react')} className={`px-3 py-1.5 text-xs font-jetbrains ${activeCodeTab === 'react' ? 'border-b-2 border-primary text-white bg-white/5' : 'text-on-surface-variant hover:text-white'}`}>App.jsx</button>
                    )}
                    <button onClick={() => setActiveCodeTab('hiddenCss')} className={`px-3 py-1.5 text-xs font-jetbrains text-purple-400 ${activeCodeTab === 'hiddenCss' ? 'border-b-2 border-purple-500 bg-white/5' : 'hover:text-purple-300'}`}>Hidden CSS</button>
                    <button onClick={() => setActiveCodeTab('hiddenJs')} className={`px-3 py-1.5 text-xs font-jetbrains text-purple-400 ${activeCodeTab === 'hiddenJs' ? 'border-b-2 border-purple-500 bg-white/5' : 'hover:text-purple-300'}`}>Hidden JS</button>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <Editor
                      height="100%"
                      language={
                        activeCodeTab === 'html' ? 'html' :
                        (activeCodeTab === 'css' || activeCodeTab === 'hiddenCss') ? 'css' :
                        'javascript'
                      }
                      value={activeCodeTab === 'hiddenCss' ? hiddenCode.css : activeCodeTab === 'hiddenJs' ? hiddenCode.js : starterCode[activeCodeTab] || ""}
                      onChange={(value) => {
                        const val = value || "";
                        if (activeCodeTab === 'hiddenCss') setHiddenCode({...hiddenCode, css: val});
                        else if (activeCodeTab === 'hiddenJs') setHiddenCode({...hiddenCode, js: val});
                        else setStarterCode({...starterCode, [activeCodeTab]: val});
                      }}
                      onMount={handleEditorDidMount}
                      options={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        lineHeight: 24,
                        padding: { top: 16 },
                        quickSuggestions: false,
                        suggestOnTriggerCharacters: false,
                        wordBasedSuggestions: false,
                        parameterHints: { enabled: false },
                        renderLineHighlight: "all",
                        hideCursorInOverviewRuler: true,
                        overviewRulerBorder: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full bg-white border border-outline-variant rounded h-56 overflow-hidden">
                  <iframe 
                    title="Code Preview"
                    sandbox="allow-scripts allow-modals"
                    srcDoc={
                      type === 'REACT' ? "<h1>React Preview Not Supported Yet</h1>" :
                      `<!DOCTYPE html><html><head><style>${hiddenCode.css || ''}\n${starterCode.css || ''}</style></head><body>${starterCode.html || ''}<script>${hiddenCode.js || ''}\n${starterCode.js || ''}</script></body></html>`
                    }
                    className="w-full h-full border-none"
                  />
                </div>
              )}
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
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-semibold text-primary">Problem Description (Markdown)</label>
                <div className="flex bg-surface-container rounded border border-outline-variant/30 overflow-hidden text-xs">
                  <button onClick={() => setPreviewMode(false)} className={`px-3 py-1 ${!previewMode ? 'bg-primary text-background' : 'hover:bg-white/5'}`}>Edit</button>
                  <button onClick={() => setPreviewMode(true)} className={`px-3 py-1 ${previewMode ? 'bg-primary text-background' : 'hover:bg-white/5'}`}>Preview</button>
                </div>
              </div>
              {!previewMode ? (
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full bg-surface-container border border-outline-variant rounded p-2 h-96 font-jetbrains text-sm text-on-surface focus:border-primary outline-none custom-scrollbar"
                />
              ) : (
                <div className="w-full bg-surface-container border border-outline-variant rounded p-4 h-96 overflow-y-auto custom-scrollbar prose prose-invert max-w-none prose-pre:bg-[#0B0F17] prose-pre:border-outline-variant/30 prose-pre:border">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                </div>
              )}
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
              {saving ? "Saving..." : (editMode ? "Update Problem" : "Save Problem to Database")}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
