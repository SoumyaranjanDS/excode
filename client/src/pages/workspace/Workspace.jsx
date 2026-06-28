import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { useAuth } from '../../context/AuthContext';

const INITIAL_CODE = `import { db } from '../db/postgres';
import { redis } from '../cache/redisClient';
import { generateToken } from '../utils/crypto';

// TODO: Fix the race condition in this function
export const registerUser = async (userData) => {
  try {
    // 1. Write to DB
    const user = await db.users.insert(userData);
    
    // 2. Generate Session Token
    const token = generateToken(user.id);
    
    // 3. Store in Redis (FIRE AND FORGET - THIS IS THE ISSUE)
    redis.setEx(\`session:\${token}\`, 3600, JSON.stringify({ userId: user.id }));
    
    // 4. Return immediately
    return { user, token };
  } catch (error) {
    throw new Error('Registration failed');
  }
};
`;

const Workspace = () => {
  const { problemId } = useParams();
  const { backendUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState({ html: "", css: "", js: "", react: "" });
  const [activeTab, setActiveTab] = useState('App.jsx');
  const [terminalTab, setTerminalTab] = useState('Terminal');
  const [loading, setLoading] = useState(true);
  
  const [terminalOutput, setTerminalOutput] = useState("dev-arena@workspace:~/challenge$ ready\n");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionStats, setSubmissionStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProblemAndSubmission = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch problem
        const response = await fetch(`http://localhost:3000/api/problems/${problemId}`);
        if (!response.ok) throw new Error("Failed to fetch problem");
        const data = await response.json();
        setProblem(data);

        // Fetch saved submission if token exists
        let savedCode = null;
        if (token) {
          const subRes = await fetch(`http://localhost:3000/api/submissions/${problemId}`, { headers });
          if (subRes.ok) {
            const subData = await subRes.json();
            if (subData.code) savedCode = subData.code;
          } else if (subRes.status === 401) {
            await logout();
            navigate('/login');
            return;
          }
        }
        
        const localDraft = localStorage.getItem(`draft_${problemId}`);
        let initialCode = { html: "", css: "", js: "", react: "" };
        if (localDraft) {
          try { initialCode = JSON.parse(localDraft); } catch (e) { initialCode.react = localDraft; }
        } else if (savedCode && typeof savedCode === 'object') {
          initialCode = savedCode;
        } else if (data.starterCode) {
          initialCode = data.starterCode;
        } else {
          initialCode.react = data.brokenCode || "// Start coding here";
        }
        setCode(initialCode);
        
        // Set initial active tab based on problem type
        if (['HTML', 'MIX'].includes(data.type)) setActiveTab('index.html');
        else if (data.type === 'CSS') setActiveTab('styles.css');
        else if (data.type === 'JS') setActiveTab('script.js');
        else setActiveTab('App.jsx');
        
        // Auto open Web Preview if it's a frontend problem
        if (['HTML', 'CSS', 'MIX'].includes(data.type)) {
            setTerminalTab('Web Preview');
        }
      } catch (error) {
        console.error("Error loading problem/submission:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (problemId) {
      fetchProblemAndSubmission();
    }
  }, [problemId]);

  useEffect(() => {
    if (!loading && problemId && code) {
      localStorage.setItem(`draft_${problemId}`, JSON.stringify(code));
    }
  }, [code, problemId, loading]);

  const evaluateCode = async (isFinalSubmit = false) => {
    if (isFinalSubmit) setIsSubmitting(true);
    else setIsEvaluating(true);
    
    setTerminalTab('Terminal');
    setTerminalOutput(`dev-arena@workspace:~/challenge$ npm run evaluate${isFinalSubmit ? ' --submit' : ''}\n> Evaluating solution...\n\n`);
    
    let accumulatedOutput = "";
    let finalMetadata = null;

    try {
      const response = await fetch("http://localhost:3000/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code })
      });

      if (!response.ok) throw new Error("Failed to evaluate");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  accumulatedOutput += data.content;
                  setTerminalOutput(prev => prev + data.content);
                } else if (data.error) {
                  setTerminalOutput(prev => prev + "\n[ERROR] " + data.error);
                }
              } catch(e) {}
            }
          }
        }
      }

      // At the end of the stream, extract metadata from the fully assembled string
      if (accumulatedOutput.includes('__METADATA__=')) {
        const match = accumulatedOutput.match(/__METADATA__=(.*)/);
        if (match && match[1]) {
          try {
            finalMetadata = JSON.parse(match[1].trim());
          } catch(e) {
            console.error("Failed to parse metadata", e);
          }
        }
      }

      // Handle Final Submit Saving
      if (isFinalSubmit && finalMetadata && finalMetadata.passed) {
        const token = localStorage.getItem('token');
        if (token) {
          const submitRes = await fetch("http://localhost:3000/api/submissions/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              problemId,
              code,
              timeComplexity: finalMetadata?.timeComplexity || "O(n)",
              spaceComplexity: finalMetadata?.spaceComplexity || "O(1)",
              status: finalMetadata?.passed ? "PASS" : "FAIL"
            })
          });
          if (submitRes.status === 401) {
            await logout();
            navigate('/login');
            return;
          }
          setSubmissionStats(finalMetadata);
          setShowSuccessModal(true);
        } else {
          setTerminalOutput(prev => prev + "\n[ERROR] Must be logged in to submit.");
        }
      } else if (isFinalSubmit && finalMetadata && !finalMetadata.passed) {
         setTerminalOutput(prev => prev + "\n\n[INFO] Tests failed. Fix your code before submitting.");
      }

    } catch (error) {
      setTerminalOutput(prev => prev + "\n[ERROR] Failed to reach evaluation engine.");
    } finally {
      setIsEvaluating(false);
      setIsSubmitting(false);
    }
  };

  // Custom resizing state
  const [leftWidth, setLeftWidth] = useState(320);
  const [rightWidth, setRightWidth] = useState(280);
  const [terminalHeight, setTerminalHeight] = useState(256);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingLeft) {
        let newWidth = e.clientX;
        if (newWidth < 70) newWidth = 70; // 320 - 250
        if (newWidth > 570) newWidth = 570; // 320 + 250
        setLeftWidth(newWidth);
      } else if (isDraggingRight) {
        let newWidth = document.body.clientWidth - e.clientX;
        if (newWidth < 30) newWidth = 30; // 280 - 250
        if (newWidth > 530) newWidth = 530; // 280 + 250
        setRightWidth(newWidth);
      } else if (isDraggingTerminal) {
        let newHeight = document.body.clientHeight - e.clientY;
        if (newHeight < 50) newHeight = 50; 
        if (newHeight > 506) newHeight = 506; // 256 + 250
        setTerminalHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
      setIsDraggingTerminal(false);
    };

    if (isDraggingLeft || isDraggingRight || isDraggingTerminal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDraggingTerminal ? 'row-resize' : 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, isDraggingTerminal]);

  const renderTerminalOutput = () => {
    return terminalOutput.split('\n').filter(line => !line.includes('__METADATA__=')).map((line, i) => {
      if (!line.trim() && i !== 0) return <div key={i} className="h-2"></div>; // Spacing for empty lines

      let className = "text-[#c2c6d6] leading-relaxed";

      if (line.startsWith('dev-arena@workspace')) {
        className = "text-[#8c909f] mb-2";
      } else if (line.startsWith('>')) {
        className = "text-[#facc15] mb-2";
      } else if (line.includes('→ Expected:')) {
        className = "text-green-400/80 pl-6";
      } else if (line.includes('→ Received:')) {
        className = "text-error/80 pl-6";
      } else if (line.match(/^Test Suites:|^Tests:|^Time:/)) {
        className = "text-[#8c909f] font-semibold";
      } else if (line.startsWith('Hint:')) {
        className = "text-primary mt-4 p-3 bg-primary/5 border border-primary/20 rounded-md";
      } else if (line.includes('✕') || line.includes('FAIL')) {
        className = "text-error mt-2";
      } else if (line.includes('✓') || line.includes('PASS')) {
        className = "text-green-400 mt-2";
      }

      // Bold specific keywords inside the line
      const formattedLine = line
        .replace(/FAIL/g, '<span class="text-error font-bold px-1 bg-error/10 rounded">FAIL</span>')
        .replace(/PASS/g, '<span class="text-green-400 font-bold px-1 bg-green-500/10 rounded">PASS</span>')
        .replace(/✕/g, '<span class="text-error font-bold">✕</span>')
        .replace(/✓/g, '<span class="text-green-400 font-bold">✓</span>')
        .replace(/Expected:/g, '<span class="text-green-400 font-semibold">Expected:</span>')
        .replace(/Received:/g, '<span class="text-error font-semibold">Received:</span>')
        .replace(/Hint:/g, '<span class="text-primary font-bold">💡 Hint:</span>');

      return (
        <div key={i} className={className} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  const handleEditorBeforeMount = (monaco) => {
    // Define a custom theme that matches the specific #262626 background
    monaco.editor.defineTheme('ExcodeTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '8791a3' },
        { token: 'string', foreground: 'c0c6db' },
        { token: 'comment', foreground: '424754', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'adc6ff' }
      ],
      colors: {
        'editor.background': '#262626',
        'editor.lineHighlightBackground': '#333333',
        'editorLineNumber.foreground': '#424754',
        'editorIndentGuide.background': '#333333',
      }
    });
  };

  const handleEditorDidMount = (editor, monaco) => {

    // Force Monaco to recalculate character widths once web fonts are fully loaded
    document.fonts.ready.then(() => {
      monaco.editor.remeasureFonts();
    });
  };

  return (
    <div className="bg-[#262626] text-[#dfe2ee] h-screen flex flex-col overflow-hidden font-inter">
      
      {/* Workspace Top Navigation */}
      <header className="h-12 border-b border-white/10 bg-[#333333] flex items-center justify-between px-4 shrink-0 z-20 shadow-sm shadow-black/20">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="flex items-center gap-2 text-[#c2c6d6] hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            <span className="text-sm font-medium">Problems</span>
          </Link>
          <div className="w-px h-5 bg-white/10 hidden sm:block"></div>
          <div className="items-center gap-2 hidden sm:flex">
            <span className="text-sm font-medium text-white truncate max-w-[200px] lg:max-w-[400px]">
              {loading ? "Loading..." : problem?.title}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="text-[#c2c6d6] hover:text-white transition-colors flex items-center justify-center p-1.5 rounded hover:bg-white/5">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="w-px h-5 bg-white/10 hidden sm:block"></div>
          <Link to="/dashboard" className="flex items-center gap-2 hover:bg-white/5 p-1 rounded-lg transition-colors ml-1">
            <img 
              src={backendUser?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAgIGP3kJBWkWCRd_1qtVQSDRKnCJEu9Jx6Hu-qyKQ7_1v1BRL9FkODk-3Qgs1m-ytPBzg0CtZ_BTQ7OT36VRUyZfuH9yiBuOI0NaLnoEF1dvCchH3xp9xtFkxj1661CAVrOh-yFjY03vq4ImNKJkosfwjT8aS2XPGuaewhDcdO_kWAlSxZ0x1e7hoIBJywTT7I6ZSjW2AzcL0RoBu1kRe3TNcuYw6v-o6ejZrthvu3stRES6oLALVKeTXRv9j4Ht-QhuLV80KB-FGV"} 
              alt="profile" 
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {backendUser?.name || "Soumyaranjan"}
              </span>
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5 leading-none">
                <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                15 Day Streak
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Problem Description */}
        <aside 
          style={{ width: `${leftWidth}px` }}
          className="flex flex-col bg-[#262626] border-b lg:border-b-0 shrink-0 relative"
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#333333] shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">description</span>
              <span className="text-xs font-jetbrains uppercase tracking-wider font-semibold">Description</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[#c2c6d6] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">history</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scroll-hidden">
            {loading ? (
              <div className="flex justify-center py-10">
                <span className="material-symbols-outlined animate-spin text-primary">refresh</span>
              </div>
            ) : problem ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-jetbrains uppercase border ${
                    problem.level === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    problem.level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {problem.level}
                  </span>
                  <span className="px-2 py-1 bg-[#404040] text-[#c2c6d6] rounded text-xs font-jetbrains uppercase border border-white/10">Full Stack</span>
                </div>
                <h1 className="text-2xl font-geist font-semibold text-white mb-4">{problem.title}</h1>
                
                <div className="text-sm text-[#c2c6d6] space-y-4">
                  <div className="prose prose-invert max-w-none prose-pre:bg-[#333333] prose-pre:border-white/10 prose-pre:border">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {problem.description}
                    </ReactMarkdown>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-error">Failed to load problem.</div>
            )}
          </div>
        </aside>

        {/* Left Resize Handle */}
        <div 
          onMouseDown={(e) => { e.preventDefault(); setIsDraggingLeft(true); }}
          className="w-1 cursor-col-resize bg-white/10 hover:bg-primary/50 active:bg-primary transition-colors flex items-center justify-center relative z-10 shrink-0"
        >
          <div className="absolute rounded-full bg-white/20 pointer-events-none w-0.5 h-6" />
        </div>

        {/* Center Panel: Editor & Terminal */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#262626]">
          
          {/* Editor Header */}
          <div className="h-10 border-b border-white/10 bg-[#333333] flex items-center px-2 gap-2 overflow-x-auto scroll-hidden shrink-0">
            {problem && ['HTML', 'MIX'].includes(problem.type) && (
              <div onClick={() => setActiveTab('index.html')} className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${activeTab === 'index.html' ? 'bg-[#262626] border-t-2 border-primary border-r border-l border-white/10 rounded-t-md' : 'text-[#c2c6d6] hover:bg-[#404040] rounded'}`}>
                <span className="text-xs font-jetbrains text-orange-400">html</span>
                <span className="text-xs font-jetbrains">index.html</span>
              </div>
            )}
            {problem && ['CSS', 'MIX'].includes(problem.type) && (
              <div onClick={() => setActiveTab('styles.css')} className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${activeTab === 'styles.css' ? 'bg-[#262626] border-t-2 border-primary border-r border-l border-white/10 rounded-t-md' : 'text-[#c2c6d6] hover:bg-[#404040] rounded'}`}>
                <span className="text-xs font-jetbrains text-blue-400">css</span>
                <span className="text-xs font-jetbrains">styles.css</span>
              </div>
            )}
            {problem && ['JS', 'MIX'].includes(problem.type) && (
              <div onClick={() => setActiveTab('script.js')} className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${activeTab === 'script.js' ? 'bg-[#262626] border-t-2 border-primary border-r border-l border-white/10 rounded-t-md' : 'text-[#c2c6d6] hover:bg-[#404040] rounded'}`}>
                <span className="text-xs font-jetbrains text-yellow-400">js</span>
                <span className="text-xs font-jetbrains">script.js</span>
              </div>
            )}
            {(!problem || problem.type === 'REACT') && (
              <div onClick={() => setActiveTab('App.jsx')} className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${activeTab === 'App.jsx' ? 'bg-[#262626] border-t-2 border-primary border-r border-l border-white/10 rounded-t-md' : 'text-[#c2c6d6] hover:bg-[#404040] rounded'}`}>
                <span className="text-xs font-jetbrains text-cyan-400">jsx</span>
                <span className="text-xs font-jetbrains">App.jsx</span>
              </div>
            )}
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              language={activeTab === 'index.html' ? 'html' : activeTab === 'styles.css' ? 'css' : 'javascript'}
              value={activeTab === 'index.html' ? code.html : activeTab === 'styles.css' ? code.css : activeTab === 'script.js' ? code.js : code.react}
              onChange={(value) => {
                const newCode = { ...code };
                if (activeTab === 'index.html') newCode.html = value;
                else if (activeTab === 'styles.css') newCode.css = value;
                else if (activeTab === 'script.js') newCode.js = value;
                else newCode.react = value;
                setCode(newCode);
              }}
              beforeMount={handleEditorBeforeMount}
              onMount={handleEditorDidMount}
              theme="ExcodeTheme"
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
                automaticLayout: true,
                wordWrap: "on"
              }}
            />
          </div>

          {/* Terminal Resize Handle */}
          <div 
            onMouseDown={(e) => { e.preventDefault(); setIsDraggingTerminal(true); }}
            className="h-1 cursor-row-resize bg-white/10 hover:bg-primary/50 active:bg-primary transition-colors flex items-center justify-center relative z-10 shrink-0"
          >
            <div className="absolute rounded-full bg-white/20 pointer-events-none h-0.5 w-6" />
          </div>

          {/* Terminal Section */}
          <div 
            style={{ height: `${terminalHeight}px` }}
            className="bg-[#262626] flex flex-col shrink-0"
          >
            <div className="flex items-center justify-between px-4 border-b border-white/10 bg-[#333333] h-10 shrink-0">
              <div className="flex items-center gap-4 h-full">
                {['Terminal', 'Web Preview'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setTerminalTab(tab)}
                    className={`text-xs font-jetbrains uppercase h-full border-b-2 transition-colors ${terminalTab === tab ? 'text-white border-primary' : 'text-[#c2c6d6] border-transparent hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto font-jetbrains text-xs bg-[#262626] text-[#c2c6d6] scroll-hidden">
              {terminalTab === 'Web Preview' ? (
                <iframe 
                  title="Web Preview"
                  sandbox="allow-scripts allow-modals"
                  srcDoc={`<!DOCTYPE html><html><head><style>${problem?.hiddenCode?.css || ''}\n${code?.css || ''}</style></head><body>${problem?.hiddenCode?.html || ''}\n${code?.html || ''}<script>${problem?.hiddenCode?.js || ''}\n${code?.js || ''}</script></body></html>`}
                  className="w-full h-full border-none bg-white"
                />
              ) : (
                <div className="p-4 h-full">
                  {renderTerminalOutput()}
                  {isEvaluating && <div className="mt-2 text-primary flex items-center gap-2"><span className="animate-pulse w-2 h-4 bg-primary inline-block"></span></div>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Resize Handle */}
        <div 
          onMouseDown={(e) => { e.preventDefault(); setIsDraggingRight(true); }}
          className="w-1 cursor-col-resize bg-white/10 hover:bg-primary/50 active:bg-primary transition-colors flex items-center justify-center relative z-10 shrink-0"
        >
          <div className="absolute rounded-full bg-white/20 pointer-events-none w-0.5 h-6" />
        </div>

        {/* Right Panel: AI & Actions */}
        <aside 
          style={{ width: `${rightWidth}px` }}
          className="flex flex-col bg-[#262626] border-t lg:border-t-0 shrink-0 relative"
        >
          <div className="p-3 border-b border-white/10 bg-[#333333] flex justify-between items-center h-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#bdc7d9] text-[20px]">smart_toy</span>
              <span className="text-xs font-jetbrains uppercase font-semibold text-white">Arena AI</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* AI Hint Card */}
            <div className="bg-[#404040] rounded-lg border border-white/10 p-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">lightbulb</span>
                <div>
                  <h4 className="text-sm font-medium text-white">Hint 1</h4>
                  <p className="text-sm text-[#c2c6d6] mt-1">
                    {problem?.hints?.[0] || "No hints available for this problem yet."}
                  </p>
                </div>
              </div>
              <button className="text-xs font-jetbrains uppercase text-primary hover:text-primary-container transition-colors mt-2 ml-7 w-full text-left">
                Show Next Hint (10 pts)
              </button>
            </div>

            {/* Resources */}
            <div className="bg-[#333333] rounded-lg border border-white/10 p-4 mt-auto">
              <h4 className="text-xs font-jetbrains uppercase text-white mb-2">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a className="text-[#c0c6db] hover:text-primary transition-colors flex items-center gap-2" href="#">
                    <span className="material-symbols-outlined text-[14px]">menu_book</span>
                    Node.js Promises
                  </a>
                </li>
                <li>
                  <a className="text-[#c0c6db] hover:text-primary transition-colors flex items-center gap-2" href="#">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    Redis Client Docs
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Actions Bottom Bar */}
          <div className="p-4 border-t border-white/10 bg-[#333333] flex flex-col gap-3 shrink-0">
            <button 
              onClick={() => evaluateCode(false)}
              disabled={isEvaluating || isSubmitting}
              className="w-full py-2.5 px-4 bg-[#404040] hover:bg-[#404040] border border-white/20 text-white rounded-lg font-medium text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isEvaluating ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              )}
              Run Tests
            </button>
            <button 
              onClick={() => evaluateCode(true)}
              disabled={isEvaluating || isSubmitting}
              className={`w-full py-2.5 px-4 bg-primary text-[#002e6a] rounded-lg font-medium text-sm transition-all flex justify-center items-center gap-2 ${
                isSubmitting 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                  Submit Solution
                </>
              )}
            </button>
          </div>
        </aside>

      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#333333] border border-primary/30 rounded-2xl w-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] animate-in zoom-in-95 duration-300">
            <div className="h-32 bg-gradient-to-br from-[#262626] to-primary/20 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-2 z-10 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col items-center text-center">
              <h2 className="text-2xl font-geist font-bold text-white mb-2">Solution Accepted!</h2>
              <p className="text-[#c2c6d6] text-sm mb-6">You successfully passed all test cases and your solution has been saved to your profile.</p>
              
              {problem?.type === 'HTML' || problem?.type === 'CSS' ? (
                <div className="w-full bg-[#262626] border border-white/10 rounded-lg p-4 mb-6 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2">🎨</span>
                  <span className="text-primary font-jetbrains font-semibold">Pixel Perfect!</span>
                  <span className="text-[#8c909f] text-xs text-center mt-1">Your implementation successfully met all design and structural requirements.</span>
                </div>
              ) : (
                <div className="w-full grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#262626] border border-white/10 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-[#8c909f] text-[10px] font-jetbrains uppercase tracking-wider mb-1">Time Complexity</span>
                    <span className="text-primary font-jetbrains font-semibold">{submissionStats?.timeComplexity || 'O(N)'}</span>
                  </div>
                  <div className="bg-[#262626] border border-white/10 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-[#8c909f] text-[10px] font-jetbrains uppercase tracking-wider mb-1">Space Complexity</span>
                    <span className="text-green-400 font-jetbrains font-semibold">{submissionStats?.spaceComplexity || 'O(1)'}</span>
                  </div>
                </div>
              )}

              <div className="w-full flex gap-3">
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-2.5 bg-[#404040] hover:bg-[#404040] text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Close
                </button>
                <Link 
                  to="/problems"
                  className="flex-1 py-2.5 bg-primary text-[#002e6a] rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Next Problem
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
