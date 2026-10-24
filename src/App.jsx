import { useState, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, Home, FlaskConical, Box, Code, PenTool, Play, 
  Clock, GraduationCap, ChevronRight, Cpu, Video, Wand2, ArrowLeft, CheckCircle,
  ShieldCheck, Wallet, Headphones
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center, useProgress } from "@react-three/drei";

// 🎬 Courses Data (Images using WebP format)
const courses = [
  { id: "ai-learning", title: "AI Learning", description: "AI ও Neural Network বেসিক", category: "AI", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80&fm=webp" },
  { id: "website-making", title: "Website Making", description: "React দিয়ে ওয়েবসাইট বানাও", category: "Web", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80&fm=webp" },
  { id: "graphics-basics", title: "Graphics Basics", description: "Web Design ও Graphics", category: "Design", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80&fm=webp" },
  { id: "ai-video-creation", title: "AI Video Creation", description: "স্ক্রিপ্ট দিয়ে AI ভিডিও বানাও", category: "AI Video", videoUrl: "https://www.youtube.com/watch?v=3n1T3H8Q1O4", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80&fm=webp" }
];

// 🌍 3D Models List
const models3d = [
  { name: "Astronaut", url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Robot", url: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb" },
  { name: "Human Brain", url: "https://modelviewer.dev/shared-assets/models/BrainStem.glb" },
  { name: "T-Rex Dinosaur", url: "https://modelviewer.dev/shared-assets/models/T-Rex.glb" },
  { name: "Damaged Helmet", url: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" },
  { name: "Horse", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Horse.glb" },
  { name: "Flamingo", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Flamingo.glb" },
  { name: "Parrot", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Parrot.glb" },
  { name: "Stork", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Stork.glb" },
  { name: "Duck", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Duck.glb" }
];

// ─── Three Dot Menu (Dark Theme) ───
function ThreeDot() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:text-white transition-colors border border-gray-800">
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
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-800">
              <h2 className="font-bold text-lg text-white capitalize">{modal}</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            <div className="p-5 text-sm text-gray-400">
              {modal === "settings" && <div className="space-y-4"><div className="flex justify-between"><span>Dark Mode</span> <span className="text-xs bg-[#00FF88] text-black px-2 py-1 rounded font-bold">On</span></div></div>}
              {modal === "planning" && <div className="space-y-3"><div className="flex items-center gap-2 text-[#00FF88]"><CheckCircle size={16}/> Complete 3D Task</div></div>}
              {modal === "history" && <div className="space-y-3"><div className="bg-[#2a2a2a] p-3 rounded-lg text-white">Earned 50৳ from Task</div></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Home Page (Hero + Trust + How it works) ───
function Dashboard() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Earnsmart 3D</h1>
          <p className="text-[#00FF88] text-sm font-semibold mt-1">100% Free | No Investment | BD te Payment</p>
        </div>
        <ThreeDot />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-800 rounded-3xl p-8 text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"></div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          Ghure Dekho, Task Koro, <br/><span className="text-[#00FF88]">Taka Jito</span>
        </h2>
        <p className="text-gray-400 mb-6">3D World explore kore income korar shobcheye shohoj platform.</p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col items-center text-center">
          <ShieldCheck size={28} className="text-[#00FF88] mb-2" />
          <p className="text-white font-bold text-sm">500+</p>
          <p className="text-gray-500 text-xs">Active User</p>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col items-center text-center">
          <Wallet size={28} className="text-[#00FF88] mb-2" />
          <p className="text-white font-bold text-sm">bKash/Nagad</p>
          <p className="text-gray-500 text-xs">Instant Payment</p>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col items-center text-center">
          <Headphones size={28} className="text-[#00FF88] mb-2" />
          <p className="text-white font-bold text-sm">24/7</p>
          <p className="text-gray-500 text-xs">Support</p>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Kivabe Kaj Kore?</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00FF88] text-black font-bold flex items-center justify-center">1</div>
            <p className="text-gray-300 font-medium">Login / Signup koro</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00FF88] text-black font-bold flex items-center justify-center">2</div>
            <p className="text-gray-300 font-medium">3D te Task khojo o complete koro</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00FF88] text-black font-bold flex items-center justify-center">3</div>
            <p className="text-gray-300 font-medium">Taka Wallet e joma hobe</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Free Courses</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <Link key={c.id} to={`/course/${c.id}`} className="group block bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#00FF88] transition-all duration-300">
            <div className="h-40 overflow-hidden relative">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
              <h3 className="absolute bottom-3 left-4 text-xl font-bold text-white">{c.title}</h3>
            </div>
            <div className="p-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">{c.description}</p>
              <ChevronRight size={20} className="text-[#00FF88]" />
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Links */}
      <div className="mt-12 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
        <p>© 2024 Earnsmart 3D</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#00FF88]">Facebook Page</a>
          <a href="#" className="hover:text-[#00FF88]">WhatsApp Support</a>
        </div>
      </div>
    </div>
  );
}

// ─── 3D Lab (With Loader & Skip) ───
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <Center><primitive object={scene} /></Center>;
}

// Custom 3D Loader Component
function Loader3D() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-white bg-black/50 p-6 rounded-2xl backdrop-blur-md border border-gray-700">
        <div className="text-xl font-bold mb-2">Loading 3D World...</div>
        <div className="text-4xl font-extrabold text-[#00FF88]">{Math.round(progress)}%</div>
      </div>
    </Html>
  );
}

function ModelLab() {
  const [selectedModel, setSelectedModel] = useState(models3d[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [skip3d, setSkip3d] = useState(false);

  // Auto rotate for 2 seconds, then stop
  useEffect(() => {
    const timer = setTimeout(() => setAutoRotate(false), 2000);
    return () => clearTimeout(timer);
  }, [selectedModel]);

  // Show skip button after 3 seconds
  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(skipTimer);
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Box className="text-[#00FF88]"/> 3D Task Lab</h1>
        <ThreeDot />
      </div>

      <div className="mb-5 bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Select a Model</label>
        <select className="w-full p-3 border border-gray-700 rounded-xl bg-[#0a0a0a] text-white font-medium outline-none focus:border-[#00FF88]" value={selectedModel.url} onChange={(e) => { setSelectedModel(models3d.find(m => m.url === e.target.value)); setSkip3d(false); }}>
          {models3d.map((m, i) => <option key={i} value={m.url}>{m.name}</option>)}
        </select>
      </div>

      <div className="w-full h-80 md:h-[500px] bg-[#111827] rounded-3xl overflow-hidden relative shadow-2xl border border-gray-800">
        {skip3d ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-center p-6">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&fm=webp" alt="2D Preview" className="w-full h-full object-cover opacity-50 absolute inset-0" />
            <div className="relative z-10">
               <p className="text-white text-xl font-bold mb-2">2D Mode</p>
               <p className="text-gray-400 text-sm">3D load hote shomoy nicche. 2D te dekho.</p>
            </div>
          </div>
        ) : (
          <>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={2} />
              <Suspense fallback={<Loader3D />}>
                <Model url={selectedModel.url} />
              </Suspense>
              <OrbitControls autoRotate={autoRotate} enableZoom={true} />
            </Canvas>
            
            {/* Skip Button if 3s passed */}
            {showSkip && (
              <button 
                onClick={() => setSkip3d(true)}
                className="absolute bottom-4 right-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-xl border border-gray-700 text-sm font-medium transition-colors z-10"
              >
                Skip 3D - 2D te dekho
              </button>
            )}

            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[#00FF88] text-xs font-bold px-3 py-1.5 rounded-full border border-[#00FF88]/30">
              {selectedModel.name}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Course Detail ───
function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [note, setNote] = useState("");

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <div className="flex justify-between items-center mb-5">
        <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1"><ArrowLeft size={16}/> Back</Link>
        <ThreeDot />
      </div>
      <h1 className="text-2xl font-bold text-white mb-4">{course.title}</h1>
      <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-gray-800">
        <ReactPlayer url={course.videoUrl} controls playing={false} width="100%" height="100%" />
      </div>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white flex items-center gap-2"><Sparkles size={20} className="text-[#00FF88]"/> AI Note</h3>
          <button onClick={() => setNote("📌 Key takeaways:\n1. Introduction\n2. Core concepts")} className="text-sm font-medium bg-[#00FF88] text-black px-4 py-2 rounded-xl hover:bg-white transition-colors">Create Note</button>
        </div>
        {note ? <pre className="whitespace-pre-wrap text-sm bg-[#0a0a0a] text-gray-300 p-4 rounded-xl border border-gray-800">{note}</pre> : <p className="text-gray-500 text-sm">Click "Create Note" to summarize this video with AI.</p>}
      </div>
      <Link to="/practice" className="flex items-center justify-center gap-2 bg-[#00FF88] text-black px-4 py-4 rounded-2xl font-bold shadow-lg shadow-[#00FF88]/20 hover:scale-[1.02] transition-transform">
        <FlaskConical size={22} /> Open Practice Lab
      </Link>
    </div>
  );
}

// ─── Practice Lab Home ───
function PracticeLabHome() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2"><FlaskConical className="text-[#00FF88]"/> Practice Lab</h1>
          <p className="text-gray-400 text-sm mt-1">Choose a tool to start creating</p>
        </div>
        <ThreeDot />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link to="/practice/prompt" className="group bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 shadow-sm hover:border-[#00FF88] hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 bg-[#00FF88]/10 text-[#00FF88] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#00FF88] group-hover:text-black transition-colors"><PenTool size={28} /></div>
          <h2 className="text-xl font-bold text-white mb-2">AI Prompt Writer</h2>
          <p className="text-sm text-gray-400 mb-4">Write and refine prompts for any AI.</p>
        </Link>

        <Link to="/practice/code" className="group bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 shadow-sm hover:border-[#00FF88] hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 bg-[#00FF88]/10 text-[#00FF88] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#00FF88] group-hover:text-black transition-colors"><Code size={28} /></div>
          <h2 className="text-xl font-bold text-white mb-2">Live Code Editor</h2>
          <p className="text-sm text-gray-400 mb-4">Write code and see visual result.</p>
        </Link>

        <Link to="/practice/video" className="group bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 shadow-sm hover:border-[#00FF88] hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 bg-[#00FF88]/10 text-[#00FF88] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#00FF88] group-hover:text-black transition-colors"><Wand2 size={28} /></div>
          <h2 className="text-xl font-bold text-white mb-2">AI Video Creator</h2>
          <p className="text-sm text-gray-400 mb-4">Generate videos from text script.</p>
        </Link>
      </div>
    </div>
  );
}

function AIPromptTool() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  return (
    <div className="p-4 max-w-3xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1 mb-6"><ArrowLeft size={16}/> Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><PenTool className="text-[#00FF88]"/> AI Prompt Writer</h1>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what you want to create..." className="w-full bg-[#0a0a0a] text-white border border-gray-700 p-4 rounded-2xl mb-4 h-40 text-sm outline-none focus:border-[#00FF88]" />
        <button onClick={() => setResult("Optimized Prompt: [AI generated response based on your input]")} className="bg-[#00FF88] text-black font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors">Generate Prompt</button>
        {result && <div className="mt-8 bg-[#0a0a0a] border border-gray-700 p-5 rounded-2xl text-sm text-gray-300">{result}</div>}
      </div>
    </div>
  );
}

function CodeTool() {
  return (
    <div className="p-4 max-w-5xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1 mb-6"><ArrowLeft size={16}/> Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Code className="text-[#00FF88]"/> Live Code Editor</h1>
        <div className="rounded-2xl overflow-hidden border border-gray-700 h-[500px]">
          <Sandpack template="react" theme="dark" options={{ showNavigator: false, editorHeight: 500 }} files={{ "/App.js": `export default function App() {\n  return (\n    <div style={{ padding: 20, textAlign: 'center', color: 'white' }}>\n      <h1 style={{ color: '#00FF88' }}>Hello Earnsmart!</h1>\n    </div>\n  );\n}` }} />
        </div>
      </div>
    </div>
  );
}

function VideoTool() {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  
  const generate = () => {
    if(!script) return; setLoading(true);
    setTimeout(() => { setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"); setLoading(false); }, 2500);
  };
  
  return (
    <div className="p-4 max-w-3xl mx-auto pt-6 pb-24">
      <Link to="/practice" className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1 mb-6"><ArrowLeft size={16}/> Back to Lab</Link>
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Wand2 className="text-[#00FF88]"/> AI Video Creator</h1>
        <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="e.g. A drone shot flying over a futuristic city..." className="w-full bg-[#0a0a0a] text-white border border-gray-700 p-4 rounded-2xl mb-4 h-32 text-sm outline-none focus:border-[#00FF88]" />
        <button onClick={generate} disabled={loading} className="flex items-center justify-center gap-2 bg-[#00FF88] text-black font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50">
          {loading ? <><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Generating...</> : <><Play size={18}/> Generate Video</>}
        </button>
        {videoUrl && !loading && (
          <div className="mt-8"><video src={videoUrl} controls autoPlay className="w-full rounded-2xl border border-gray-700" /></div>
        )}
      </div>
    </div>
  );
}

// ─── Chat ───
function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "a", content: "Hi! Ami Earnsmart AI. Kivabe sahajjo korte pari?" }]);
  const [txt, setTxt] = useState("");
  const send = () => { if (!txt.trim()) return; setMsgs((m) => [...m, { role: "u", content: txt }, { role: "a", content: "Ami demo AI." }]); setTxt(""); };
  return (
    <div className="fixed bottom-24 right-4 z-50">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm h-96 bg-[#1a1a1a] border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex justify-between p-4 border-b border-gray-800 bg-[#0a0a0a]">
            <span className="font-bold text-sm text-[#00FF88] flex items-center gap-2"><Sparkles size={16}/> AI Tutor</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {msgs.map((m, i) => <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.role === "u" ? "bg-[#00FF88] text-black ml-auto" : "bg-[#2a2a2a] text-gray-200"}`}>{m.content}</div>)}
          </div>
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask anything..." className="flex-1 bg-[#0a0a0a] text-white border border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:border-[#00FF88]" />
            <button onClick={send} className="bg-[#00FF88] text-black p-2.5 rounded-full"><Send size={16} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="bg-[#00FF88] text-black p-4 rounded-full shadow-xl shadow-[#00FF88]/20 hover:scale-110 transition-transform"><MessageCircle size={26} /></button>
      )}
    </div>
  );
}

// ─── Bottom Nav & Sticky Button ───
function BottomNav() {
  return (
    <>
      {/* Sticky Main Action Button */}
      <div className="fixed bottom-[70px] left-0 right-0 px-4 z-40 pointer-events-none flex justify-center">
        <Link to="/" className="pointer-events-auto bg-[#00FF88] text-black font-extrabold text-lg px-8 py-3 rounded-full shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:scale-105 transition-transform flex items-center gap-2">
          Earning Shuru Koro <ChevronRight size={20}/>
        </Link>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 flex justify-around py-3 z-40 pb-safe">
        <Link to="/" className="flex flex-col items-center text-[11px] font-semibold text-gray-500 hover:text-[#00FF88]"><Home size={22} className="mb-1"/>Home</Link>
        <Link to="/3d-lab" className="flex flex-col items-center text-[11px] font-semibold text-gray-500 hover:text-[#00FF88]"><Box size={22} className="mb-1"/>3D Lab</Link>
        <Link to="/practice" className="flex flex-col items-center text-[11px] font-semibold text-gray-500 hover:text-[#00FF88]"><FlaskConical size={22} className="mb-1"/>Practice</Link>
      </nav>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#00FF88] selection:text-black">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/3d-lab" element={<ModelLab />} />
          <Route path="/practice" element={<PracticeLabHome />} />
          <Route path="/practice/prompt" element={<AIPromptTool />} />
          <Route path="/practice/code" element={<CodeTool />} />
          <Route path="/practice/video" element={<VideoTool />} />
        </Routes>
        <Chat />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}