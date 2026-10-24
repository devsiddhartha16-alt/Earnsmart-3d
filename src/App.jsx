import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, Home, FlaskConical, Play, 
  GraduationCap, ChevronRight, Video, ArrowLeft,
  Maximize, Minimize, Terminal, Wand2,
  Download, Share2, Edit3, FileDown, CheckCircle
} from "lucide-react";

// 🎬 Courses Data
const courses = [
  { id: "ai-learning", title: "AI Learning", description: "AI ও Neural Network বেসিক", category: "AI", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80" },
  { id: "website-making", title: "Website Making", description: "React দিয়ে ওয়েবসাইট বানাও", category: "Web", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  { id: "graphics-basics", title: "Graphics Basics", description: "Web Design ও Graphics", category: "Design", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80" }
];

// ─── AI API Helper ───
const callAI = async (promptText, isSystem = false) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return "⚠️ API Key missing. Add VITE_GROQ_API_KEY to GitHub Secrets.";
  
  const systemMsg = isSystem 
    ? "You are a backend system. Return ONLY raw code or exact data." 
    : "You are a helpful AI assistant for Earnsmart. Always respond in the same language the user asks (Bangla in Bangla, Hindi in Hindi). Format your answers beautifully using markdown (bullet points, bold text, tables).";

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

// ─── Simple Markdown Parser (For Beautiful Notes) ───
function MarkdownRenderer({ text }) {
  if (!text) return null;
  
  // Bold (**text**)
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  // Headings (### text)
  html = html.replace(/### (.*?)(\n|$)/g, '<h3 class="text-[#00FF88] font-bold text-lg mt-4 mb-2">$1</h3>');
  html = html.replace(/## (.*?)(\n|$)/g, '<h2 class="text-[#00FF88] font-bold text-xl mt-4 mb-2">$1</h2>');
  // Lists (- text)
  html = html.replace(/^- (.*?)(\n|$)/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>');
  
  return <div className="text-sm text-gray-300 leading-relaxed space-y-2" dangerouslySetInnerHTML={{ __html: html }} />;
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

// ─── Course Detail (AI Note Fixed) ───
function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("Bangla");

  const generateNote = async () => {
    setLoading(true);
    // AI-কে বলা হচ্ছে ভিডিও দেখার বদলে টপিকের উপর জ্ঞান দিতে
    const prompt = `Act as an expert teacher. Provide a detailed study note for a course titled "${course.title}". 
    1. Give a brief summary in 3 bullet points.
    2. Provide a text-based diagram or table explaining the core concept.
    3. Keep the language strictly in ${lang}.`;
    
    const res = await callAI(prompt);
    setNote(res); setLoading(false);
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <Link to="/" className="text-sm text-gray-400 hover:text-white mb-5 inline-flex items-center gap-1"><ArrowLeft size={16}/> Back</Link>
      <h1 className="text-2xl font-bold text-white mb-4">{course.title}</h1>
      
      <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-gray-800">
        <ReactPlayer url={course.videoUrl} controls width="100%" height="100%" />
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h3 className="font-bold text-white flex items-center gap-2"><Sparkles className="text-[#00FF88]"/> AI Note</h3>
          
          <div className="flex items-center gap-2">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-[#0a0a0a] text-white text-sm border border-gray-700 rounded-lg px-2 py-1 outline-none">
              <option value="Bangla">বাংলা</option>
              <option value="English">English</option>
              <option value="Hindi">हिंदी</option>
            </select>
            <button onClick={generateNote} disabled={loading} className="bg-[#00FF88] text-black px-4 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50">
              {loading ? "Generating..." : "Generate"}
            </button>
            {note && <button onClick={downloadPDF} className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700" title="Save as PDF"><FileDown size={16}/></button>}
          </div>
        </div>
        {note ? <MarkdownRenderer text={note} /> : <p className="text-gray-500 text-sm">Select language and click Generate to create AI notes.</p>}
      </div>

      <Link to="/practice" className="bg-[#00FF88] text-black px-4 py-4 rounded-2xl font-bold block text-center">Open Practice Lab</Link>
    </div>
  );
}

// ─── Practice Lab Home ───
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

// ─── Python Compiler (Auto-Fix Code) ───
function PythonTool() {
  const [code, setCode] = useState(`# Write Python code here\nprint("Hello Earnsmart!")\n\n# Example of an error\nx = 5\nprint(y)`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);

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
      setOutput("❌ Connection Error: Python server is busy.");
    }
    setLoading(false);
  };

  const fixCode = async () => {
    if (!output.includes("❌")) return alert("Run the code first to find errors.");
    setFixing(true);
    // AI-কে কঠোরভাবে বলা হচ্ছে শুধু ঠিক করা কোড দিতে
    const prompt = `Fix the following Python code. \nError:\n${output}\n\nCode:\n${code}\n\nReturn ONLY the raw executable Python code. No markdown, no explanations, no \`\`\`python tags. Just the code.`;
    
    const fixedCode = await callAI(prompt, true);
    
    // মার্কডাউন ব্যাকটিক থাকলে তা রিমুভ করা
    const cleanCode = fixedCode.replace(/```python/g, '').replace(/```/g, '').trim();
    setCode(cleanCode);
    setOutput("✅ Code fixed by AI! Click 'Run Code' to test.");
    setFixing(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-1"><ArrowLeft size={16}/> Back to Lab</Link>
      
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-4 md:p-6">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Terminal className="text-[#00FF88]"/> Python Compiler</h1>
        
        {/* Textarea with fixed keyboard interaction */}
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-[#0a0a0a] text-[#00FF88] font-mono text-sm p-4 rounded-xl outline-none border border-gray-800 focus:border-[#00FF88] h-64 mb-4"
          spellCheck="false"
        />

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={runPython} disabled={loading} className="bg-[#00FF88] text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
            <Play size={18}/> {loading ? "Running..." : "Run Code"}
          </button>
          
          {output.includes("❌") && (
            <button onClick={fixCode} disabled={fixing} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/20">
              <Wand2 size={18}/> {fixing ? "Fixing..." : "AI Fix Code"}
            </button>
          )}
        </div>

        <div className="bg-black border border-gray-800 p-4 rounded-xl h-40 overflow-y-auto">
          <p className="text-gray-500 text-xs mb-2">Terminal Output:</p>
          <pre className={`text-sm font-mono whitespace-pre-wrap ${output.includes("❌") ? 'text-red-400' : 'text-white'}`}>
            {output || "// Output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── AI Video Creator ───
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
      <Link to="/practice" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1"><ArrowLeft size={16}/> Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Wand2 className="text-[#00FF88]"/> AI Video Creator</h1>
        <p className="text-sm text-gray-400 mb-6">Type a prompt to generate a video.</p>
        
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

// ─── Chat ───
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
                {m.role === "u" ? m.content : <MarkdownRenderer text={m.content} />}
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