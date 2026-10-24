import { useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, Home, FlaskConical, Box, Code, PenTool, Play, 
  Clock, GraduationCap, ChevronRight, Video, ArrowLeft, CheckCircle,
  Maximize, Minimize, Search, Terminal, Brain, Activity, Wand2
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";

// 🎬 Courses Data
const courses = [
  { id: "ai-learning", title: "AI Learning", description: "AI ও Neural Network বেসিক", category: "AI", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80" },
  { id: "website-making", title: "Website Making", description: "React দিয়ে ওয়েবসাইট বানাও", category: "Web", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  { id: "graphics-basics", title: "Graphics Basics", description: "Web Design ও Graphics", category: "Design", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80" }
];

// 🌍 Hidden 3D Models Database
const modelDB = [
  { name: "Astronaut", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Astronaut/glTF-Binary/Astronaut.glb" },
  { name: "Damaged Helmet", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" },
  { name: "T-Rex Dinosaur", url: "https://modelviewer.dev/shared-assets/models/T-Rex.glb" },
  { name: "Human Brain", url: "https://modelviewer.dev/shared-assets/models/BrainStem.glb" },
  { name: "Robot", url: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb" },
  { name: "Horse", url: "https://modelviewer.dev/shared-assets/models/Horse.glb" }
];

// ─── Groq API Helper (Bangla Support) ───
const callGroq = async (promptText, isSystem = false) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return "⚠️ API Key missing. Add VITE_GROQ_API_KEY to GitHub Secrets.";
  
  // AI-কে বাংলায় উত্তর দেওয়ার এবং সুন্দর ফরম্যাট করার নির্দেশ
  const systemMessage = "You are a helpful AI assistant for Earnsmart. Always respond in the same language the user uses (if the user asks in Bangla, reply in Bangla). Format your answers beautifully using markdown (bullet points, bold text).";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: isSystem ? "You are a backend system. Return only exact requested data." : systemMessage },
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
  return (
    <div className="text-sm text-gray-300 space-y-2 whitespace-pre-wrap font-sans">
      {text}
    </div>
  );
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
          <p className="text-[#00FF88] text-sm font-semibold">Explore & Learn</p>
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

// ─── Course Detail ───
function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNote = async () => {
    setLoading(true);
    const res = await callGroq(`Summarize the key points of the video titled "${course.title}" in 3 bullet points.`);
    setNote(res); setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <Link to="/" className="text-sm text-gray-400 hover:text-white mb-5 inline-block">&larr; Back</Link>
      <h1 className="text-2xl font-bold text-white mb-4">{course.title}</h1>
      <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-gray-800">
        <ReactPlayer url={course.videoUrl} controls width="100%" height="100%" />
      </div>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white flex items-center gap-2"><Sparkles className="text-[#00FF88]"/> AI Note</h3>
          <button onClick={generateNote} disabled={loading} className="bg-[#00FF88] text-black px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50">
            {loading ? "Thinking..." : "Create Note"}
          </button>
        </div>
        {note && <MarkdownText text={note} />}
      </div>
      <Link to="/practice" className="bg-[#00FF88] text-black px-4 py-4 rounded-2xl font-bold block text-center">Open Practice Lab</Link>
    </div>
  );
}

// ─── 🧠 Practice Lab Menu ───
function PracticeLabHome() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2"><FlaskConical className="text-[#00FF88]"/> Practice Lab</h1>
      <p className="text-gray-400 text-sm mb-6">All-in-one AI tools for learning and creating</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/practice/3d" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 hover:border-[#00FF88] transition-all">
          <Box className="text-[#00FF88] mb-3" size={28}/>
          <h2 className="text-lg font-bold text-white mb-1">AI 3D Lab</h2>
          <p className="text-sm text-gray-400">Search and explore 3D models.</p>
        </Link>
        
        <Link to="/practice/python" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 hover:border-[#00FF88] transition-all">
          <Terminal className="text-[#00FF88] mb-3" size={28}/>
          <h2 className="text-lg font-bold text-white mb-1">Python Lab</h2>
          <p className="text-sm text-gray-400">Write and run Python code.</p>
        </Link>

        <Link to="/practice/video" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 hover:border-[#00FF88] transition-all">
          <Wand2 className="text-[#00FF88] mb-3" size={28}/>
          <h2 className="text-lg font-bold text-white mb-1">AI Video Gen</h2>
          <p className="text-sm text-gray-400">Generate videos from text prompts.</p>
        </Link>

        <Link to="/practice/neuron" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-5 hover:border-[#00FF88] transition-all">
          <Activity className="text-[#00FF88] mb-3" size={28}/>
          <h2 className="text-lg font-bold text-white mb-1">Neuron Visualizer</h2>
          <p className="text-sm text-gray-400">See how a neuron works.</p>
        </Link>
      </div>
    </div>
  );
}

// ─── AI 3D Lab (No Loader, Fullscreen) ───
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <Center><primitive object={scene} /></Center>;
}

function ModelLab() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedModel, setSelectedModel] = useState(modelDB[0]);
  const [isFull, setIsFull] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    const prompt = `Find the best match for "${query}". Return ONLY the exact URL from this list:
    ${modelDB.map(m => m.url).join("\n")}`;
    const result = await callGroq(prompt, true);
    const found = modelDB.find(m => result.includes(m.url));
    if (found) setSelectedModel(found);
    setSearching(false);
  };

  return (
    <div className={`p-4 max-w-4xl mx-auto ${isFull ? 'fixed inset-0 z-[100] bg-[#0a0a0a] max-w-full pt-4' : 'pt-6 pb-24'}`}>
      {!isFull && (
        <div className="flex justify-between items-center mb-6">
          <Link to="/practice" className="text-gray-400 hover:text-white flex items-center gap-1">&larr; Back</Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Box className="text-[#00FF88]"/> AI 3D Lab</h1>
        </div>
      )}
      {!isFull && (
        <div className="mb-5 flex gap-2 bg-[#1a1a1a] p-2 rounded-2xl border border-gray-800">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search 3D (e.g. Dinosaur, Robot)..." className="flex-1 bg-transparent text-white px-4 outline-none" />
          <button onClick={handleSearch} disabled={searching} className="bg-[#00FF88] text-black p-3 rounded-xl font-bold disabled:opacity-50">
            {searching ? "..." : <Search size={20}/>}
          </button>
        </div>
      )}
      <div className={`w-full bg-[#111827] overflow-hidden relative shadow-2xl border border-gray-800 ${isFull ? 'h-[90vh] rounded-none' : 'h-80 rounded-3xl'}`}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={null}><Model url={selectedModel.url} /></Suspense>
          <OrbitControls autoRotate enableZoom={true} />
        </Canvas>
        <button onClick={() => setIsFull(!isFull)} className="absolute bottom-4 right-4 bg-[#00FF88] text-black p-2 rounded-full">
          {isFull ? <Minimize size={18}/> : <Maximize size={18}/>}
        </button>
      </div>
    </div>
  );
}

// ─── AI Video Creator (New) ───
function AIVideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const generate = () => {
    if (!prompt) return;
    setLoading(true);
    // Simulating video generation API
    setTimeout(() => {
      setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1">&larr; Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Wand2 className="text-[#00FF88]"/> AI Video Creator</h1>
        <p className="text-sm text-gray-400 mb-6">Type a prompt to generate a video.</p>
        
        <textarea 
          value={prompt} onChange={(e) => setPrompt(e.target.value)} 
          placeholder="e.g. A drone shot flying over a futuristic city with neon lights..." 
          className="w-full bg-[#0a0a0a] text-white border border-gray-700 p-4 rounded-2xl mb-4 h-32 text-sm outline-none focus:border-[#00FF88]" 
        />
        <button onClick={generate} disabled={loading} className="flex items-center justify-center gap-2 bg-[#00FF88] text-black font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50">
          {loading ? "Generating..." : <><Play size={18}/> Generate Video</>}
        </button>

        {videoUrl && !loading && (
          <div className="mt-8">
            <video src={videoUrl} controls autoPlay className="w-full rounded-2xl border border-gray-700" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Python Lab (Fullscreen & Error Handling) ───
function PythonTool() {
  const [code, setCode] = useState(`# Try out Python here\nprint("Hello Earnsmart!")\n\nfor i in range(3):\n    print(f"Loop {i}")`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
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
      setOutput("❌ Connection Error: Python server is currently busy. Please try again.");
    }
    setLoading(false);
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

        <div className="flex justify-between items-center mt-4">
          <button onClick={runPython} disabled={loading} className="bg-[#00FF88] text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
            <Play size={18}/> {loading ? "Running..." : "Run Code"}
          </button>
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

// ─── Neuron Visualizer ───
function NeuronVisualizer() {
  const [inputs, setInputs] = useState([1, 0.5]);
  const [weights, setWeights] = useState([0.8, -0.4]);
  const [bias, setBias] = useState(0.1);

  const weightedSum = inputs[0]*weights[0] + inputs[1]*weights[1] + bias;
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  const output = sigmoid(weightedSum);

  return (
    <div className="p-4 max-w-3xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1">&larr; Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Activity className="text-[#00FF88]"/> Neuron Visualizer</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div><label className="text-sm text-gray-400 block mb-1">Input 1: {inputs[0]}</label><input type="range" min="-2" max="2" step="0.1" value={inputs[0]} onChange={(e) => setInputs([parseFloat(e.target.value), inputs[1]])} className="w-full accent-[#00FF88]" /></div>
            <div><label className="text-sm text-gray-400 block mb-1">Input 2: {inputs[1]}</label><input type="range" min="-2" max="2" step="0.1" value={inputs[1]} onChange={(e) => setInputs([inputs[0], parseFloat(e.target.value)])} className="w-full accent-[#00FF88]" /></div>
            <div><label className="text-sm text-gray-400 block mb-1">Weight 1: {weights[0]}</label><input type="range" min="-2" max="2" step="0.1" value={weights[0]} onChange={(e) => setWeights([parseFloat(e.target.value), weights[1]])} className="w-full accent-[#00FF88]" /></div>
            <div><label className="text-sm text-gray-400 block mb-1">Weight 2: {weights[1]}</label><input type="range" min="-2" max="2" step="0.1" value={weights[1]} onChange={(e) => setWeights([weights[0], parseFloat(e.target.value)])} className="w-full accent-[#00FF88]" /></div>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800">
             <div className="flex gap-6 mb-6">
               <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-white font-bold">{inputs[0]}</div>
               <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-white font-bold">{inputs[1]}</div>
               <div className="w-16 h-16 rounded-full bg-[#00FF88]/20 border-2 border-[#00FF88] flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)]">{output.toFixed(2)}</div>
             </div>
             <p className="text-sm text-gray-400">Output (Sigmoid): <span className="text-[#00FF88] font-bold">{output.toFixed(4)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Chat (Fullscreen Toggle) ───
function Chat() {
  const [open, setOpen] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "a", content: "Hi! আমি Earnsmart AI. কীভাবে সাহায্য করতে পারি?" }]);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => { 
    if (!txt.trim()) return; 
    const userMsg = txt;
    setMsgs((m) => [...m, { role: "u", content: userMsg }]); setTxt(""); setLoading(true);
    const res = await callGroq(userMsg);
    setMsgs((m) => [...m, { role: "a", content: res }]); setLoading(false);
  };

  return (
    <div className={`fixed ${isFull ? 'inset-0 z-[200]' : 'bottom-24 right-4 z-50'}`}>
      {open ? (
        <div className={`bg-[#1a1a1a] border border-gray-800 shadow-2xl flex flex-col overflow-hidden ${isFull ? 'w-full h-full rounded-none' : 'w-[calc(100vw-2rem)] max-w-sm h-96 rounded-3xl'}`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#0a0a0a]">
            <span className="font-bold text-sm text-[#00FF88] flex items-center gap-2"><Sparkles size={16}/> AI Tutor</span>
            <div className="flex gap-2">
              <button onClick={() => setIsFull(!isFull)} className="text-gray-400 hover:text-white">
                {isFull ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
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
          <Route path="/practice/3d" element={<ModelLab />} />
          <Route path="/practice/video" element={<AIVideoGenerator />} />
          <Route path="/practice/python" element={<PythonTool />} />
          <Route path="/practice/neuron" element={<NeuronVisualizer />} />
        </Routes>
        <Chat />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}