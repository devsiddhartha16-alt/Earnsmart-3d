import { useState, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, Home, FlaskConical, Box, Code, PenTool, Play, 
  Clock, GraduationCap, ChevronRight, Cpu, Video, Wand2
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";

// 🎬 Courses Data (Added AI Video Course)
const courses = [
  { id: "ai-learning", title: "AI Learning", description: "AI ও Neural Network বেসিক", category: "AI", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80" },
  { id: "website-making", title: "Website Making", description: "React দিয়ে ওয়েবসাইট বানাও", category: "Web", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  { id: "graphics-basics", title: "Graphics Basics", description: "Web Design ও Graphics", category: "Design", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80" },
  { id: "ai-video-creation", title: "AI Video Creation", description: "স্ক্রিপ্ট দিয়ে প্রফেশনাল AI ভিডিও বানাও", category: "AI Video", videoUrl: "https://www.youtube.com/watch?v=3n1T3H8Q1O4", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80" },
  { id: "freelancing-foundation", title: "Freelancing Foundation", description: "ফ্রিল্যান্সিং স্কিল বানাও", category: "Free", videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80" },
];

// 🌍 3D Models (Khronos & Polyfork CDN - Reliable Links)
const models3d = [
  { name: "Damaged Helmet", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" },
  { name: "Cesium Milk Truck", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb" },
  { name: "Materials Shoe", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb" },
  { name: "White Clover Plant", url: "https://polyfork.dev/cdn/white-clover-plant-6ed185.glb" },
  { name: "Boom Box", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/BoomBox.glb" },
  { name: "Water Bottle", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/WaterBottle.glb" },
  { name: "Duck", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Duck.glb" },
  { name: "Robot Expressive", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb" },
  { name: "Earth", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Earth.glb" },
  { name: "Horse", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Horse.glb" },
  { name: "Flamingo", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Flamingo.glb" },
  { name: "Parrot", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Parrot.glb" },
  { name: "Stork", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Stork.glb" },
  { name: "Avocado", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Avocado.glb" },
  { name: "Littlest Tokyo", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LittlestTokyo.glb" }
];

// ─── Components ───
function ThreeDot() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
        {open ? <X size={20} /> : <MoreVertical size={20} />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl py-1 z-50">
          <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Settings size={18} /> Settings</button>
          <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><CalendarDays size={18} /> Planning</button>
          <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><History size={18} /> History</button>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Earnsmart-3d</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Learner! 👋</p>
        </div>
        <ThreeDot />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg shadow-blue-200">
          <GraduationCap size={24} className="mb-2 opacity-80" />
          <p className="text-2xl font-bold">{courses.length}</p>
          <p className="text-xs opacity-90">Courses</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg shadow-purple-200">
          <Clock size={24} className="mb-2 opacity-80" />
          <p className="text-2xl font-bold">12.5</p>
          <p className="text-xs opacity-90">Hours</p>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl p-4 shadow-lg shadow-orange-200">
          <Video size={24} className="mb-2 opacity-80" />
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs opacity-90">AI Videos</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Explore Courses</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((c) => (
          <Link key={c.id} to={`/course/${c.id}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-40 overflow-hidden relative">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute top-3 left-3 text-xs font-bold text-white bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">{c.category}</span>
              <h3 className="absolute bottom-3 left-4 text-xl font-bold text-white">{c.title}</h3>
            </div>
            <div className="p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">{c.description}</p>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function ModelLab() {
  const [selectedModel, setSelectedModel] = useState(models3d[0]);
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Box className="text-blue-600"/> 3D Lab</h1>
        <ThreeDot />
      </div>
      
      <div className="mb-5 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Model to Explore</label>
        <select 
          className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedModel.url}
          onChange={(e) => setSelectedModel(models3d.find(m => m.url === e.target.value))}
        >
          {models3d.map((m, i) => <option key={i} value={m.url}>{m.name}</option>)}
        </select>
      </div>

      <div className="w-full h-80 md:h-[500px] bg-[#111827] rounded-3xl overflow-hidden relative shadow-2xl">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={<Html center><div className="text-white flex flex-col items-center gap-2"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div><span>Loading Model...</span></div></Html>}>
            <Model url={selectedModel.url} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1.5} />
        </Canvas>
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white/90 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
          <Sparkles size={14}/> {selectedModel.name}
        </div>
      </div>
    </div>
  );
}

function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [note, setNote] = useState("");

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-5">
        <button onClick={() => window.history.back()} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
           &larr; Back
        </button>
        <ThreeDot />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{course.category}</span>
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
      </div>

      <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 shadow-lg ring-1 ring-gray-900/5">
        <ReactPlayer url={course.videoUrl} controls playing={false} width="100%" height="100%" />
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Sparkles size={20} className="text-indigo-500"/> AI Note</h3>
          <button onClick={() => setNote("📌 Key takeaways:\n1. Introduction\n2. Core concepts\n3. Practical example")} className="text-sm font-medium bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">Create Note</button>
        </div>
        {note ? <pre className="whitespace-pre-wrap text-sm bg-indigo-50/50 text-gray-800 p-4 rounded-xl border border-indigo-100 font-medium">{note}</pre> : <p className="text-gray-400 text-sm">Click "Create Note" to summarize this video with AI.</p>}
      </div>

      <Link to="/practice" className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-4 rounded-2xl font-bold shadow-lg shadow-green-200 hover:scale-[1.02] transition-transform">
        <FlaskConical size={22} /> Open Practice Lab
      </Link>
    </div>
  );
}

function PracticeLab() {
  const [toolTab, setToolTab] = useState("prompt");
  const [prompt, setPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [videoScript, setVideoScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const generateVideo = () => {
    if(!videoScript.trim()) return;
    setIsGenerating(true);
    // Simulating API call (Runway ML / Luma AI)
    setTimeout(() => {
      setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4"); // Demo placeholder
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FlaskConical className="text-green-600"/> Practice Lab</h1>
        <ThreeDot />
      </div>

      <div className="flex gap-3 mb-6 bg-gray-200/60 p-1.5 rounded-2xl overflow-x-auto">
        <button onClick={() => setToolTab("prompt")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${toolTab === "prompt" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
          <PenTool size={18} /> AI Prompt
        </button>
        <button onClick={() => setToolTab("code")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${toolTab === "code" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
          <Code size={18} /> Code Runner
        </button>
        <button onClick={() => setToolTab("video")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${toolTab === "video" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
          <Video size={18} /> AI Video
        </button>
      </div>

      {toolTab === "prompt" && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><Cpu className="text-blue-500"/> AI Prompt Writing Tool</h2>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what you want AI to do..." className="w-full border border-gray-200 p-4 rounded-2xl mb-4 h-32 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          <button onClick={() => setAiResult("Simulated AI Response:\nTo achieve this, you should first break down the problem into smaller tasks.")} className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">Generate Result</button>
          {aiResult && <div className="mt-6 bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm whitespace-pre-wrap text-gray-700"><span className="font-bold text-blue-800 flex items-center gap-2 mb-2"><Sparkles size={16}/> Result:</span>{aiResult}</div>}
        </div>
      )}

      {/* Code Runner - Visual Live Preview using Sandpack */}
      {toolTab === "code" && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><Code className="text-green-500"/> Live Code Editor</h2>
          <p className="text-xs text-gray-500 mb-4">আপনার লেখা কোডের ভিজ্যুয়াল আউটপুট ডানদিকে বা নিচে লাইভ দেখা যাবে।</p>
          <div className="rounded-2xl overflow-hidden border border-gray-200 h-[400px]">
             <Sandpack 
                template="react" 
                theme="dark"
                options={{
                  showNavigator: false,
                  showTabs: true,
                  editorHeight: 400,
                }}
                files={{
                  "/App.js": `export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#2563eb' }}>Hello Earnsmart!</h1>
      <p>This is a live preview. Edit the code to see changes.</p>
      <button onClick={() => alert('Working!')} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Click Me
      </button>
    </div>
  );
}`
                }}
             />
          </div>
        </div>
      )}

      {/* AI Video Creator */}
      {toolTab === "video" && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><Wand2 className="text-purple-500"/> Professional AI Video Creator</h2>
          <p className="text-sm text-gray-500 mb-4">আপনার নিজের স্ক্রিপ্ট বা প্রম্পট লিখুন এবং AI দিয়ে প্রফেশনাল ভিডিও তৈরি করুন (Luma AI / Runway ML)।</p>
          <textarea value={videoScript} onChange={(e) => setVideoScript(e.target.value)} placeholder="যেমন: A cinematic shot of a futuristic city at night with neon lights..." className="w-full border border-gray-200 p-4 rounded-2xl mb-4 h-32 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" />
          <button onClick={generateVideo} disabled={isGenerating} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-purple-200 disabled:opacity-50">
            {isGenerating ? "Generating Video..." : <><Play size={18} fill="currentColor"/> Generate Video</>}
          </button>

          {isGenerating && (
            <div className="mt-8 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
               <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-sm text-gray-600 font-medium">AI is rendering your video... (Demo)</p>
            </div>
          )}

          {videoUrl && !isGenerating && (
             <div className="mt-8">
               <h3 className="font-semibold text-gray-800 mb-2">Generated Result (Preview):</h3>
               <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-black">
                 <video src={videoUrl} controls className="w-full h-full object-cover" />
               </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "a", content: "Hi! আমি Earnsmart AI. কীভাবে সাহায্য করতে পারি?" }]);
  const [txt, setTxt] = useState("");
  const send = () => {
    if (!txt.trim()) return;
    setMsgs((m) => [...m, { role: "u", content: txt }, { role: "a", content: "আমি একটি ডেমো AI। পরবর্তীতে আসল API কানেক্ট করা হবে।" }]);
    setTxt("");
  };
  return (
    <div className="fixed bottom-24 right-4 z-50">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm h-96 bg-white border border-gray-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <span className="font-bold text-sm flex items-center gap-2"><Sparkles size={16}/> AI Tutor</span>
            <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-full p-1"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm bg-gray-50">
            {msgs.map((m, i) => (
              <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.role === "u" ? "bg-blue-600 text-white ml-auto rounded-br-sm" : "bg-white border border-gray-100 text-gray-700 mr-auto rounded-bl-sm shadow-sm"}`}>{m.content}</div>
            ))}
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask anything..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" />
            <button onClick={send} className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors"><Send size={16} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl shadow-blue-300 hover:scale-110 transition-transform"><MessageCircle size={26} /></button>
      )}
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around py-3 z-40 pb-safe">
      <Link to="/" className="flex flex-col items-center text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"><Home size={22} className="mb-1"/>Home</Link>
      <Link to="/3d-lab" className="flex flex-col items-center text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"><Box size={22} className="mb-1"/>3D Lab</Link>
      <Link to="/practice" className="flex flex-col items-center text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"><FlaskConical size={22} className="mb-1"/>Practice</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/3d-lab" element={<ModelLab />} />
          <Route path="/practice" element={<PracticeLab />} />
        </Routes>
        <Chat />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}