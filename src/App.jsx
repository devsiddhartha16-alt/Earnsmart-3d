import { useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  Settings, CalendarDays, History, MoreVertical, MessageCircle, X, Send,
  Sparkles, FileText, CheckCircle, XCircle, Home, BookOpen, FlaskConical
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";

// 🎬 Courses with real YouTube links (change anytime)
const courses = [
  {
    id: "ai-learning",
    title: "AI Learning",
    description: "AI ও Neural Network বেসিক",
    category: "AI",
    videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
  },
  {
    id: "website-making",
    title: "Website Making",
    description: "React দিয়ে ওয়েবসাইট বানাও",
    category: "Web",
    videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
  },
  {
    id: "graphics-basics",
    title: "Graphics Basics",
    description: "Web Design ও Graphics",
    category: "Design",
    videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
  },
  {
    id: "freelancing-foundation",
    title: "Freelancing Foundation",
    description: "ফ্রিল্যান্সিং স্কিল বানাও",
    category: "Free",
    videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
  },
];

const practiceData = {
  "graphics-basics": [
    { question: "RGB মানে?", options: ["Red Green Blue", "Rapid Graphics Boost", "Render Gradient Base"], answer: 0 },
    { question: "Vector tool কোনটা?", options: ["Photoshop", "Illustrator", "Blender"], answer: 1 },
  ],
  "freelancing-foundation": [
    { question: "ফ্রিল্যান্সিং সাইট?", options: ["Fiverr", "GitHub", "Stack Overflow"], answer: 0 },
  ],
};

// ─── 3-dot menu ───
function ThreeDot() {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: <Settings size={18} />, label: "Settings" },
    { icon: <CalendarDays size={18} />, label: "Planning" },
    { icon: <History size={18} />, label: "History" },
  ];
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-gray-200">
        {open ? <X size={20} /> : <MoreVertical size={20} />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-1 z-50">
          {items.map((it) => (
            <button key={it.label} className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100">
              {it.icon} {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ───
function Dashboard() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Earnsmart-3d</h1>
        <ThreeDot />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[["Enrolled Courses", "4"], ["Hours Learned", "12.5"], ["Streak", "7 days"]].map(([t, v]) => (
          <div key={t} className="bg-white border rounded-xl p-4">
            <p className="text-sm text-gray-500">{t}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Course list ───
function CourseList() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Courses</h1>
        <ThreeDot />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Link key={c.id} to={`/course/${c.id}`} className="block bg-white border rounded-xl p-5 hover:shadow-lg">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{c.category}</span>
            <h2 className="text-lg font-bold mt-2">{c.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── 3D model ───
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

// ─── Course detail (Video player + AI note + 3D) ───
function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id) || courses[0];
  const [note, setNote] = useState("");

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{course.title}</h1>
        <ThreeDot />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* 🎬 Video player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <ReactPlayer url={course.videoUrl} controls playing={false} width="100%" height="100%" />
          </div>

          {/* 🤖 AI Note */}
          <div className="bg-white border rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold flex items-center gap-2"><Sparkles size={18} /> AI Note</h3>
              <button
                onClick={() => setNote("📌 Key takeaways:\n1. Introduction\n2. Core concepts\n3. Practical example")}
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg"
              >
                Create Note
              </button>
            </div>
            {note ? (
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg">{note}</pre>
            ) : (
              <p className="text-gray-400 text-sm">"Create Note" চাপো।</p>
            )}
          </div>

          {/* 🌍 3D Model */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold mb-3">🌍 3D Model</h3>
            <div className="w-full h-72 bg-gray-900 rounded-xl overflow-hidden">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={<Html center><span className="text-white text-sm">Loading…</span></Html>}>
                  <Model url="https://modelviewer.dev/shared-assets/models/Astronaut.glb" />
                </Suspense>
                <OrbitControls autoRotate />
              </Canvas>
            </div>
          </div>

          <Link to={`/practice/${course.id}`} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg">
            <FlaskConical size={18} /> Practice Lab
          </Link>
        </div>

        <div className="bg-white border rounded-xl p-4 h-fit">
          <h2 className="text-lg font-bold mb-2">{course.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{course.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText size={16} /> 12 lessons
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Practice Lab ───
function PracticeLab() {
  const { courseId } = useParams();
  const qs = practiceData[courseId] || [];
  const [sel, setSel] = useState({});
  const [sub, setSub] = useState(false);
  const score = qs.reduce((a, q, i) => a + (sel[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Practice Lab</h1>
      {qs.length === 0 && <p className="text-gray-500">এই কোর্সে প্রশ্ন নেই।</p>}
      {qs.map((q, qi) => (
        <div key={qi} className="bg-white border rounded-xl p-4 mb-4">
          <p className="font-medium mb-3">{qi + 1}. {q.question}</p>
          {q.options.map((opt, oi) => {
            const ok = sub && oi === q.answer;
            const bad = sub && sel[qi] === oi && oi !== q.answer;
            return (
              <button
                key={oi}
                onClick={() => !sub && setSel({ ...sel, [qi]: oi })}
                className={`w-full text-left px-3 py-2 rounded-lg border mb-2 flex items-center gap-2 ${
                  ok ? "border-green-500 bg-green-50" : ""
                } ${bad ? "border-red-500 bg-red-50" : ""} ${
                  sel[qi] === oi && !sub ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                {ok && <CheckCircle size={16} className="text-green-600" />}
                {bad && <XCircle size={16} className="text-red-600" />}
                {opt}
              </button>
            );
          })}
        </div>
      ))}
      {qs.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSub(true)}
            disabled={sub || Object.keys(sel).length !== qs.length}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Submit
          </button>
          {sub && <p className="font-semibold">Score: {score}/{qs.length}</p>}
        </div>
      )}
    </div>
  );
}

// ─── AI Chat ───
function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "a", content: "Hi! কী জানতে চাও?" }]);
  const [txt, setTxt] = useState("");
  const send = () => {
    if (!txt.trim()) return;
    setMsgs((m) => [...m, { role: "u", content: txt }, { role: "a", content: "AI: " + txt + " — কোর্সে বিস্তারিত দেখো।" }]);
    setTxt("");
  };
  return (
    <div className="fixed bottom-20 right-4 z-50">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm h-80 bg-white border rounded-xl shadow-xl flex flex-col">
          <div className="flex justify-between p-3 border-b bg-blue-50 rounded-t-xl">
            <span className="font-semibold text-sm">AI Tutor</span>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg ${m.role === "u" ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={txt}
              onChange={(e) => setTxt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask…"
              className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
            />
            <button onClick={send} className="bg-blue-600 text-white p-2 rounded-lg"><Send size={16} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

// ─── Bottom nav (mobile) ───
function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 md:hidden z-40">
      <Link to="/" className="flex flex-col items-center text-xs text-gray-500"><Home size={20} />Home</Link>
      <Link to="/courses" className="flex flex-col items-center text-xs text-gray-500"><BookOpen size={20} />Courses</Link>
      <Link to="/practice/graphics-basics" className="flex flex-col items-center text-xs text-gray-500"><FlaskConical size={20} />Lab</Link>
    </nav>
  );
}

// ─── App root ───
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/practice/:courseId" element={<PracticeLab />} />
        </Routes>
        <Chat />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
