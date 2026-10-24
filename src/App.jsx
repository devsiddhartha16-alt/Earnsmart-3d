import { useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, Home, FlaskConical, Box, Code, PenTool, Play, 
  Clock, GraduationCap, ChevronRight, Cpu, Video, Wand2, ArrowLeft, CheckCircle
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";

// 🎬 Courses Data
const courses = [
  { id: "ai-learning", title: "AI Learning", description: "AI ও Neural Network বেসিক", category: "AI", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80" },
  { id: "website-making", title: "Website Making", description: "React দিয়ে ওয়েবসাইট বানাও", category: "Web", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
  { id: "graphics-basics", title: "Graphics Basics", description: "Web Design ও Graphics", category: "Design", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80" },
  { id: "ai-video-creation", title: "AI Video Creation", description: "স্ক্রিপ্ট দিয়ে AI ভিডিও বানাও", category: "AI Video", videoUrl: "https://www.youtube.com/watch?v=3n1T3H8Q1O4", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80" }
];

// 🌍 3D Models (Added Science & Space Models)
const models3d = [
  { name: "Earth (Planet)", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Earth.glb" },
  { name: "Human Brain", url: "https://modelviewer.dev/shared-assets/models/BrainStem.glb" },
  { name: "Skeleton", url: "https://modelviewer.dev/shared-assets/models/Skeleton.glb" },
  { name: "Moon", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Moon.glb" },
  { name: "Astronaut", url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb" },
  { name: "Damaged Helmet (Space)", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" },
  { name: "Cesium Milk Truck", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb" },
  { name: "White Clover Plant", url: "https://polyfork.dev/cdn/white-clover-plant-6ed185.glb" },
  { name: "Boom Box", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/BoomBox.glb" },
  { name: "Water Bottle", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/WaterBottle.glb" },
  { name: "Duck", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Duck.glb" },
  { name: "Robot", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb" },
  { name: "Horse", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Horse.glb" },
  { name: "Flamingo", url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Flamingo.glb" },
  { name: "T-Rex", url: "https://modelviewer.dev/shared-assets/models/T-Rex.glb" }
];

// ─── Three Dot Menu with Functional Modals ───
function ThreeDot() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const closeMenu = () => setOpen(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
        {open ? <X size={20} /> : <MoreVertical size={20} />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 animate-fade-in">
          <button onClick={() => { closeMenu(); setModal("settings"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Settings size={18} /> Settings</button>
          <button onClick={() => { closeMenu(); setModal("planning"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><CalendarDays size={18} /> Planning</button>
          <button onClick={() => { closeMenu(); setModal("history"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><History size={18} /> History</button>
        </div>
      )}

      {/* Modals (Popup) */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h2 className="font-bold text-lg text-gray-800 capitalize">{modal}</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-gray-200 text-gray-500"><X size={20}/></button>
            </div>
            <div className="p-5 text-sm text-gray-600">
              {modal === "settings" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span>Dark Mode</span> <span className="text-xs bg-gray-200 px-2 py-1 rounded">Soon</span></div>
                  <div className="flex justify-between items-center"><span>Language</span> <span className="font-semibold text-blue-600">English</span></div>
                  <div className="flex justify-between items-center"><span>Notifications</span> <span className="text-green-600 font-semibold">On</span></div>
                </div>
              )}
              {modal === "planning" && (
                <div className="space-y-3">
                  <p className="font-medium text-gray-800">Today's Plan:</p>
                  <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg text-blue-800"><CheckCircle size={16}/> Watch AI Learning Video</div>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><div className="w-4 h-4 border rounded-full"></div> Practice Code in Lab</div>
                </div>
              )}
              {modal === "history" && (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="font-medium text-gray-800">Website Making</p><p className="text-xs text-gray-500">Yesterday</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="font-medium text-gray-800">3D Lab: Earth</p><p className="text-xs text-gray-500">2 days ago</p></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pages ───
function Dashboard() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Earnsmart-3d</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! 👋</p>
        </div>
        <ThreeDot />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg shadow-blue-200"><GraduationCap size={24} className="mb-2 opacity-80" /><p className="text-2xl font-bold">{courses.length}</p><p className="text-xs opacity-90">Courses</p></div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg shadow-purple-200"><Clock size={24} className="mb-2 opacity-80" /><p className="text-2xl font-bold">12.5</p><p className="text-xs opacity-90">Hours</p></div>
        <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl p-4 shadow-lg shadow-orange-200"><Video size={24} className="mb-2 opacity-80" /><p className="text-2xl font-bold">3</p><p className="text-xs opacity-90">AI Videos</p></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Explore Courses</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((c) => (
          <Link key={c.id} to={`/course/${c.id}`} className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-40 overflow-hidden relative">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <span className="absolute top-3 left-3 text-xs font-bold text-white bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full">{c.category}</span>
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Model (Science & Others)</label>
        <select className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-800 outline-none focus:ring-2 focus:ring-blue-500" value={selectedModel.url} onChange={(e) => setSelectedModel(models3d.find(m => m.url === e.target.value))}>
          {models3d.map((m, i) => <option key={i} value={m.url}>{m.name}</option>)}
        </select>
      </div>
      <div className="w-full h-80 md:h-[500px] bg-[#111827] rounded-3xl overflow-hidden relative shadow-2xl">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={1.5} /><directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={<Html center><div className="text-white flex flex-col items-center gap-2"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div><span>Loading Model...</span></div></Html>}>
            <Model url={selectedModel.url} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1.5} />
        </Canvas>
        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white/90 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10"><Sparkles size={14}/> {selectedModel.name}</div>
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
        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"><ArrowLeft size={16}/> Back</Link>
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

// ─── Practice Lab Main Menu ───
function PracticeLabHome() {
  return (
    <div className="p-4 max-w-4xl mx-auto pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2"><FlaskConical className="text-green-600"/> Practice Lab</h1>
          <p className="text-gray-500 text-sm mt-1">Choose a tool to start creating</p>
        </div>
        <ThreeDot />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* AI Prompt Tool Card */}
        <Link to="/practice/prompt" className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <PenTool size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">AI Prompt Writer</h2>
          <p className="text-sm text-gray-500 mb-4">Write and refine prompts for ChatGPT, Midjourney, or any AI.</p>
          <div className="flex items-center text-blue-600 font-semibold text-sm">Open Tool <ChevronRight size={16} /></div>
        </Link>

        {/* Code Runner Tool Card */}
        <Link to="/practice/code" className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Code size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Live Code Editor</h2>
          <p className="text-sm text-gray-500 mb-4">Write HTML/React code and see the visual result instantly.</p>
          <div className="flex items-center text-green-600 font-semibold text-sm">Open Tool <ChevronRight size={16} /></div>
        </Link>

        {/* AI Video Tool Card */}
        <Link to="/practice/video" className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Wand2 size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">AI Video Creator</h2>
          <p className="text-sm text-gray-500 mb-4">Generate professional videos from a simple text script.</p>
          <div className="flex items-center text-purple-600 font-semibold text-sm">Open Tool <ChevronRight size={16} /></div>
        </Link>
      </div>
    </div>
  );
}

// ─── Individual Tools ───
function AIPromptTool() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  return (
    <div className="p-4 max-w-3xl mx-auto pt-6">
      <Link to="/practice" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-6"><ArrowLeft size={16}/> Back to Lab</Link>
      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><PenTool size={24}/></div><h1 className="text-2xl font-bold text-gray-800">AI Prompt Writer</h1></div>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe what you want to create..." className="w-full border border-gray-200 p-4 rounded-2xl mb-4 h-40 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
        <button onClick={() => setResult("Simulated AI Response:\nHere is a highly optimized prompt based on your description. [Prompt details...]")} className="w-full md:w-auto bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">Generate Prompt</button>
        {result && <div className="mt-8 bg-blue-50/50 border border-blue-100 p-5 rounded-2xl text-sm whitespace-pre-wrap text-gray-700"><span className="font-bold text-blue-800 flex items-center gap-2 mb-2"><Sparkles size={16}/> Result:</span>{result}</div>}
      </div>
    </div>
  );
}

function CodeTool() {
  return (
    <div className="p-4 max-w-5xl mx-auto pt-6">
      <Link to="/practice" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-6"><ArrowLeft size={16}/> Back to Lab</Link>
      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-green-100 text-green-600 rounded-xl"><Code size={24}/></div><div><h1 className="text-2xl font-bold text-gray-800">Live Code Editor</h1><p className="text-xs text-gray-500">Write React code and see the visual preview.</p></div></div>
        <div className="rounded-2xl overflow-hidden border border-gray-200 h-[500px]">
          <Sandpack template="react" theme="dark" options={{ showNavigator: false, editorHeight: 500 }} files={{ "/App.js": `export default function App() {\n  return (\n    <div style={{ padding: 20, textAlign: 'center' }}>\n      <h1 style={{ color: '#2563eb' }}>Hello Earnsmart!</h1>\n      <p>Edit the code to see magic.</p>\n    </div>\n  );\n}` }} />
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
    setTimeout(() => { setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4"); setLoading(false); }, 2000);
  };
  return (
    <div className="p-4 max-w-3xl mx-auto pt-6">
      <Link to="/practice" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-6"><ArrowLeft size={16}/> Back to Lab</Link>
      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Wand2 size={24}/></div><h1 className="text-2xl font-bold text-gray-800">AI Video Creator</h1></div>
        <p className="text-sm text-gray-500 mb-4">Write a script and let AI generate the video scene.</p>
        <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="e.g. A drone shot flying over a futuristic city with flying cars..." className="w-full border border-gray-200 p-4 rounded-2xl mb-4 h-32 text-sm outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" />
        <button onClick={generate} disabled={loading} className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md disabled:opacity-50">
          {loading ? "Generating..." : <><Play size={18}/> Generate Video</>}
        </button>
        {videoUrl && !loading && <div className="mt-8"><video src={videoUrl} controls className="w-full rounded-2xl border" /></div>}
      </div>
    </div>
  );
}

function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "a", content: "Hi! আমি Earnsmart AI. কীভাবে সাহায্য করতে পারি?" }]);
  const [txt, setTxt] = useState("");
  const send = () => { if (!txt.trim()) return; setMsgs((m) => [...m, { role: "u", content: txt }, { role: "a", content: "আমি একটি ডেমো AI। পরবর্তীতে আসল API কানেক্ট করা হবে।" }]); setTxt(""); };
  return (
    <div className="fixed bottom-24 right-4 z-50">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm h-96 bg-white border border-gray-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <div className="flex justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white"><span className="font-bold text-sm flex items-center gap-2"><Sparkles size={16}/> AI Tutor</span><button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-full p-1"><X size={18} /></button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm bg-gray-50">{msgs.map((m, i) => <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.role === "u" ? "bg-blue-600 text-white ml-auto rounded-br-sm" : "bg-white border border-gray-100 text-gray-700 mr-auto rounded-bl-sm shadow-sm"}`}>{m.content}</div>)}</div>
          <div className="p-3 border-t bg-white flex gap-2"><input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask anything..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" /><button onClick={send} className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors"><Send size={16} /></button></div>
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
      <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-blue-200">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/3d-lab" element={<ModelLab />} />
          
          {/* Practice Lab Routes */}
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