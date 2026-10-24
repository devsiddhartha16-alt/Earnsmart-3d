import { useState, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, Home, FlaskConical, Box, Code, PenTool, Play, 
  Clock, GraduationCap, ChevronRight, Video, ArrowLeft, CheckCircle,
  Maximize, Minimize, Search, Terminal, Brain, Layers, Activity
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center, useProgress } from "@react-three/drei";

// 🎬 Courses Data
const courses = [
  { id: "ai-learning", title: "AI Learning", description: "AI ও Neural Network বেসিক", category: "AI", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80" },
  { id: "website-making", title: "Website Making", description: "React দিয়ে ওয়েবসাইট বানাও", category: "Web", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  { id: "graphics-basics", title: "Graphics Basics", description: "Web Design ও Graphics", category: "Design", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80" }
];

// 🌍 Hidden 3D Models Database for AI Search
const modelDB = [
  { name: "Astronaut", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Astronaut/glTF-Binary/Astronaut.glb" },
  { name: "Damaged Helmet", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" },
  { name: "T-Rex Dinosaur", url: "https://modelviewer.dev/shared-assets/models/T-Rex.glb" },
  { name: "Human Brain", url: "https://modelviewer.dev/shared-assets/models/BrainStem.glb" },
  { name: "Robot", url: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb" },
  { name: "Cesium Milk Truck", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb" },
  { name: "Horse", url: "https://modelviewer.dev/shared-assets/models/Horse.glb" }
];

// ─── ✅ Groq API Helper (Updated Model) ───
const callGroq = async (promptText) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return "⚠️ Groq API Key missing. Add VITE_GROQ_API_KEY to GitHub Secrets.";
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${apiKey}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b", // ✅ Updated from retired llama-3.3
        messages: [{ role: "user", content: promptText }],
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    const data = await response.json();
    if (data.error) return "Error: " + data.error.message;
    return data.choices[0].message.content;
  } catch (error) { 
    return "Error connecting to AI. Check your internet."; 
  }
};

// ─── Three Dot Menu ───
function ThreeDot() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:text-white border border-gray-800">
        {open ? <X size={20} /> : <MoreVertical size={20} />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl py-1 z-50">
          <button onClick={() => { setOpen(false); setModal("settings"); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#2a2a2a]"><Settings size={18} /> Settings</button>
          <button onClick={() => { setOpen(false); setModal("planning"); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#2a2a2a]"><CalendarDays size={18} /> Planning</button>
          <button onClick={() => { setOpen(false); setModal("history"); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#2a2a2a]"><History size={18} /> History</button>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-800">
              <h2 className="font-bold text-lg text-white capitalize">{modal}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-5 text-sm text-gray-400">AI features active.</div>
          </div>
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
          <p className="text-[#00FF88] text-sm font-semibold">Powered by Groq (GPT-OSS)</p>
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

// ─── AI 3D Lab (Search & Fullscreen) ───
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <Center><primitive object={scene} /></Center>;
}

function Loader3D() {
  const { progress } = useProgress();
  return <Html center><div className="text-white text-xl font-bold bg-black/50 p-4 rounded-xl">{Math.round(progress)}%</div></Html>;
}

function AISearch3DLab() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedModel, setSelectedModel] = useState(modelDB[0]);
  const [isFull, setIsFull] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    const prompt = `User wants a 3D model of: "${query}". 
    Choose the best matching URL from this list. Return ONLY the URL, nothing else.
    ${modelDB.map(m => `${m.name}: ${m.url}`).join("\n")}`;
    
    const result = await callGroq(prompt);
    const foundModel = modelDB.find(m => result.includes(m.url)) || modelDB[0];
    setSelectedModel(foundModel);
    setSearching(false);
  };

  return (
    <div className={`p-4 max-w-4xl mx-auto ${isFull ? 'fixed inset-0 z-[100] bg-[#0a0a0a] max-w-full pt-4' : 'pt-6 pb-24'}`}>
      {!isFull && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Box className="text-[#00FF88]"/> AI 3D Lab</h1>
          <ThreeDot />
        </div>
      )}
      {!isFull && (
        <div className="mb-5 flex gap-2 bg-[#1a1a1a] p-2 rounded-2xl border border-gray-800">
          <input 
            type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ask AI (e.g. Dinosaur, Robot)..." 
            className="flex-1 bg-transparent text-white px-4 outline-none" 
          />
          <button onClick={handleSearch} disabled={searching} className="bg-[#00FF88] text-black p-3 rounded-xl font-bold disabled:opacity-50">
            {searching ? "..." : <Search size={20}/>}
          </button>
        </div>
      )}
      <div className={`w-full bg-[#111827] overflow-hidden relative shadow-2xl border border-gray-800 ${isFull ? 'h-screen rounded-none' : 'h-80 md:h-[500px] rounded-3xl'}`}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={<Loader3D />}><Model url={selectedModel.url} /></Suspense>
          <OrbitControls autoRotate enableZoom={true} />
        </Canvas>
        <div className="absolute top-4 left-4 bg-black/60 text-[#00FF88] text-xs font-bold px-3 py-1.5 rounded-full border border-[#00FF88]/30">
          {selectedModel.name}
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
           <button onClick={() => setIsFull(!isFull)} className="bg-[#00FF88] text-black p-2 rounded-full">
             {isFull ? <Minimize size={18}/> : <Maximize size={18}/>}
           </button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Course Detail ───
function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNote = async () => {
    setLoading(true);
    const res = await callGroq(`Summarize key points of "${course.title}" in 3 bullets.`);
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
        {note && <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">{note}</pre>}
      </div>
      <Link to="/practice" className="bg-[#00FF88] text-black px-4 py-4 rounded-2xl font-bold block text-center">Open Practice Lab</Link>
    </div>
  );
}

// ─── 🧠 Practice Lab (Based on Neural Network Video) ───
function PracticeLabHome() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2"><Brain className="text-[#00FF88]"/> Neural Network Lab</h1>
      <p className="text-gray-400 text-sm mb-6">Interactive tools based on "But what is a neural network?"</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link to="/practice/neuron" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 hover:border-[#00FF88] transition-all">
          <Activity className="text-[#00FF88] mb-4" size={32}/>
          <h2 className="text-xl font-bold text-white mb-2">Neuron Visualizer</h2>
          <p className="text-sm text-gray-400 mb-4">See how weights, biases, and activation functions work inside a neuron.</p>
          <span className="text-[#00FF88] text-sm font-bold flex items-center gap-1">Open Tool <ChevronRight size={16}/></span>
        </Link>
        
        <Link to="/practice/python-nn" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 hover:border-[#00FF88] transition-all">
          <Terminal className="text-[#00FF88] mb-4" size={32}/>
          <h2 className="text-xl font-bold text-white mb-2">Python NN Lab</h2>
          <p className="text-sm text-gray-400 mb-4">Write Python code to build and train a simple neural network from scratch.</p>
          <span className="text-[#00FF88] text-sm font-bold flex items-center gap-1">Open Tool <ChevronRight size={16}/></span>
        </Link>

        <Link to="/practice/prompt" className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 hover:border-[#00FF88] transition-all md:col-span-2">
          <PenTool className="text-[#00FF88] mb-4" size={32}/>
          <h2 className="text-xl font-bold text-white mb-2">AI Prompt Engineer</h2>
          <p className="text-sm text-gray-400 mb-4">Ask AI to explain concepts from the video (e.g., "Explain backpropagation like I'm 5").</p>
          <span className="text-[#00FF88] text-sm font-bold flex items-center gap-1">Open Tool <ChevronRight size={16}/></span>
        </Link>
      </div>
    </div>
  );
}

// ─── 🧠 Neuron Visualizer ───
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
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Input 1: {inputs[0]}</label>
              <input type="range" min="-2" max="2" step="0.1" value={inputs[0]} onChange={(e) => setInputs([parseFloat(e.target.value), inputs[1]])} className="w-full accent-[#00FF88]" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Input 2: {inputs[1]}</label>
              <input type="range" min="-2" max="2" step="0.1" value={inputs[1]} onChange={(e) => setInputs([inputs[0], parseFloat(e.target.value)])} className="w-full accent-[#00FF88]" />
            </div>
            <hr className="border-gray-800 my-4"/>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Weight 1: {weights[0]}</label>
              <input type="range" min="-2" max="2" step="0.1" value={weights[0]} onChange={(e) => setWeights([parseFloat(e.target.value), weights[1]])} className="w-full accent-[#00FF88]" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Weight 2: {weights[1]}</label>
              <input type="range" min="-2" max="2" step="0.1" value={weights[1]} onChange={(e) => setWeights([weights[0], parseFloat(e.target.value)])} className="w-full accent-[#00FF88]" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Bias: {bias}</label>
              <input type="range" min="-2" max="2" step="0.1" value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} className="w-full accent-[#00FF88]" />
            </div>
          </div>

          {/* Visualization */}
          <div className="flex flex-col items-center justify-center bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800">
             <div className="flex gap-8 mb-6">
               <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-white font-bold">{inputs[0]}</div>
                 <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-white font-bold">{inputs[1]}</div>
               </div>
               <div className="flex flex-col justify-center gap-6 text-gray-500">
                 <div className="text-sm text-center">x {weights[0]}</div>
                 <div className="text-sm text-center">x {weights[1]}</div>
               </div>
               <div className="flex items-center">
                 <div className="w-16 h-16 rounded-full bg-[#00FF88]/20 border-2 border-[#00FF88] flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                   {output.toFixed(2)}
                 </div>
               </div>
             </div>
             <div className="text-center text-sm text-gray-400">
               <p>Weighted Sum: <span className="text-white">{weightedSum.toFixed(2)}</span></p>
               <p>Activation (Sigmoid): <span className="text-[#00FF88] font-bold">{output.toFixed(4)}</span></p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 🐍 Python NN Lab ───
function PythonNNLab() {
  const [code, setCode] = useState(`# Simple Neural Network from scratch (based on 3Blue1Brown)
import math

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def neuron(inputs, weights, bias):
    total = sum(i*w for i,w in zip(inputs, weights)) + bias
    return sigmoid(total)

# Test
inputs = [1.0, 0.5]
weights = [0.8, -0.4]
bias = 0.1

output = neuron(inputs, weights, bias)
print(f"Output: {output:.4f}")
`);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runPython = async () => {
    setLoading(true);
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
      setOutput(data.run.output || data.run.stderr || "No output");
    } catch (err) {
      setOutput("Error connecting to Python server.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1">&larr; Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Terminal className="text-[#00FF88]"/> Python NN Lab</h1>
        <p className="text-sm text-gray-400 mb-4">Recreate the neural network from the video using pure Python.</p>
        
        <textarea 
          value={code} onChange={(e) => setCode(e.target.value)}
          className="w-full bg-[#0a0a0a] text-[#00FF88] font-mono text-sm p-4 rounded-xl h-64 outline-none border border-gray-800 focus:border-[#00FF88]"
          spellCheck="false"
        />
        <button onClick={runPython} disabled={loading} className="mt-4 bg-[#00FF88] text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
          <Play size={18}/> {loading ? "Running..." : "Run Code"}
        </button>
        <div className="mt-4 bg-black border border-gray-800 p-4 rounded-xl">
          <p className="text-gray-500 text-xs mb-2">Output:</p>
          <pre className="text-white text-sm font-mono whitespace-pre-wrap">{output || "// Output will appear here..."}</pre>
        </div>
      </div>
    </div>
  );
}

// ─── AI Prompt Engineer ───
function AIPromptTool() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if(!prompt) return;
    setLoading(true);
    const response = await callGroq(`You are a helpful AI tutor for neural networks. Answer the following student question clearly and concisely: "${prompt}"`);
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1">&larr; Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><PenTool className="text-[#00FF88]"/> AI Neural Network Tutor</h1>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask anything about neural networks..." className="w-full bg-[#0a0a0a] text-white border border-gray-700 p-4 rounded-2xl mb-4 h-40 text-sm outline-none focus:border-[#00FF88]" />
        <button onClick={generate} disabled={loading} className="bg-[#00FF88] text-black font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50">
          {loading ? "Thinking..." : "Ask AI"}
        </button>
        {result && <div className="mt-8 bg-[#0a0a0a] border border-gray-700 p-5 rounded-2xl text-sm text-gray-300 whitespace-pre-wrap">{result}</div>}
      </div>
    </div>
  );
}

// ─── Chat ───
function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "a", content: "Hi! Ami AI. Kivabe sahajjo korte pari?" }]);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => { 
    if (!txt.trim()) return; 
    setMsgs((m) => [...m, { role: "u", content: txt }]); setTxt(""); setLoading(true);
    const res = await callGroq(txt);
    setMsgs((m) => [...m, { role: "a", content: res }]); setLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {open ? (
        <div className="w-[300px] h-96 bg-[#1a1a1a] border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex justify-between p-4 border-b border-gray-800 bg-[#0a0a0a]">
            <span className="font-bold text-sm text-[#00FF88] flex gap-2"><Sparkles size={16}/> AI Chat</span>
            <button onClick={() => setOpen(false)} className="text-gray-400"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {msgs.map((m, i) => <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.role === "u" ? "bg-[#00FF88] text-black ml-auto" : "bg-[#2a2a2a] text-gray-200"}`}>{m.content}</div>)}
            {loading && <div className="text-gray-500 text-xs italic">Typing...</div>}
          </div>
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask..." className="flex-1 bg-[#0a0a0a] text-white border border-gray-700 rounded-full px-4 text-sm outline-none focus:border-[#00FF88]" />
            <button onClick={send} disabled={loading} className="bg-[#00FF88] text-black p-2 rounded-full disabled:opacity-50"><Send size={16} /></button>
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
      <Link to="/3d-lab" className="flex flex-col items-center text-[11px] text-gray-500 hover:text-[#00FF88]"><Box size={22} className="mb-1"/>3D Lab</Link>
      <Link to="/practice" className="flex flex-col items-center text-[11px] text-gray-500 hover:text-[#00FF88]"><Brain size={22} className="mb-1"/>Lab</Link>
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
          <Route path="/3d-lab" element={<AISearch3DLab />} />
          <Route path="/practice" element={<PracticeLabHome />} />
          <Route path="/practice/neuron" element={<NeuronVisualizer />} />
          <Route path="/practice/python-nn" element={<PythonNNLab />} />
          <Route path="/practice/prompt" element={<AIPromptTool />} />
        </Routes>
        <Chat />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}