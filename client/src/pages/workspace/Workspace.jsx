import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';

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
  // TODO: Use problemId to fetch problem data
  console.log("Workspace for problem:", problemId);
  const [code, setCode] = useState(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState('auth.service.js');
  const [terminalTab, setTerminalTab] = useState('Terminal');

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

  const handleEditorDidMount = (editor, monaco) => {
    // Define a custom theme that matches the specific #0a0e16 background
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
        'editor.background': '#0a0e16',
        'editor.lineHighlightBackground': '#181c24',
        'editorLineNumber.foreground': '#424754',
        'editorIndentGuide.background': '#1c2028',
      }
    });
    monaco.editor.setTheme('ExcodeTheme');
  };

  return (
    <div className="bg-[#0f131c] text-[#dfe2ee] h-screen flex flex-col overflow-hidden font-inter">
      
      {/* Workspace Top Navigation */}
      <header className="h-12 border-b border-white/10 bg-[#181c24] flex items-center justify-between px-4 shrink-0 z-20 shadow-sm shadow-black/20">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="flex items-center gap-2 text-[#c2c6d6] hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            <span className="text-sm font-medium">Problems</span>
          </Link>
          <div className="w-px h-5 bg-white/10 hidden sm:block"></div>
          <div className="items-center gap-2 hidden sm:flex">
            <span className="text-sm font-medium text-white truncate max-w-[200px] lg:max-w-[400px]">Fix Authentication Race Condition</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="text-[#c2c6d6] hover:text-white transition-colors flex items-center justify-center p-1.5 rounded hover:bg-white/5">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="w-px h-5 bg-white/10 hidden sm:block"></div>
          <Link to="/dashboard" className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-primary-container text-[#002e6a] flex items-center justify-center font-bold text-xs hover:opacity-90 transition-opacity ml-1">
            S
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Problem Description */}
        <aside 
          style={{ width: `${leftWidth}px` }}
          className="flex flex-col bg-[#0f131c] border-b lg:border-b-0 shrink-0 relative"
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#181c24] shrink-0">
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
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-error/10 text-error rounded text-xs font-jetbrains uppercase border border-error/20">Expert</span>
              <span className="px-2 py-1 bg-[#31353e] text-[#c2c6d6] rounded text-xs font-jetbrains uppercase border border-white/10">Backend</span>
            </div>
            <h1 className="text-2xl font-geist font-semibold text-white mb-4">Fix Authentication Race Condition</h1>
            
            <div className="text-sm text-[#c2c6d6] space-y-4">
              <p>In our distributed authentication microservice, users are occasionally experiencing failed logins immediately after registering, despite the database showing successful creation.</p>
              
              <h3 className="text-base font-medium text-white mt-6 mb-2">The Problem</h3>
              <p>The sequence of events during registration is:</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>User data is written to PostgreSQL.</li>
                <li>A generic welcome email is queued.</li>
                <li>An initial session token is generated and stored in Redis.</li>
                <li>The token is returned to the client.</li>
              </ol>
              <p>However, under high load, step 4 sometimes completes before step 3 finishes replicating across our Redis cluster, leading to the client attempting an immediate authenticated request that gets rejected.</p>
              
              <h3 className="text-base font-medium text-white mt-6 mb-2">Task</h3>
              <p>Refactor the <code>registerUser</code> function to ensure that the session token is fully propagated before returning the success response.</p>
              
              <div className="bg-[#1c2028] p-4 rounded-lg border border-white/10 mt-4">
                <p className="text-xs font-jetbrains uppercase text-white mb-2">Example Test Case:</p>
                <code className="text-xs font-jetbrains text-primary block whitespace-pre">
{`const user = await registerUser(mockData);
const sessionValid = await verifySession(user.token);
assert.isTrue(sessionValid); // Failing ~5% of time`}
                </code>
              </div>
            </div>
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
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0e16]">
          
          {/* Editor Header */}
          <div className="h-10 border-b border-white/10 bg-[#181c24] flex items-center px-2 gap-2 overflow-x-auto scroll-hidden shrink-0">
            <div 
              onClick={() => setActiveTab('auth.service.js')}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${activeTab === 'auth.service.js' ? 'bg-[#0a0e16] border-t-2 border-primary border-r border-l border-white/10 rounded-t-md' : 'text-[#c2c6d6] hover:bg-[#31353e] rounded'}`}
            >
              <span className="material-symbols-outlined text-[#F7DF1E] text-[16px]">javascript</span>
              <span className="text-xs font-jetbrains">auth.service.js</span>
            </div>
            <div 
              onClick={() => setActiveTab('auth.test.js')}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${activeTab === 'auth.test.js' ? 'bg-[#0a0e16] border-t-2 border-primary border-r border-l border-white/10 rounded-t-md' : 'text-[#c2c6d6] hover:bg-[#31353e] rounded'}`}
            >
              <span className="material-symbols-outlined text-[#8c909f] text-[16px]">description</span>
              <span className="text-xs font-jetbrains">auth.test.js</span>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value)}
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
            className="bg-[#0f131c] flex flex-col shrink-0"
          >
            <div className="flex items-center justify-between px-4 border-b border-white/10 bg-[#181c24] h-10 shrink-0">
              <div className="flex items-center gap-4 h-full">
                {['Terminal', 'Test Results', 'Console'].map(tab => (
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
            
            <div className="flex-1 p-4 overflow-y-auto font-jetbrains text-xs bg-[#0a0e16] text-[#c2c6d6] scroll-hidden">
              <div className="mb-2 text-[#8c909f]">dev-arena@workspace:~/challenge$ npm run test:watch</div>
              <div className="text-[#facc15] mb-2">{'>'} auth-service@1.0.0 test:watch</div>
              <div className="text-[#facc15] mb-4">{'>'} jest --watchAll --runInBand</div>
              <div className="mb-1"><span className="text-error font-bold">FAIL</span> tests/auth.service.test.js</div>
              <div className="pl-4 mb-2 border-l-2 border-error/50">
                <div className="text-white">✕ should successfully verify session immediately after registration (42ms)</div>
                <div className="text-error mt-2">  Error: Expected session to be valid, but received undefined.</div>
                <div className="text-[#8c909f] mt-1">    at Object.{'<anonymous>'} (tests/auth.service.test.js:45:12)</div>
              </div>
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
          className="flex flex-col bg-[#0f131c] border-t lg:border-t-0 shrink-0 relative"
        >
          <div className="p-3 border-b border-white/10 bg-[#181c24] flex justify-between items-center h-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#bdc7d9] text-[20px]">smart_toy</span>
              <span className="text-xs font-jetbrains uppercase font-semibold text-white">Arena AI</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* AI Hint Card */}
            <div className="bg-[#262a33] rounded-lg border border-white/10 p-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">lightbulb</span>
                <div>
                  <h4 className="text-sm font-medium text-white">Hint 1</h4>
                  <p className="text-sm text-[#c2c6d6] mt-1">Look at how <code>redis.setEx</code> is called. Is it returning a Promise? Are we waiting for it to resolve before returning?</p>
                </div>
              </div>
              <button className="text-xs font-jetbrains uppercase text-primary hover:text-primary-container transition-colors mt-2 ml-7 w-full text-left">
                Show Next Hint (10 pts)
              </button>
            </div>

            {/* Resources */}
            <div className="bg-[#1c2028] rounded-lg border border-white/10 p-4 mt-auto">
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
          <div className="p-4 border-t border-white/10 bg-[#181c24] flex flex-col gap-3 shrink-0">
            <button className="w-full py-2.5 px-4 bg-[#262a33] hover:bg-[#31353e] border border-white/20 text-white rounded-lg font-medium text-sm transition-colors flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Run Tests
            </button>
            <button className="w-full py-2.5 px-4 bg-primary text-[#002e6a] rounded-lg font-medium text-sm hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              Submit Solution
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default Workspace;
