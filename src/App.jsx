import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, Home, FlaskConical, Code, PenTool, Play, 
  Clock, GraduationCap, ChevronRight, Video, ArrowLeft,
  Maximize, Minimize, Search, Terminal, Brain, Activity, Wand2,
  Download, Share2, Edit3, FileDown, Languages, RefreshCw
} from "lucide-react";

// 🎬 Courses Data
const courses = [
  { id: "ai-learning", title: "AI Learning", description: "AI ও Neural Network বেসিক", category: "AI", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80" },
  { id: "website-making", title: "Website Making", description: "React দিয়ে ওয়েবসাইট বানাও", category: "Web", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  { id: "graphics-basics", title: "Graphics Basics", description: "Web Design ও Graphics", category: "Design", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80" }
];

// ─── AI API Helper (Groq / DeepSeek / OpenAI Compatible) ───
const callAI = async (promptText, systemInstruction = "") => {
  // আপনি চাইলে এখানে DeepSeek বা OpenAI এর API URL ও Key বসাতে পারেন
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return "⚠️ API Key missing.";
  
  const systemMsg = systemInstruction || "You are a helpful AI for Earnsmart. Always reply in the same language the user asks (Bangla in Bangla, Hindi in Hindi). Format answers beautifully with markdown.";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: promptText }
        ]
      })
    });
    const data = await response.json();
    if (data.error) return "Error: " + data.error.message;
    return data.choices[0].message.content;
  } catch (error) { 
    return "Error connecting to AI. Please try again."; 
  }
};

// ─── Markdown Formatter ───
function MarkdownText({ text }) {
  if (!text) return null;
  return <div className="text-sm text-gray-300 space-y-2 whitespace-pre-wrap font-sans leading-relaxed">{text}</div>;
}

// ─── Three Dot Menu ───
function ThreeDot() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:text-white border border-gray-800">
        {open ? <X size={20} /> : <MoreVertical size={20} />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl py-1 z-50">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#2a2a2a]"><Settings size={18} /> Settings</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#2a2a2a]"><CalendarDays size={18} /> Planning</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#2a2a2a]"><History size={18} /> History</button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ───
function Dashboard() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Earnsmart AI</h1>
          <p className="text-[#00FF88] text-sm font-semibold">Explore, Learn & Create</p>
        </div>
        <ThreeDot />
      </div>
      <h2 className="text-xl font-bold text-white mb-4">AI Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <Link key={c.id} to={`/course/${c.id}`} className="group block bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#00FF88] transition-all">
            <div className="h-40 relative">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
              <h3 className="absolute bottom-3 left-4 text-xl font-bold text-white">{c.title}</h3>
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="text-sm text-gray-400">{c.description}</p>
              <ChevronRight size={20} className="text-[#00FF88]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Course Detail (AI Note with Translation & PDF) ───
function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("English");

  const generateNote = async () => {
    setLoading(true);
    const prompt = `Summarize the key points of the video titled "${course.title}". Include a small text-based diagram or table. Reply in ${lang} language.`;
    const res = await callAI(prompt);
    setNote(res); setLoading(false);
  };

  const downloadPDF = () => {
    window.print(); // Simple print-to-PDF for now
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <Link to="/" className="text-sm text-gray-400 hover:text-white mb-5 inline-block">&larr; Back</Link>
      <h1 className="text-2xl font-bold text-white mb-4">{course.title}</h1>
      
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-gray-800">
        <ReactPlayer url={course.videoUrl} controls width="100%" height="100%" />
      </div>

      {/* AI Notes Section */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h3 className="font-bold text-white flex items-center gap-2"><Sparkles className="text-[#00FF88]"/> AI Note</h3>
          
          <div className="flex items-center gap-2">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-[#0a0a0a] text-white text-sm border border-gray-700 rounded-lg px-2 py-1 outline-none">
              <option value="English">English</option>
              <option value="Bangla">বাংলা</option>
              <option value="Hindi">हिंदी</option>
            </select>
            <button onClick={generateNote} disabled={loading} className="bg-[#00FF88] text-black px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50">
              {loading ? "Thinking..." : "Generate"}
            </button>
            {note && <button onClick={downloadPDF} className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700"><FileDown size={16}/></button>}
          </div>
        </div>
        {note ? <MarkdownText text={note} /> : <p className="text-gray-500 text-sm">Select a language and click Generate to create AI notes.</p>}
      </div>

      <Link to="/practice" className="bg-[#00FF88] text-black px-4 py-4 rounded-2xl font-bold block text-center">Open Practice Lab</Link>
    </div>
  );
}

// ─── Practice Lab Menu ───
function PracticeLabHome() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2"><FlaskConical className="text-[#00FF88]"/> Practice Lab</h1>
      <p className="text-gray-400 text-sm mb-6">All-in-one AI tools for learning and creating</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/practice/python" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 hover:border-[#00FF88] transition-all">
          <Terminal className="text-[#00FF88] mb-3" size={28}/>
          <h2 className="text-lg font-bold text-white mb-1">Python Compiler</h2>
          <p className="text-sm text-gray-400">Run Python, catch errors, and let AI fix them.</p>
        </Link>

        <Link to="/practice/video" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 hover:border-[#00FF88] transition-all">
          <Wand2 className="text-[#00FF88] mb-3" size={28}/>
          <h2 className="text-lg font-bold text-white mb-1">AI Video Creator</h2>
          <p className="text-sm text-gray-400">Generate, edit, download, and share videos.</p>
        </Link>
      </div>
    </div>
  );
}

// ─── Python Compiler (With AI Fix) ───
function PythonTool() {
  const [code, setCode] = useState(`# Try out Python here\nprint("Hello Earnsmart!")\n\n# Let's make an error\nprint(unknown_variable)`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [isFull, setIsFull] = useState(false);

  const runPython = async () => {
    setLoading(true);
    setOutput("");
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python",
          version: "3.10.0",
          files: [{ content: code }]
        })
      });
      const data = await response.json();
      if (data.run.stderr) {
        setOutput("❌ Error:\n" + data.run.stderr);
      } else {
        setOutput(data.run.output || "Code executed successfully (no output).");
      }
    } catch (err) {
      setOutput("❌ Connection Error: Python server is currently busy.");
    }
    setLoading(false);
  };

  const fixCode = async () => {
    if (!output.includes("❌")) return alert("Run the code first to find errors.");
    setFixing(true);
    const prompt = `Fix the following Python code. The error is:\n${output}\n\nCode:\n${code}\n\nReturn ONLY the fixed code, no explanations.`;
    const fixedCode = await callAI(prompt, "Return ONLY code.");
    setCode(fixedCode.replace(/\`\`\`python/g, '').replace(/\`\`\`/g, '').trim());
    setOutput("✅ Code fixed by AI! Run it again to check.");
    setFixing(false);
  };

  return (
    <div className={`p-4 max-w-4xl mx-auto ${isFull ? 'fixed inset-0 z-[100] bg-[#0a0a0a] max-w-full pt-4 flex flex-col' : 'pt-6 pb-24'}`}>
      {!isFull && (
        <div className="flex justify-between items-center mb-4">
          <Link to="/practice" className="text-gray-400 hover:text-white inline-flex items-center gap-1">&larr; Back</Link>
          <button onClick={() => setIsFull(true)} className="text-gray-400 hover:text-white"><Maximize size={20}/></button>
        </div>
      )}
      
      <div className={`bg-[#1a1a1a] border border-gray-800 rounded-3xl p-4 md:p-6 ${isFull ? 'flex-1 flex flex-col rounded-none border-0' : ''}`}>
        {!isFull && <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Terminal className="text-[#00FF88]"/> Python Compiler</h1>}
        
        <textarea 
          value={code} onChange={(e) => setCode(e.target.value)}
          className={`w-full bg-[#0a0a0a] text-[#00FF88] font-mono text-sm p-4 rounded-xl outline-none border border-gray-800 focus:border-[#00FF88] ${isFull ? 'flex-1 resize-none mb-4' : 'h-64'}`}
          spellCheck="false"
        />

        <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
          <div className="flex gap-2">
            <button onClick={runPython} disabled={loading} className="bg-[#00FF88] text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
              <Play size={18}/> {loading ? "Running..." : "Run Code"}
            </button>
            {output.includes("❌") && (
              <button onClick={fixCode} disabled={fixing} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                <Wand2 size={18}/> {fixing ? "Fixing..." : "AI Fix Code"}
              </button>
            )}
          </div>
          {isFull && <button onClick={() => setIsFull(false)} className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-lg"><Minimize size={18}/></button>}
        </div>

        <div className={`mt-4 bg-black border border-gray-800 p-4 rounded-xl overflow-y-auto ${isFull ? 'h-1/3' : ''}`}>
          <p className="text-gray-500 text-xs mb-2">Terminal Output:</p>
          <pre className={`text-sm font-mono whitespace-pre-wrap ${output.includes("❌") ? 'text-red-400' : 'text-white'}`}>
            {output || "// Output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── AI Video Creator (Download/Share/Edit) ───
function AIVideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const generate = () => {
    if (!prompt) return;
    setLoading(true);
    setTimeout(() => {
      setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1">&larr; Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Wand2 className="text-[#00FF88]"/> AI Video Creator</h1>
        <p className="text-sm text-gray-400 mb-6">Type a prompt to generate a video. (Requires Paid API for real generation)</p>
        
        <textarea 
          value={prompt} onChange={(e) => setPrompt(e.target.value)} 
          placeholder="e.g. A futuristic city at night with flying cars..." 
          className="w-full bg-[#0a0a0a] text-white border border-gray-700 p-4 rounded-2xl mb-4 h-32 text-sm outline-none focus:border-[#00FF88]" 
        />
        <button onClick={generate} disabled={loading} className="flex items-center justify-center gap-2 bg-[#00FF88] text-black font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50">
          {loading ? "Generating..." : <><Play size={18}/> Generate Video</>}
        </button>

        {videoUrl && !loading && (
          <div className="mt-8">
            <video src={videoUrl} controls className="w-full rounded-2xl border border-gray-700" />
            
            {/* Video Action Buttons */}
            <div className="flex justify-around mt-4 bg-[#0a0a0a] p-3 rounded-xl border border-gray-800">
              <a href={videoUrl} download className="flex flex-col items-center text-gray-400 hover:text-[#00FF88]">
                <Download size={20} /> <span className="text-xs mt-1">Download</span>
              </a>
              <button className="flex flex-col items-center text-gray-400 hover:text-[#00FF88]">
                <Edit3 size={20} /> <span className="text-xs mt-1">Edit</span>
              </button>
              <button onClick={() => navigator.share?.({ url: videoUrl })} className="flex flex-col items-center text-gray-400 hover:text-[#00FF88]">
                <Share2 size={20} /> <span className="text-xs mt-1">Share</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Chat ───
function Chat() {
  const [open, setOpen] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "a", content: "Hi! আমি Earnsmart AI. কীভাবে সাহায্য করতে পারি?" }]);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => { 
    if (!txt.trim()) return; 
    setMsgs((m) => [...m, { role: "u", content: txt }]); setTxt(""); setLoading(true);
    const res = await callAI(txt);
    setMsgs((m) => [...m, { role: "a", content: res }]); setLoading(false);
  };

  return (
    <div className={`fixed ${isFull ? 'inset-0 z-[200]' : 'bottom-24 right-4 z-50'}`}>
      {open ? (
        <div className={`bg-[#1a1a1a] border border-gray-800 shadow-2xl flex flex-col overflow-hidden ${isFull ? 'w-full h-full rounded-none' : 'w-[calc(100vw-2rem)] max-w-sm h-96 rounded-3xl'}`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#0a0a0a]">
            <span className="font-bold text-sm text-[#00FF88] flex items-center gap-2"><Sparkles size={16}/> AI Tutor</span>
            <div className="flex gap-2">
              <button onClick={() => setIsFull(!isFull)} className="text-gray-400 hover:text-white">{isFull ? <Minimize size={18} /> : <Maximize size={18} />}</button>
              <button onClick={() => { setOpen(false); setIsFull(false); }} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-[#0a0a0a]">
            {msgs.map((m, i) => (
              <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.role === "u" ? "bg-[#00FF88] text-black ml-auto" : "bg-[#1a1a1a] border border-gray-800 text-gray-200 mr-auto"}`}>
                {m.role === "u" ? m.content : <MarkdownText text={m.content} />}
              </div>
            ))}
            {loading && <div className="text-[#00FF88] text-xs italic animate-pulse">AI is thinking...</div>}
          </div>
          <div className="p-3 border-t border-gray-800 bg-[#1a1a1a] flex gap-2">
            <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask anything..." className="flex-1 bg-[#0a0a0a] text-white border border-gray-700 rounded-full px-4 text-sm outline-none focus:border-[#00FF88]" />
            <button onClick={send} disabled={loading} className="bg-[#00FF88] text-black p-2.5 rounded-full disabled:opacity-50"><Send size={16} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="bg-[#00FF88] text-black p-4 rounded-full shadow-xl hover:scale-110 transition-transform"><MessageCircle size={24} /></button>
      )}
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 flex justify-around py-3 z-40 pb-safe">
      <Link to="/" className="flex flex-col items-center text-[11px] text-gray-500 hover:text-[#00FF88]"><Home size={22} className="mb-1"/>Home</Link>
      <Link to="/practice" className="flex flex-col items-center text-[11px] text-gray-500 hover:text-[#00FF88]"><FlaskConical size={22} className="mb-1"/>Lab</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#00FF88] selection:text-black">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/practice" element={<PracticeLabHome />} />
          <Route path="/practice/video" element={<AIVideoGenerator />} />
          <Route path="/practice/python" element={<PythonTool />} />
        </Routes>
        <Chat />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}