"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ChevronRight,
  BookOpenCheck,
  Compass,
  MessageSquare,
  Send,
  RefreshCw,
  Award,
  Play,
  Lightbulb,
  CheckCircle,
  XCircle,
  HelpCircle,
  Smartphone,
  Monitor,
  Check,
  ChevronLeft,
  Flame,
  Clock,
  Home,
  FileText,
  TrendingUp,
  User,
  UploadCloud,
  Settings,
  Brain,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Code,
  Atom,
  Sliders,
  Eye,
  BookMarked,
  Activity,
  ChevronUp,
  ChevronDown,
  Layers,
  Cpu,
  Coins,
  LogOut
} from "lucide-react";

// Types
interface Concept {
  id: string;
  title: string;
  description: string;
  difficulty: string;
}

interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Lesson {
  conceptId: string;
  title: string;
  content: string;
  analogy: string;
  diagramPrompt: string;
  quiz: Quiz;
}

interface CurriculumResponse {
  intro: string;
  concepts: Concept[];
  firstLesson: Lesson;
}

interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  visualRepresentation?: {
    title: string;
    nodes: Array<{ id: string; label: string; color: string; x: number; y: number }>;
    edges: Array<{ from: string; to: string; label?: string }>;
  };
}

const POPULAR_TOPICS = [
  { name: "Quantum Computing", icon: "⚛️", desc: "Superposition & qubits" },
  { name: "Sourdough Baking", icon: "🍞", desc: "Fermentation & hydration" },
  { name: "Neural Networks", icon: "🧠", desc: "Backpropagation & layers" },
  { name: "Financial Freedom", icon: "📈", desc: "Compound interest & assets" }
];

export default function MasteryPage() {
  // Device Preview Controls
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("desktop");

  // App State Flow
  // "welcome_auth" | "create_account" | "learning_goal" | "learning_preference" | "skill_level" | "daily_goal" | "dashboard" | "topic_selection" | "study_buddy" | "loading" | "classroom"
  const [appState, setAppState] = useState<
    | "welcome_auth"
    | "create_account"
    | "learning_goal"
    | "learning_preference"
    | "skill_level"
    | "daily_goal"
    | "dashboard"
    | "topic_selection"
    | "study_buddy"
    | "loading"
    | "classroom"
  >("welcome_auth");

  // Onboarding States
  const [userName, setUserName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [learningGoal, setLearningGoal] = useState(""); // "skills" | "exams" | "professional" | "growth"
  const [learningPreferences, setLearningPreferences] = useState<string[]>([]); // e.g. ["visual", "practice"]
  const [skillLevel, setSkillLevel] = useState(""); // "beginner" | "intermediate" | "advanced"
  const [dailyGoal, setDailyGoal] = useState(""); // "10m" | "30m" | "1h" | "2h"

  // Topic States
  const [customTopic, setCustomTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Premium Course Creation States
  const [courseCreationStep, setCourseCreationStep] = useState<"input" | "questions" | "generating" | "preview" | "visualization">("input");
  const [creationTopic, setCreationTopic] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [creationGoal, setCreationGoal] = useState("");
  const [creationLevel, setCreationLevel] = useState("");
  const [creationPreference, setCreationPreference] = useState("");
  const [creationTime, setCreationTime] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationSteps, setGenerationSteps] = useState([
    { label: "Understanding your goal", completed: false, active: false },
    { label: "Researching important concepts", completed: false, active: false },
    { label: "Organizing learning path", completed: false, active: false },
    { label: "Creating exercises", completed: false, active: false },
    { label: "Preparing projects", completed: false, active: false },
    { label: "Setting mastery checkpoints", completed: false, active: false }
  ]);

  // Study Buddy States
  const [studyMaterialText, setStudyMaterialText] = useState("");
  const [studyMaterialName, setStudyMaterialName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // AI Teacher Small Conversation widget state on Desktop Right panel
  const [sidebarChatText, setSidebarChatText] = useState("");
  const [sidebarChatMessages, setSidebarChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: "I noticed you struggled with loops yesterday. Would you like a quick review?"
    }
  ]);
  const [isSidebarChatLoading, setIsSidebarChatLoading] = useState(false);

  // API Responses
  const [curriculum, setCurriculum] = useState<Concept[]>([]);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [introText, setIntroText] = useState("");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Classroom Quiz Interaction
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false);

  // Classroom Chat Integration
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Advanced AI Classroom Experience States
  const [teacherStatus, setTeacherStatus] = useState<"explaining" | "listening" | "thinking">("explaining");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [canvasType, setCanvasType] = useState<"programming" | "html" | "science" | "business" | "math">("html");
  const [isExerciseMode, setIsExerciseMode] = useState(false);
  const [exerciseType, setExerciseType] = useState<"drag_drop" | "quiz" | "code_challenge" | "simulation">("drag_drop");
  
  // Exercise interactions
  const [dragDroppedItems, setDragDroppedItems] = useState<string[]>([]);
  const [codeChallengeAnswer, setCodeChallengeAnswer] = useState("");
  const [simulationScore, setSimulationScore] = useState(0);
  const [exerciseFeedback, setExerciseFeedback] = useState<string | null>(null);
  const [exerciseStatus, setExerciseStatus] = useState<"idle" | "success" | "failure">("idle");
  
  // Saved Notes and Roadmap
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [activeSyllabusSheetOpen, setActiveSyllabusSheetOpen] = useState(false);
  const [personalityMessage, setPersonalityMessage] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "speaking">("idle");

  // Visual state simulations
  const [codeExecutionLine, setCodeExecutionLine] = useState(1);
  const [mathStep, setMathStep] = useState(1);
  const [mathSlope, setMathSlope] = useState(1);
  const [mathIntercept, setMathIntercept] = useState(2);
  const [htmlLiveCode, setHtmlLiveCode] = useState("");
  const [physicsMass, setPhysicsMass] = useState(5);
  const [physicsForce, setPhysicsForce] = useState(10);
  const [businessFlowActiveNode, setBusinessFlowActiveNode] = useState("acquisition");

  // Loading Screen Messages
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const loadingMessages = [
    "Mapping conceptual dimensions for your syllabus...",
    "Consulting cognitive frameworks & analogies...",
    "Materializing virtual whiteboard models...",
    "Waking up your dedicated AI Teacher Mentor...",
    "Syllabus finalized. Opening your futuristic private desk..."
  ];

  // Particle System - Set up in useEffect after mount to prevent hydration mismatch and satisfy linter
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  
  useEffect(() => {
    const arr = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 5
    }));
    setTimeout(() => {
      setParticles(arr);
    }, 0);
  }, []);
  
  // Sync canvas type based on selected topic or curriculum updates
  useEffect(() => {
    if (selectedTopic && appState === "classroom") {
      const topicUpper = selectedTopic.toUpperCase();
      const timer = setTimeout(() => {
        setIsExerciseMode(false);
        setExerciseStatus("idle");
        setExerciseFeedback(null);
        setDragDroppedItems([]);
        setCodeChallengeAnswer("");
        setSimulationScore(0);
        setMathStep(1);
        setCodeExecutionLine(1);
        
        if (topicUpper.includes("HTML") || topicUpper.includes("WEB") || topicUpper.includes("TAG") || topicUpper.includes("ELEMENT")) {
          setCanvasType("html");
          setExerciseType("drag_drop");
          setHtmlLiveCode(`<!-- Live Interactive HTML Playground -->
<div class="p-6 bg-slate-900 text-white rounded-2xl shadow-xl text-center border border-indigo-500/30">
  <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Hello World!</h1>
  <p class="text-xs text-slate-300 mt-2">I am learning HTML Foundations interactively.</p>
  <button class="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
    Click to Interact
  </button>
</div>`);
        } else if (topicUpper.includes("PYTHON") || topicUpper.includes("PROGRAMMING") || topicUpper.includes("CODING") || topicUpper.includes("SOFTWARE") || topicUpper.includes("NEURAL") || topicUpper.includes("NETWORK")) {
          setCanvasType("programming");
          setExerciseType("code_challenge");
        } else if (topicUpper.includes("QUANTUM") || topicUpper.includes("PHYSICS") || topicUpper.includes("SCIENCE") || topicUpper.includes("ATOM") || topicUpper.includes("SOURDOUGH") || topicUpper.includes("BAKING")) {
          setCanvasType("science");
          setExerciseType("simulation");
        } else if (topicUpper.includes("BUSINESS") || topicUpper.includes("FINANCIAL") || topicUpper.includes("MARKETING") || topicUpper.includes("MONEY") || topicUpper.includes("FREEDOM")) {
          setCanvasType("business");
          setExerciseType("drag_drop");
        } else {
          setCanvasType("math");
          setExerciseType("quiz");
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedTopic, appState, currentConceptIndex]);

  // Voice Interaction - Speak responses out loud using TTS safely
  const speakAIResponseText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Remove markdown characters for speech
      const cleanText = text.replace(/[*#`_\[\]]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      setVoiceState("speaking");
      setTeacherStatus("explaining");
      
      utterance.onend = () => {
        setVoiceState("idle");
      };
      utterance.onerror = () => {
        setVoiceState("idle");
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis blocked or unsupported", e);
      setVoiceState("idle");
    }
  };

  // Trigger simulated personality comments
  const triggerAIComment = (type: string) => {
    const quotes: Record<string, string> = {
      "another_way": "Let me explain this another way. Think of this concepts like an elastic mesh. If we stretch it, we see patterns form.",
      "visualize": "Great question! Let's translate this abstract concept into our Visual Learning Canvas.",
      "challenge": "I noticed you understand the absolute basics. Let's increase the challenge & unlock deep competence!",
      "real_world": "Let me share a quick real-world example to lock this in. In industry, engineers use this exact flow to deliver high throughput."
    };
    const msg = quotes[type] || "Let's explore this together.";
    setPersonalityMessage(msg);
    setTeacherStatus("explaining");
    speakAIResponseText(msg);
    setTimeout(() => {
      setPersonalityMessage(null);
    }, 6000);
  };

  // Toggling simulated voice mode calling
  const handleToggleVoiceMode = () => {
    if (voiceState === "listening") {
      setVoiceState("idle");
      setTeacherStatus("explaining");
    } else {
      setVoiceState("listening");
      setTeacherStatus("listening");
      
      // Attempt browser Speech Recognition
      if (typeof window !== "undefined") {
        // @ts-ignore
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
          const recognition = new SpeechRec();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = "en-US";
          
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript.trim()) {
              setChatInput(transcript);
              setTimeout(() => {
                handleSendChatMessage();
              }, 600);
            }
          };
          
          recognition.onend = () => {
            if ((voiceState as string) === "listening") {
              setVoiceState("idle");
              setTeacherStatus("explaining");
            }
          };
          
          recognition.start();
        } else {
          // Fallback simulation if SpeechRecognition is blocked or unsupported inside iframe
          setTimeout(() => {
            if ((voiceState as string) === "listening") {
              // Populate with a helpful simulated question
              const simulatedQuestions = [
                "Can you explain this with a real-world analogy?",
                "How does this connect to our previous milestone?",
                "Could you increase the challenge, let's practice!",
                "Show me a visual diagram of how this executes step-by-step."
              ];
              const randomQ = simulatedQuestions[Math.floor(Math.random() * simulatedQuestions.length)];
              setChatInput(randomQ);
              setVoiceState("idle");
              setTeacherStatus("thinking");
            }
          }, 3000);
        }
      }
    }
  };

  // Use a ref for setting loading message index to satisfy strict react-hooks/set-state-in-effect linter
  const setLoadingMessageIndexRef = useRef(setLoadingMessageIndex);
  useEffect(() => {
    setLoadingMessageIndexRef.current = setLoadingMessageIndex;
  }, [setLoadingMessageIndex]);

  // Cycle loading messages when loading
  useEffect(() => {
    if (appState !== "loading") return;
    const interval = setInterval(() => {
      setLoadingMessageIndexRef.current((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [appState]);

  // Custom curriculum API Fetcher
  const handleInitiateLearningAPI = async (topicName: string) => {
    if (!topicName.trim()) return;
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateCurriculum",
          topic: topicName
        })
      });

      if (!res.ok) {
        throw new Error("Failed to load your learning companion.");
      }

      const data: CurriculumResponse = await res.json();
      setIntroText(data.intro);
      setCurriculum(data.concepts);
      setActiveLesson(data.firstLesson);
      setCurrentConceptIndex(0);

      // Initialize Mentor Chat with Intro message
      setChatMessages([
        {
          id: "m1",
          sender: "mentor",
          text: data.intro || `Hello! I am your AI Mentor. Let's master ${topicName} together.`
        }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartCourseCreation = (topic: string) => {
    if (!topic.trim()) return;
    setCreationTopic(topic);
    setCourseCreationStep("questions");
    setCurrentQuestionIndex(0);
    setCreationGoal("");
    setCreationLevel("");
    setCreationPreference("");
    setCreationTime("");
    setGenerationProgress(0);
    setGenerationSteps([
      { label: "Understanding your goal", completed: false, active: true },
      { label: "Researching important concepts", completed: false, active: false },
      { label: "Organizing learning path", completed: false, active: false },
      { label: "Creating exercises", completed: false, active: false },
      { label: "Preparing projects", completed: false, active: false },
      { label: "Setting mastery checkpoints", completed: false, active: false }
    ]);
  };

  const handleTriggerGeneration = () => {
    setCourseCreationStep("generating");
    setGenerationProgress(0);
    
    // Clear existing curriculum so we wait for new one
    setCurriculum([]);

    // Call the API
    handleInitiateLearningAPI(creationTopic);

    // Let's run a sequential checker that transitions every 700ms
    let currentStep = 0;
    const interval = setInterval(() => {
      setGenerationSteps(prev => {
        const next = [...prev];
        if (currentStep < next.length) {
          next[currentStep] = { ...next[currentStep], completed: true, active: false };
          if (currentStep + 1 < next.length) {
            next[currentStep + 1] = { ...next[currentStep + 1], completed: false, active: true };
          }
          currentStep++;
        }
        return next;
      });
      setGenerationProgress(Math.min(((currentStep + 1) / 6) * 100, 100));

      if (currentStep >= 6) {
        clearInterval(interval);
        // Poller to verify curriculum is loaded
        const poll = () => {
          setCurriculum(curr => {
            if (curr && curr.length > 0) {
              setCourseCreationStep("preview");
              setSelectedTopic(creationTopic);
            } else {
              setTimeout(poll, 300);
            }
            return curr;
          });
        };
        setTimeout(poll, 500);
      }
    }, 700);
  };

  // Request the custom curriculum from Gemini server endpoint
  const handleInitiateLearning = async (topicName: string) => {
    handleStartCourseCreation(topicName);
  };

  // Study Buddy upload and text material analyzer using Gemini
  const handleInitiateStudyBuddy = async (textMaterial: string, customName: string) => {
    if (!textMaterial.trim()) return;
    const name = customName.trim() || "My Study Material";
    setSelectedTopic(name);
    setAppState("loading");
    setLoadingMessageIndex(0);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyzeMaterial",
          materialText: textMaterial
        })
      });

      if (!res.ok) {
        throw new Error("Failed to analyze the uploaded material.");
      }

      const data: CurriculumResponse = await res.json();
      setIntroText(data.intro);
      setCurriculum(data.concepts);
      setActiveLesson(data.firstLesson);
      setCurrentConceptIndex(0);

      // Initialize Mentor Chat with Intro message
      setChatMessages([
        {
          id: "m1",
          sender: "mentor",
          text: data.intro || `Hello! I have analyzed your study material: ${name}. Let's master these concepts together.`
        }
      ]);

      setAppState("classroom");
    } catch (err) {
      console.error(err);
      setAppState("study_buddy");
    }
  };

  // AI Teacher Conversation on Right Sidebar (Desktop)
  const handleSendSidebarChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sidebarChatText.trim() || isSidebarChatLoading) return;

    const userText = sidebarChatText;
    setSidebarChatText("");
    setSidebarChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsSidebarChatLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "askMentor",
          topic: selectedTopic || "Personal Mastery and Cognitive Growth",
          question: userText,
          chatHistory: sidebarChatMessages.map(m => ({
            sender: m.sender === "ai" ? "mentor" : "user",
            text: m.text
          }))
        })
      });

      if (!res.ok) throw new Error("Connection lost");
      const data = await res.json();
      setSidebarChatMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setSidebarChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I'm experiencing a brief offline ripple. What other subjects or notes can we explore?" }
      ]);
    } finally {
      setIsSidebarChatLoading(false);
    }
  };

  // Chat conversation with AI Mentor
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !activeLesson) return;

    const userMsgText = chatInput;
    setChatInput("");

    const newMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userMsgText
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "askMentor",
          topic: selectedTopic,
          currentConcept: curriculum[currentConceptIndex]?.title || "",
          chatHistory: chatMessages.slice(-5), // Keep a small sliding context window
          question: userMsgText
        })
      });

      if (!response.ok) {
        throw new Error("Mentor connection timeout");
      }

      const replyData = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          sender: "mentor",
          text: replyData.reply,
          visualRepresentation: replyData.visualRepresentation
        }
      ]);
      speakAIResponseText(replyData.reply);
    } catch (err) {
      console.error(err);
      const errMsg = "Forgive me, my neural circuits flickered momentarily. Could you rephrase your brilliant question?";
      setChatMessages((prev) => [
        ...prev,
        {
          id: `m-error-${Date.now()}`,
          sender: "mentor",
          text: errMsg
        }
      ]);
      speakAIResponseText(errMsg);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Reset quiz states when moving to next lessons
  const handleNextLesson = () => {
    if (currentConceptIndex < curriculum.length - 1) {
      const nextIndex = currentConceptIndex + 1;
      setCurrentConceptIndex(nextIndex);
      setSelectedQuizAnswer(null);
      setHasSubmittedQuiz(false);

      // Generate simulated intermediate lesson for other nodes to preserve user pacing
      // Since firstLesson is from Gemini, subsequent lessons will keep them moving
      if (activeLesson) {
        setActiveLesson({
          ...activeLesson,
          conceptId: curriculum[nextIndex].id,
          title: curriculum[nextIndex].title,
          content: `### Interactive Milestone: ${curriculum[nextIndex].title}\n\nThis concepts covers the core techniques. As your AI Mentor, I am here to guide you directly in the chat below. \n\n*   **Deepen your skills** by asking me specific questions.\n*   **Interactive whiteboard** models will populate our chat feed as you learn!\n*   Ask me to explain any niche term of this topic, and watch me formulate analogies.`,
          analogy: "Think of this progression like upgrading your tools. The basics allow you to carve, but now you are learning to master high-precision angles.",
          quiz: {
            question: "Ready to test your progress on this conceptual milestone?",
            options: [
              "Yes, let's test absolute fundamentals",
              "I want to explore core practical applications",
              "Let's break down intermediate analogies",
              "I feel confident to move to master level"
            ],
            correctIndex: 0,
            explanation: "Amazing! Let's initiate a deep analytical drill in our live Chat section. Type 'Test me' to begin!"
          }
        });
      }
    }
  };

  // Scroll message helper
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased relative selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* Top Floating Control Bar (To view Mobile & Desktop views easily) */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 px-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">Mastery AI Presentation Workspace</span>
          <span className="hidden md:inline-block px-2.5 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full font-medium">
            AI Studio Applet
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceMode === "desktop"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop view
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceMode === "mobile"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile view
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <main className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {deviceMode === "mobile" ? (
            /* ==========================================
               MOBILE VIEW FRAME (390 x 844 px simulated)
               ========================================== */
            <motion.div
              key="mobile-device"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative mx-auto w-[390px] h-[844px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-[10px] border-slate-950 overflow-hidden flex flex-col"
            >
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-40 flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-900 rounded-full absolute right-4"></div>
              </div>

              {/* Mobile Screen Area */}
              <div className="w-full h-full bg-white rounded-[40px] overflow-hidden relative flex flex-col text-slate-800">
                {/* Subtle top particles background */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-purple-50/20 to-white -z-10" />

                {/* Onboarding Screen 1: Welcome Auth */}
                {appState === "welcome_auth" && (
                  <div className="flex-1 flex flex-col justify-between p-6 pt-12 relative overflow-hidden">
                    {/* Floating SVG Particles (Subtle Animation) */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                      {particles.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            position: "absolute",
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            backgroundColor: "#6366f1",
                            borderRadius: "50%",
                            animation: `pulse 3s infinite ease-in-out`
                          }}
                        />
                      ))}
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-center z-10">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                        Mastery AI
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Step 1/5</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                      </div>
                    </div>

                    {/* AI Teacher Illustration */}
                    <div className="flex-1 flex flex-col items-center justify-center my-4 z-10">
                      <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden bg-slate-100 p-1 border-2 border-indigo-100 shadow-xl shadow-indigo-100/30">
                        {/* Glow Halo behind Avatar */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-300 opacity-25 blur-xl animate-spin-slow"></div>
                        <img
                          src="/images/ai_teacher_mentor.jpg"
                          alt="AI Teacher Mentor"
                          className="w-full h-full object-cover rounded-full relative z-10"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Heading & Subtext */}
                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] tracking-tight">
                          <Sparkles className="w-3 h-3 animate-pulse" />
                          Mastery AI Companion
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                          Welcome to your personal AI teacher
                        </h2>
                        <p className="text-xs leading-relaxed text-slate-500 max-w-[280px] mx-auto">
                          Learn new skills, master your study materials, and achieve your goals with an AI tutor that adapts to you.
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto space-y-2.5 z-10">
                      <button
                        onClick={() => setAppState("create_account")}
                        className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
                      >
                        Continue with Google
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <button
                        onClick={() => setAppState("create_account")}
                        className="w-full py-3 px-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        Continue with Email
                      </button>

                      <div className="text-center pt-1">
                        <button
                          onClick={() => setAppState("topic_selection")}
                          className="text-[11px] text-slate-400 hover:text-indigo-600 font-medium transition-colors"
                        >
                          Already have an account? <span className="text-indigo-600 font-bold hover:underline">Sign in</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onboarding Screen 2: Create Account / Info */}
                {appState === "create_account" && (
                  <div className="flex-1 flex flex-col justify-between p-6 pt-12 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Back button */}
                      <button
                        onClick={() => setAppState("welcome_auth")}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 font-bold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      {/* Floating AI Teacher Message */}
                      <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-indigo-200">
                          <img src="/images/ai_teacher_mentor.jpg" alt="Teacher" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block">AI Teacher Mentor</span>
                          <p className="text-[11px] text-indigo-950 font-medium leading-normal">
                            &quot;Great! Let&apos;s personalize your learning experience. First, tell me a little about yourself.&quot;
                          </p>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-3.5 pt-2">
                        {/* Name Field */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            What is your name?
                          </label>
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="e.g. Alex"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 transition-all"
                          />
                        </div>

                        {/* Age range */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Your age range
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {["Under 18", "18-24", "25-34", "35-44", "45+"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeRange(age)}
                                className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold border transition-all ${
                                  ageRange === age
                                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm"
                                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                }`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Button */}
                    <div className="pt-4 mt-auto">
                      <button
                        onClick={() => setAppState("learning_goal")}
                        disabled={!userName.trim() || !ageRange}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1 active:scale-95"
                      >
                        Let&apos;s Set Your Goal
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Onboarding Screen 3: Learning Goal Cards */}
                {appState === "learning_goal" && (
                  <div className="flex-1 flex flex-col justify-between p-5 pt-12 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Back button */}
                      <button
                        onClick={() => setAppState("create_account")}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 font-bold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      {/* AI Teacher bubble */}
                      <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-indigo-200">
                          <img src="/images/ai_teacher_mentor.jpg" alt="Teacher" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block">AI Teacher Mentor</span>
                          <p className="text-[11px] text-indigo-950 font-medium leading-normal">
                            &quot;Every goal requires a unique learning path. What is your primary objective today?&quot;
                          </p>
                        </div>
                      </div>

                      {/* Goal selection options */}
                      <div className="space-y-2 pt-1">
                        {[
                          {
                            id: "skills",
                            title: "Learn new skills",
                            emoji: "🚀",
                            desc: "Master programming, languages, business, science, and anything you want."
                          },
                          {
                            id: "exams",
                            title: "Prepare for exams",
                            emoji: "📚",
                            desc: "Upload your materials and let AI help you study."
                          },
                          {
                            id: "professional",
                            title: "Improve professionally",
                            emoji: "🎯",
                            desc: "Build skills for your career."
                          },
                          {
                            id: "growth",
                            title: "Personal growth",
                            emoji: "🌱",
                            desc: "Learn anything that interests you."
                          }
                        ].map((goal) => (
                          <button
                            key={goal.id}
                            onClick={() => setLearningGoal(goal.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 ${
                              learningGoal === goal.id
                                ? "bg-indigo-50/50 border-indigo-300 text-indigo-950 shadow-sm ring-1 ring-indigo-300/30 scale-[1.01]"
                                : "bg-slate-50/30 border-slate-100 text-slate-700 hover:border-slate-200"
                            }`}
                          >
                            <span className="text-xl shrink-0">{goal.emoji}</span>
                            <div className="text-left">
                              <h4 className="text-xs font-bold text-slate-800">{goal.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{goal.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 mt-auto">
                      <button
                        onClick={() => setAppState("learning_preference")}
                        disabled={!learningGoal}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                      >
                        Next: Learning Style
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Onboarding Screen 4: Learning Preference Setup */}
                {appState === "learning_preference" && (
                  <div className="flex-1 flex flex-col justify-between p-5 pt-12 overflow-y-auto">
                    <div className="space-y-4">
                      <button
                        onClick={() => setAppState("learning_goal")}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 font-bold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-indigo-200">
                          <img src="/images/ai_teacher_mentor.jpg" alt="Teacher" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block">AI Teacher Mentor</span>
                          <p className="text-[11px] text-indigo-950 font-medium leading-normal">
                            &quot;Everyone learns differently. Let me understand how you learn best.&quot;
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          How should your AI teacher teach you?
                        </h3>
                        {[
                          {
                            id: "visual",
                            title: "Visual Learner",
                            emoji: "👁️",
                            desc: "Show me diagrams, animations, and examples."
                          },
                          {
                            id: "practice",
                            title: "Practice Learner",
                            emoji: "✍️",
                            desc: "Give me challenges and exercises."
                          },
                          {
                            id: "conversation",
                            title: "Conversation Learner",
                            emoji: "💬",
                            desc: "Explain ideas through discussion."
                          },
                          {
                            id: "reading",
                            title: "Reading Learner",
                            emoji: "📖",
                            desc: "Give me detailed explanations."
                          }
                        ].map((pref) => {
                          const isSelected = learningPreferences.includes(pref.id);
                          return (
                            <button
                              key={pref.id}
                              onClick={() => {
                                if (isSelected) {
                                  setLearningPreferences(learningPreferences.filter((p) => p !== pref.id));
                                } else {
                                  setLearningPreferences([...learningPreferences, pref.id]);
                                }
                              }}
                              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                                isSelected
                                  ? "bg-indigo-50/50 border-indigo-300 text-indigo-950 shadow-sm ring-1 ring-indigo-300/30"
                                  : "bg-slate-50/30 border-slate-100 text-slate-700 hover:border-slate-200"
                              }`}
                            >
                              <div className="flex gap-3">
                                <span className="text-xl shrink-0">{pref.emoji}</span>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-800">{pref.title}</h4>
                                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{pref.desc}</p>
                                </div>
                              </div>
                              <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 mt-auto">
                      <button
                        onClick={() => setAppState("skill_level")}
                        disabled={learningPreferences.length === 0}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                      >
                        Next: Skill Level
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Onboarding Screen 5: Skill Level */}
                {appState === "skill_level" && (
                  <div className="flex-1 flex flex-col justify-between p-5 pt-12 overflow-y-auto">
                    <div className="space-y-4">
                      <button
                        onClick={() => setAppState("learning_preference")}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 font-bold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-indigo-200">
                          <img src="/images/ai_teacher_mentor.jpg" alt="Teacher" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block">AI Teacher Mentor</span>
                          <p className="text-[11px] text-indigo-950 font-medium leading-normal">
                            &quot;I will help you move from beginner to mastery. Where are we starting from?&quot;
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Where are you starting from?
                        </h3>
                        {[
                          {
                            id: "beginner",
                            title: "Beginner",
                            emoji: "🌱",
                            desc: "I am completely new."
                          },
                          {
                            id: "intermediate",
                            title: "Intermediate",
                            emoji: "🌿",
                            desc: "I know some basics."
                          },
                          {
                            id: "advanced",
                            title: "Advanced",
                            emoji: "🌳",
                            desc: "I want deeper knowledge."
                          }
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            onClick={() => setSkillLevel(lvl.id)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex gap-3 items-center ${
                              skillLevel === lvl.id
                                ? "bg-indigo-50/50 border-indigo-300 text-indigo-950 shadow-sm ring-1 ring-indigo-300/30"
                                : "bg-slate-50/30 border-slate-100 text-slate-700 hover:border-slate-200"
                            }`}
                          >
                            <span className="text-xl shrink-0">{lvl.emoji}</span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{lvl.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{lvl.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 mt-auto">
                      <button
                        onClick={() => setAppState("daily_goal")}
                        disabled={!skillLevel}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
                      >
                        Next: Set Daily Goal
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Onboarding Screen 6: Daily Learning Goal */}
                {appState === "daily_goal" && (
                  <div className="flex-1 flex flex-col justify-between p-5 pt-12 overflow-y-auto">
                    <div className="space-y-4">
                      <button
                        onClick={() => setAppState("skill_level")}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 font-bold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-indigo-200">
                          <img src="/images/ai_teacher_mentor.jpg" alt="Teacher" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block">AI Teacher Mentor</span>
                          <p className="text-[11px] text-indigo-950 font-medium leading-normal">
                            &quot;Nice to meet you, {userName || "scholar"}! I will adapt my teaching style to you. How much time do you want to learn daily?&quot;
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          How much time do you want to learn daily?
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "10m", title: "10 minutes", desc: "Quick bite" },
                            { id: "30m", title: "30 minutes", desc: "Standard block" },
                            { id: "1h", title: "1 hour", desc: "Deep focus" },
                            { id: "2h", title: "2+ hours", desc: "Full immersion" }
                          ].map((goal) => (
                            <button
                              key={goal.id}
                              onClick={() => setDailyGoal(goal.id)}
                              className={`text-left p-3 rounded-xl border transition-all ${
                                dailyGoal === goal.id
                                  ? "bg-indigo-50 border-indigo-300 text-indigo-950 shadow-sm"
                                  : "bg-slate-50/50 border-slate-100 text-slate-700 hover:border-slate-200"
                              }`}
                            >
                              <span className="text-xs font-bold block">{goal.title}</span>
                              <span className="text-[9px] text-slate-400 mt-0.5 block">{goal.desc}</span>
                            </button>
                          ))}
                        </div>

                        {/* Interactive Commitment Journey Visualization */}
                        {dailyGoal && (
                          <div className="mt-3 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-3.5 text-white border border-slate-800 shadow-sm space-y-2">
                            <span className="text-[8px] font-bold text-indigo-400 tracking-wider uppercase block">
                              Commitment Journey Projection
                            </span>
                            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-300 border-b border-slate-800/80 pb-1.5 mb-1.5">
                              <span>Monthly Pacing</span>
                              <span className="text-indigo-300 font-bold">
                                {dailyGoal === "10m" ? "300 minutes" : dailyGoal === "30m" ? "900 minutes" : dailyGoal === "1h" ? "1,800 minutes" : "3,600+ minutes"}
                              </span>
                            </div>

                            {/* visual progress dots track */}
                            <div className="flex justify-between items-center relative py-1">
                              <div className="absolute left-0 right-0 h-[2px] bg-slate-800 -z-10" />
                              <div className="absolute left-0 h-[2px] bg-indigo-500 -z-10" style={{
                                width: dailyGoal === "10m" ? "25%" : dailyGoal === "30m" ? "50%" : dailyGoal === "1h" ? "75%" : "100%"
                              }} />
                              
                              <div className="flex flex-col items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-950" />
                                <span className="text-[7px] text-slate-400 mt-1">Start</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                  ["30m", "1h", "2h"].includes(dailyGoal) ? "bg-indigo-500 ring-4 ring-indigo-950" : "bg-slate-800"
                                }`} />
                                <span className="text-[7px] text-slate-400 mt-1">7 Days</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                  ["1h", "2h"].includes(dailyGoal) ? "bg-indigo-500 ring-4 ring-indigo-950" : "bg-slate-800"
                                }`} />
                                <span className="text-[7px] text-slate-400 mt-1">15 Days</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                  dailyGoal === "2h" ? "bg-indigo-500 ring-4 ring-indigo-950" : "bg-slate-800"
                                }`} />
                                <span className="text-[7px] text-slate-400 mt-1">30 Days</span>
                              </div>
                            </div>

                            <p className="text-[9px] text-slate-400 leading-relaxed italic pt-1 text-center">
                              {dailyGoal === "10m" && "Optimal balance for quick daily habit formation."}
                              {dailyGoal === "30m" && "Recommended for steady integration and skill fluency."}
                              {dailyGoal === "1h" && "Excellent intensity for deep concept absorption."}
                              {dailyGoal === "2h" && "Elite pace. Rapid path to subject mastery."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 mt-auto">
                      <button
                        onClick={() => setAppState("dashboard")}
                        disabled={!dailyGoal}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        Complete Setup & Launch Teacher
                      </button>
                    </div>
                  </div>
                )}

                {appState === "dashboard" && (
                  /* Mobile Dashboard screen */
                  <div className="flex-1 flex flex-col p-5 pt-12 overflow-y-auto pb-20 bg-white">
                    {/* Greeting Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                      <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Hi, {userName || "Alex"} 👋</h1>
                        <p className="text-[10px] text-slate-500 mt-0.5">Let&apos;s master something amazing today.</p>
                      </div>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        AI Active
                      </span>
                    </div>

                    {/* Quick Core Navigation Cards */}
                    <div className="space-y-4">
                      {/* Card 1: Classroom */}
                      <div className="bg-gradient-to-br from-indigo-50/40 to-indigo-50/10 border border-indigo-100 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">🎓 Classroom</span>
                          <span className="text-[8px] text-indigo-500 font-bold bg-indigo-50/50 px-1.5 py-0.5 rounded">AUTO-SYLLABUS</span>
                        </div>
                        <h3 className="font-extrabold text-slate-950 text-xs">Syllabus-Based Masterclasses</h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Enter any topic and draft a full custom visual course curriculum instantly.
                        </p>
                        <button
                          onClick={() => setAppState("topic_selection")}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition-all"
                        >
                          Open AI Classroom
                        </button>
                      </div>

                      {/* Card 2: Study Buddy */}
                      <div className="bg-gradient-to-br from-purple-50/40 to-purple-50/10 border border-purple-100 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">📚 Study Buddy</span>
                          <span className="text-[8px] text-purple-500 font-bold bg-purple-50/50 px-1.5 py-0.5 rounded">DOC CHAT</span>
                        </div>
                        <h3 className="font-extrabold text-slate-950 text-xs">Upload & Study Material</h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Drag, paste or upload outlines. AI translates them into summaries, analogies, and active drills.
                        </p>
                        <button
                          onClick={() => setAppState("study_buddy")}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] rounded-lg transition-all"
                        >
                          Open Study Buddy
                        </button>
                      </div>

                      {/* Card 3: Active progress / Last Lesson */}
                      <div className="border border-slate-100 rounded-xl p-4 bg-white space-y-2 shadow-sm">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Last Active Lesson</span>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-800 text-xs truncate">{selectedTopic || "Python Programming"}</h4>
                            <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                              {curriculum.length > 0 ? `Stage ${currentConceptIndex + 1}: ${activeLesson?.title || "Fundamentals"}` : "Ready to start your first masterclass!"}
                            </p>
                          </div>
                          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="16" cy="16" r="13" stroke="#f1f5f9" strokeWidth="2.5" fill="transparent" />
                              <circle cx="16" cy="16" r="13" stroke="#4f46e5" strokeWidth="2.5" fill="transparent" strokeDasharray="81" strokeDashoffset={selectedTopic ? "28" : "81"} />
                            </svg>
                            <span className="absolute text-[8px] font-bold text-slate-700">{selectedTopic ? "65%" : "0%"}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (selectedTopic && curriculum.length > 0) {
                              setAppState("classroom");
                            } else {
                              handleInitiateLearning("Python Programming");
                            }
                          }}
                          className="w-full py-2 bg-slate-900 hover:bg-black text-white text-[10px] font-bold rounded-lg transition-all"
                        >
                          Resume Lesson
                        </button>
                      </div>

                      {/* Card 4: AI Smart Suggestion */}
                      <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
                        <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest block">AI Smart recommendation</span>
                        <p className="text-[10px] font-bold text-slate-800 leading-snug">
                          💡 Next: <span className="text-indigo-600 font-extrabold">Object-Oriented Programming</span>
                        </p>
                        <p className="text-[9px] text-slate-500 leading-normal">
                          Mapping classes & inheritance will maximize your fluency progression.
                        </p>
                        <button
                          onClick={() => handleInitiateLearning("Object Oriented Programming")}
                          className="w-full py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-lg transition-all"
                        >
                          Begin Topic
                        </button>
                      </div>

                      {/* Stats Column on Mobile Dashboard */}
                      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-2">
                        <div className="flex flex-col items-center text-center p-2 bg-amber-50/50 rounded-lg">
                          <span className="text-base">🔥</span>
                          <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1">STREAK</span>
                          <span className="text-[9px] font-extrabold text-slate-800 mt-0.5">7 Days</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-2 bg-indigo-50/50 rounded-lg">
                          <span className="text-base">🧠</span>
                          <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1">SKILLS</span>
                          <span className="text-[9px] font-extrabold text-slate-800 mt-0.5">12 Nodes</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-2 bg-emerald-50/50 rounded-lg">
                          <span className="text-base">⏱</span>
                          <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-1">VOLUME</span>
                          <span className="text-[9px] font-extrabold text-slate-800 mt-0.5">15 Hours</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {appState === "study_buddy" && (
                  /* Mobile Study Buddy screen */
                  <div className="flex-1 flex flex-col p-5 pt-12 overflow-y-auto pb-20 bg-white">
                    <div className="mb-5">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Study Buddy</h2>
                      <p className="text-xs text-slate-500 mt-1">Let AI digest your personal materials & build custom explanations.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Mobile File Upload Block */}
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          const files = e.dataTransfer.files;
                          if (files && files.length > 0) {
                            const file = files[0];
                            setStudyMaterialName(file.name);
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setStudyMaterialText(evt.target.result as string);
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col justify-center ${
                          isDragOver ? "border-purple-500 bg-purple-50/40" : "border-slate-200 bg-slate-50/30"
                        }`}
                      >
                        <UploadCloud className="w-8 h-8 text-purple-500 mx-auto animate-bounce mb-2" />
                        <h3 className="font-bold text-slate-800 text-xs">Drag & Drop document</h3>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">
                          PDF, TXT, or syllabus outlines
                        </p>
                        <input
                          type="file"
                          id="file-upload-mobile-pane"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const file = files[0];
                              setStudyMaterialName(file.name);
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  setStudyMaterialText(evt.target.result as string);
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                        />
                        <label
                          htmlFor="file-upload-mobile-pane"
                          className="mt-3 mx-auto px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-[10px] font-bold text-purple-600 rounded-lg cursor-pointer transition-all"
                        >
                          Choose File
                        </label>
                      </div>

                      {/* Text inputs */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Name of Study Deck
                          </label>
                          <input
                            type="text"
                            value={studyMaterialName}
                            onChange={(e) => setStudyMaterialName(e.target.value)}
                            placeholder="e.g. History Chapter 2, Chemistry Notes"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Paste notes or textbooks
                          </label>
                          <textarea
                            rows={5}
                            value={studyMaterialText}
                            onChange={(e) => setStudyMaterialText(e.target.value)}
                            placeholder="Paste your learning text materials here..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white leading-relaxed transition-all"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleInitiateStudyBuddy(studyMaterialText, studyMaterialName)}
                        disabled={!studyMaterialText.trim()}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-purple-600/10 transition-all flex items-center justify-center gap-1.5 active:scale-95 mt-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Analyze Material & Study
                      </button>
                    </div>
                  </div>
                )}

                {appState === "topic_selection" && (
                  /* Mobile Course Creation Experience */
                  <div className="flex-1 flex flex-col p-5 pt-8 overflow-y-auto pb-24 bg-slate-50/50">
                    
                    {/* BACK BUTTON AND PROGRESS STEP EYEBRACE */}
                    <div className="flex items-center justify-between mb-5">
                      <button
                        onClick={() => {
                          if (courseCreationStep === "questions") {
                            if (currentQuestionIndex > 0) {
                              setCurrentQuestionIndex(currentQuestionIndex - 1);
                            } else {
                              setCourseCreationStep("input");
                            }
                          } else if (courseCreationStep === "preview") {
                            setCourseCreationStep("questions");
                            setCurrentQuestionIndex(3);
                          } else if (courseCreationStep === "visualization") {
                            setCourseCreationStep("preview");
                          } else {
                            setAppState("dashboard");
                          }
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      {courseCreationStep === "questions" && (
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-full">
                          Step {currentQuestionIndex + 1} of 4
                        </span>
                      )}
                      {courseCreationStep === "generating" && (
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 border border-purple-100/60 px-2.5 py-1 rounded-full animate-pulse">
                          Generating Roadmap
                        </span>
                      )}
                      {courseCreationStep === "preview" && (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100/60 px-2.5 py-1 rounded-full">
                          Preview Ready
                        </span>
                      )}
                      {courseCreationStep === "visualization" && (
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100/60 px-2.5 py-1 rounded-full">
                          Syllabus Tree
                        </span>
                      )}
                    </div>

                    {/* STEP 1: TOPIC INPUT */}
                    {courseCreationStep === "input" && (
                      <div className="space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Create Your Learning Journey</span>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">What do you want to master?</h2>
                            <p className="text-xs text-slate-500">Your AI teacher will draft an elite multi-stage learning syllabus instantly.</p>
                          </div>

                          {/* Conversational input card */}
                          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4 relative overflow-hidden focus-within:border-indigo-400 transition-all">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Conversational AI Core
                              </span>
                              
                              {/* Voice Simulator Button */}
                              <button
                                onClick={() => {
                                  if (voiceState === "idle") {
                                    setVoiceState("listening");
                                    // Simulated delay for speaking
                                    setTimeout(() => {
                                      setCustomTopic("Teach me Python programming");
                                      setVoiceState("speaking");
                                      setTimeout(() => {
                                        setVoiceState("idle");
                                      }, 1500);
                                    }, 2000);
                                  } else {
                                    setVoiceState("idle");
                                  }
                                }}
                                className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-[10px] font-bold ${
                                  voiceState === "listening"
                                    ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                                    : voiceState === "speaking"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {voiceState === "listening" ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                    Listening...
                                  </>
                                ) : voiceState === "speaking" ? (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                                    Speaking...
                                  </>
                                ) : (
                                  <>
                                    <Mic className="w-3.5 h-3.5 text-slate-400" />
                                    Voice Input
                                  </>
                                )}
                              </button>
                            </div>

                            <textarea
                              rows={3}
                              value={customTopic}
                              onChange={(e) => setCustomTopic(e.target.value)}
                              placeholder='e.g., "Teach me Python programming" or "I want to learn digital marketing"...'
                              className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed resize-none"
                            />

                            <div className="text-[9px] text-slate-400 italic">
                              💡 Oxford cognitive alignment engine is active & ready.
                            </div>
                          </div>

                          {/* Quick Suggestion Chips */}
                          <div className="space-y-2.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inspiration Chips</span>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { text: "Teach me Python", topic: "Python Programming" },
                                { text: "Digital Marketing", topic: "Digital Marketing" },
                                { text: "Sourdough Baking", topic: "Sourdough Baking" },
                                { text: "Quantum Computing", topic: "Quantum Computing" }
                              ].map((chip) => (
                                <button
                                  key={chip.text}
                                  onClick={() => {
                                    setCustomTopic(chip.topic);
                                    handleStartCourseCreation(chip.topic);
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-100 text-[11px] font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all flex items-center gap-1 shadow-sm"
                                >
                                  ✨ {chip.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartCourseCreation(customTopic)}
                          disabled={!customTopic.trim()}
                          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          Customize Journey <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* STEP 2: PERSONALIZATION QUESTIONS */}
                    {courseCreationStep === "questions" && (
                      <div className="space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-5">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Personalize Your Course</span>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                              {currentQuestionIndex === 0 && "Why do you want to learn this?"}
                              {currentQuestionIndex === 1 && "What is your current level?"}
                              {currentQuestionIndex === 2 && "How do you prefer learning?"}
                              {currentQuestionIndex === 3 && "Daily study commitment?"}
                            </h2>
                          </div>

                          {/* Options Grid */}
                          <div className="space-y-2.5">
                            {currentQuestionIndex === 0 && [
                              { key: "Career advancement", desc: "Gain professional skills for job market fluency", icon: "💼" },
                              { key: "Academic excellence", desc: "Deepen structured textbook knowledge & exams", icon: "🎓" },
                              { key: "Personal interest", desc: "Pure curiosity-driven learning", icon: "🌱" },
                              { key: "Building a project", desc: "Learn explicitly to manufacture a product", icon: "🛠️" }
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  setCreationGoal(opt.key);
                                  setCurrentQuestionIndex(1);
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 bg-white ${
                                  creationGoal === opt.key ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/5" : "border-slate-100 hover:border-slate-200"
                                }`}
                              >
                                <span className="text-2xl">{opt.icon}</span>
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-800">{opt.key}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                                </div>
                              </button>
                            ))}

                            {currentQuestionIndex === 1 && [
                              { key: "Beginner", desc: "Zero coding or domain knowledge", icon: "⭐️" },
                              { key: "Intermediate", desc: "Familiar with terminology & basic loops", icon: "⚡️" },
                              { key: "Advanced", desc: "Ready to study architecture & optimization", icon: "🔬" }
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  setCreationLevel(opt.key);
                                  setCurrentQuestionIndex(2);
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 bg-white ${
                                  creationLevel === opt.key ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/5" : "border-slate-100 hover:border-slate-200"
                                }`}
                              >
                                <span className="text-2xl">{opt.icon}</span>
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-800">{opt.key}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                                </div>
                              </button>
                            ))}

                            {currentQuestionIndex === 2 && [
                              { key: "Visual whiteboard maps", desc: "Syllabi illustrated with dynamic schemas", icon: "🎨" },
                              { key: "Practice drills & projects", desc: "Interactive compilers & simulator challenges", icon: "💻" },
                              { key: "Conversational discussion", desc: "Q&A dialog with your mentor teacher", icon: "💬" },
                              { key: "Comprehensive text guides", desc: "Analogies & detailed breakdown guides", icon: "📖" }
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  setCreationPreference(opt.key);
                                  setCurrentQuestionIndex(3);
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 bg-white ${
                                  creationPreference === opt.key ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/5" : "border-slate-100 hover:border-slate-200"
                                }`}
                              >
                                <span className="text-2xl">{opt.icon}</span>
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-800">{opt.key}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                                </div>
                              </button>
                            ))}

                            {currentQuestionIndex === 3 && [
                              { key: "10 mins/day", desc: "Micro learning habit", icon: "⏱️" },
                              { key: "30 mins/day", desc: "Standard balanced integration", icon: "⏳" },
                              { key: "1 hour/day", desc: "Immersive high absorption", icon: "🚀" }
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  setCreationTime(opt.key);
                                  setTimeout(() => {
                                    handleTriggerGeneration();
                                  }, 300);
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 bg-white ${
                                  creationTime === opt.key ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/5" : "border-slate-100 hover:border-slate-200"
                                }`}
                              >
                                <span className="text-2xl">{opt.icon}</span>
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-800">{opt.key}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Pagination indicator dots */}
                        <div className="flex justify-center gap-1.5 py-2">
                          {[0, 1, 2, 3].map((dot) => (
                            <div
                              key={dot}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                dot === currentQuestionIndex ? "w-4 bg-indigo-600" : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: GENERATION ANIMATION */}
                    {courseCreationStep === "generating" && (
                      <div className="space-y-6 flex-1 flex flex-col justify-center py-6 text-center">
                        <div className="space-y-2">
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-purple-100/60"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-indigo-500 animate-spin"></div>
                            <Brain className="w-6 h-6 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight mt-3">Creating your personalized roadmap...</h3>
                          <p className="text-xs text-slate-500">Synthesizing {creationTopic} mastery track based on cognitive models.</p>
                        </div>

                        {/* Checklist */}
                        <div className="max-w-xs mx-auto w-full text-left bg-white border border-slate-100/60 rounded-2xl p-4 shadow-sm space-y-3">
                          {generationSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              {step.completed ? (
                                <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                              ) : step.active ? (
                                <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center text-[10px]"></span>
                              )}
                              <span className={`font-semibold ${step.completed ? "text-slate-800" : step.active ? "text-indigo-600 font-bold" : "text-slate-400"}`}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="max-w-xs mx-auto w-full space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Syllabus compile</span>
                            <span>{Math.round(generationProgress)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                              style={{ width: `${generationProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: GENERATED COURSE PREVIEW */}
                    {courseCreationStep === "preview" && (
                      <div className="space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-5">
                          <div className="text-center">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100/60 px-2.5 py-1 rounded-full inline-block">Syllabus Synthesis Complete</span>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-2">{creationTopic} Mastery</h2>
                            <p className="text-xs text-slate-500 leading-normal mt-1.5 px-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                              From your first line of code to building professional applications, personalized for your goal of <strong>{creationGoal || "Skills Acquisition"}</strong>.
                            </p>
                          </div>

                          {/* Dynamic Roadmap List from API Curriculum */}
                          <div className="space-y-3.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Proposed Learning Path</span>
                            
                            {curriculum && curriculum.length > 0 ? (
                              <div className="space-y-3">
                                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Level 1: Foundations</span>
                                    <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.2 rounded">Stage 1</span>
                                  </div>
                                  <h4 className="text-xs font-black text-slate-800">{curriculum[0]?.title}</h4>
                                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{curriculum[0]?.description}</p>
                                </div>

                                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Level 2: Intermediate</span>
                                    <span className="text-[9px] bg-purple-50 text-purple-600 font-bold px-1.5 py-0.2 rounded">Stage 2</span>
                                  </div>
                                  <h4 className="text-xs font-black text-slate-800">{curriculum[1]?.title || "Concept Expansion"}</h4>
                                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{curriculum[1]?.description || "Branching out into practical applications & structure"}</p>
                                </div>

                                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Level 3: Professional Mastery</span>
                                    <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.2 rounded">Stage 3-4</span>
                                  </div>
                                  <h4 className="text-xs font-black text-slate-800">{curriculum[2]?.title || "Advanced Capstone & Mastery"}</h4>
                                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{curriculum[2]?.description || "Setting up full real-world scenarios & drills"}</p>
                                </div>
                              </div>
                            ) : (
                              // Fallback
                              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
                                <p className="text-xs text-slate-400">Loading curriculum roadmap details...</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setCourseCreationStep("visualization")}
                          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          View Interactive Skill Tree <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* STEP 5: INTERACTIVE SKILL TREE VISUALIZATION */}
                    {courseCreationStep === "visualization" && (
                      <div className="space-y-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-5">
                          <div className="text-center">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100/60 px-2.5 py-1 rounded-full inline-block">Interactive Skill Map</span>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-2">{creationTopic} Mastery</h2>
                            <p className="text-[11px] text-slate-500 mt-1">Completed skills glow. Locked skills appear ahead.</p>
                          </div>

                          {/* Skill Tree Diagram */}
                          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                            {/* Stars glow background */}
                            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />

                            <div className="relative w-full flex flex-col items-center space-y-6 z-10">
                              
                              {/* Root node: Topic Mastery */}
                              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs text-center shadow-lg shadow-indigo-600/20 ring-2 ring-indigo-400 border border-indigo-500/50 relative">
                                {creationTopic} Mastery
                                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                              </div>

                              {/* Vertical Line Connector */}
                              <div className="relative w-full h-8 flex justify-center">
                                <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-50 to-slate-800" />
                                <div className="absolute top-4 left-1/4 right-1/4 h-0.5 bg-slate-800" />
                              </div>

                              {/* Children Branches */}
                              <div className="grid grid-cols-3 gap-3 w-full">
                                
                                {/* Branch 1: Basics (Glowing checkmarked node) */}
                                <div className="flex flex-col items-center">
                                  <div className="bg-slate-900 border-2 border-emerald-500 shadow-md shadow-emerald-500/10 rounded-xl p-2.5 text-center w-full relative group cursor-pointer active:scale-95 transition-all">
                                    <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest block mb-0.5">Foundations</span>
                                    <span className="text-[10px] font-black text-slate-100 block truncate">{curriculum[0]?.title || "Basics"}</span>
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                                  </div>
                                  <span className="text-[8px] text-emerald-400 font-bold mt-1.5 uppercase tracking-wider block">Glow Active</span>
                                </div>

                                {/* Branch 2: Logic (Semi-translucent white/slate, unlocked node) */}
                                <div className="flex flex-col items-center">
                                  <div className="bg-slate-900 border-2 border-indigo-500 shadow-md shadow-indigo-500/10 rounded-xl p-2.5 text-center w-full relative group cursor-pointer active:scale-95 transition-all">
                                    <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-0.5">Core logic</span>
                                    <span className="text-[10px] font-black text-slate-100 block truncate">{curriculum[1]?.title || "Logic"}</span>
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">⚡️</span>
                                  </div>
                                  <span className="text-[8px] text-indigo-400 font-bold mt-1.5 uppercase tracking-wider block">Unlocked</span>
                                </div>

                                {/* Branch 3: Projects (Locked node) */}
                                <div className="flex flex-col items-center opacity-50">
                                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center w-full relative">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Capstone</span>
                                    <span className="text-[10px] font-bold text-slate-400 block truncate">{curriculum[2]?.title || "Projects"}</span>
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center text-[8px] font-bold">🔒</span>
                                  </div>
                                  <span className="text-[8px] text-slate-500 font-medium mt-1.5 uppercase tracking-wider block">Locked</span>
                                </div>

                              </div>

                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setAppState("classroom");
                          }}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Sparkles className="w-4 h-4 animate-pulse" /> Launch Course Sandbox
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {appState === "loading" && (
                  /* Mobile Loading Transition */
                  <div className="flex-1 flex flex-col justify-between p-6 pt-16 items-center text-center bg-gradient-to-b from-indigo-500 to-indigo-950 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>

                    <div className="my-auto space-y-6">
                      {/* Spinning core */}
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-indigo-300 animate-spin"></div>
                        <BookOpen className="w-8 h-8 text-indigo-200" />
                      </div>

                      <div className="space-y-2 px-4">
                        <h3 className="text-lg font-bold tracking-tight">Assembling AI Teacher</h3>
                        <p className="text-xs text-indigo-200 min-h-[40px] leading-relaxed italic animate-pulse">
                          &quot;{loadingMessages[loadingMessageIndex]}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold">
                      Powered by Gemini 3.6-flash
                    </div>
                  </div>
                )}

                {appState === "classroom" && (
                  /* ========================================================
                     ADVANCED MOBILE CLASSROOM (390 x 844 px responsive container)
                     ======================================================== */
                  <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 relative overflow-hidden font-sans select-none">
                    
                    {/* 1. TOP STATUS BAR (Sleek Transparent HUD) */}
                    <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md z-20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAppState("topic_selection")}
                          className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="text-[8px] text-indigo-400 uppercase tracking-widest font-extrabold">Active Classroom</p>
                          <h3 className="text-xs font-bold text-slate-100 truncate max-w-[150px]">{selectedTopic}</h3>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveSyllabusSheetOpen(true)}
                        className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <Layers className="w-3 h-3" />
                        Stage {currentConceptIndex + 1}/4
                      </button>
                    </div>

                    {/* 2. DYNAMIC HUD NOTIFICATIONS (For Personality & Interactions) */}
                    <AnimatePresence>
                      {personalityMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          className="absolute top-14 left-4 right-4 bg-indigo-950/95 border border-indigo-500/40 rounded-xl p-3 shadow-lg shadow-indigo-950/50 backdrop-blur-lg z-30 text-xs text-indigo-100 flex items-start gap-2.5"
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-indigo-400/50">
                            <img src="/images/ai_teacher_mentor.jpg" alt="AI" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-indigo-300 uppercase block tracking-wider">Teacher Mentor</span>
                            <p className="leading-relaxed mt-0.5">{personalityMessage}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 3. CORE INTERACTIVE HUB */}
                    <div className="flex-1 flex flex-col overflow-y-auto pb-24 scrollbar-none space-y-4">
                      
                      {/* A. AI TEACHER AVATAR AREA */}
                      <div className="relative p-4 flex flex-col items-center bg-gradient-to-b from-indigo-950/40 to-transparent">
                        
                        {/* Interactive floating elements reflecting concept tags */}
                        <div className="absolute top-4 left-6 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[8px] text-indigo-300 uppercase tracking-widest animate-pulse">
                          {canvasType.toUpperCase()} MODE
                        </div>
                        <div className="absolute top-4 right-6 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '3s' }} /> LIVE
                        </div>

                        {/* Interactive Tutor Frame */}
                        <div className="relative mt-2">
                          {/* Pulse Wave background when speaking/thinking */}
                          <div className="absolute inset-0 -m-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
                          
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/60 shadow-lg shadow-indigo-500/20 z-10">
                            {isCameraOn ? (
                              <img 
                                src="/images/ai_teacher_mentor.jpg" 
                                alt="AI Teacher" 
                                className={`w-full h-full object-cover transition-all ${
                                  teacherStatus === "thinking" ? "brightness-50 grayscale-50" : "scale-105"
                                }`} 
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500">
                                <Cpu className="w-8 h-8 animate-spin text-indigo-500" style={{ animationDuration: '4s' }} />
                                <span className="text-[7px] uppercase font-bold tracking-widest mt-1 text-slate-400">Holo Mode</span>
                              </div>
                            )}

                            {/* Simulated Voice wave equalizer overlay */}
                            {voiceState === "speaking" && (
                              <div className="absolute bottom-1 left-0 right-0 flex justify-center items-end gap-0.5 h-6 bg-gradient-to-t from-slate-950/80 to-transparent pb-1 px-3">
                                {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, idx) => (
                                  <motion.div
                                    key={idx}
                                    animate={{ height: [`${h*15}%`, `${h*30}%`, `${h*15}%`] }}
                                    transition={{ repeat: Infinity, duration: 0.6 + idx * 0.1, ease: "easeInOut" }}
                                    className="w-1 bg-indigo-400 rounded-full"
                                    style={{ height: `${h * 15}%` }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Floating status label */}
                          <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-800 px-3 py-0.5 rounded-full z-20 text-[8px] font-bold tracking-widest shadow-md flex items-center gap-1.5 whitespace-nowrap">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              voiceState === "listening" ? "bg-red-500 animate-ping" :
                              teacherStatus === "thinking" ? "bg-amber-400 animate-bounce" : "bg-indigo-400"
                            }`} />
                            {voiceState === "listening" ? "LISTENING..." :
                             teacherStatus === "thinking" ? "THINKING..." : "TEACHING"}
                          </div>
                        </div>

                        {/* Interactive quick response controller */}
                        <div className="mt-6 flex gap-1.5 justify-center">
                          <button
                            onClick={() => triggerAIComment("another_way")}
                            className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 hover:border-slate-700 active:scale-95 transition-transform font-medium"
                          >
                            🔄 Simplify
                          </button>
                          <button
                            onClick={() => triggerAIComment("visualize")}
                            className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 hover:border-slate-700 active:scale-95 transition-transform font-medium"
                          >
                            🎨 Visual Map
                          </button>
                          <button
                            onClick={() => triggerAIComment("real_world")}
                            className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 hover:border-slate-700 active:scale-95 transition-transform font-medium"
                          >
                            🌍 Analogy
                          </button>
                          <button
                            onClick={() => setIsExerciseMode(!isExerciseMode)}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold active:scale-95 transition-all flex items-center gap-1 ${
                              isExerciseMode 
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10" 
                                : "bg-slate-900/60 border-slate-800 text-indigo-400"
                            }`}
                          >
                            ✏️ {isExerciseMode ? "Review" : "Practice"}
                          </button>
                        </div>
                      </div>

                      {/* B. DETAILED EXPLANATION PANEL */}
                      {!isExerciseMode && (
                        <div className="px-4">
                          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-md backdrop-blur-sm">
                            <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
                              <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-extrabold">Active Milestone Explanation</span>
                              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Concept {currentConceptIndex + 1}/4</span>
                            </div>
                            <h2 className="text-sm font-extrabold text-slate-100 leading-snug">{activeLesson?.title}</h2>
                            <div className="text-[11px] text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap">
                              {activeLesson?.content}
                            </div>

                            {/* Analogical Bridge panel */}
                            {activeLesson?.analogy && (
                              <div className="mt-3 p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                                  <Lightbulb className="w-3.5 h-3.5" /> Conceptual Analogy
                                </span>
                                <p className="text-[10px] text-indigo-200/90 leading-relaxed italic">
                                  &quot;{activeLesson.analogy}&quot;
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* C. VISUAL LEARNING CANVAS (THE GREATEST SCREEN ASSETS) */}
                      <div className="px-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-indigo-950/10 relative">
                          
                          {/* Canvas Title Header with Toggles */}
                          <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800/60 flex items-center justify-between">
                            <span className="text-[9px] font-extrabold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                              <Atom className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> 
                              {isExerciseMode ? "Practice Challenge Simulator" : "Interactive Concept Canvas"}
                            </span>
                            
                            {/* Manual Type Swappers */}
                            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                              {[
                                { type: "html", icon: "🌐" },
                                { type: "programming", icon: "💻" },
                                { type: "science", icon: "⚛️" },
                                { type: "business", icon: "📈" },
                                { type: "math", icon: "🧮" }
                              ].map((c) => (
                                <button
                                  key={c.type}
                                  onClick={() => {
                                    setCanvasType(c.type as any);
                                    setIsExerciseMode(false);
                                  }}
                                  className={`p-1 text-[10px] rounded transition-all ${
                                    canvasType === c.type ? "bg-slate-800 border border-slate-700 text-white" : "opacity-40"
                                  }`}
                                  title={c.type}
                                >
                                  {c.icon}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* CANVAS SIMULATION VIEWPORT */}
                          <div className="p-4 min-h-[220px] bg-slate-950/50 flex flex-col justify-between">
                            
                            {/* IF EXERCISE MODE: Render Exercise Challenges */}
                            {isExerciseMode ? (
                              <div className="space-y-4">
                                
                                {/* 1. HTML Drag-Drop Challenge */}
                                {canvasType === "html" && (
                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block">HTML Arrangement Task</span>
                                      <h4 className="text-[11px] font-bold text-slate-300">Arrange tags to structure an active Call-to-Action module:</h4>
                                    </div>

                                    {/* drag slots */}
                                    <div className="grid grid-cols-4 gap-2 py-1">
                                      {["<button>", "Buy Now", "</button>", "class=\"btn\""].map((item, idx) => {
                                        const isDropped = dragDroppedItems.includes(item);
                                        return (
                                          <button
                                            key={idx}
                                            disabled={isDropped}
                                            onClick={() => setDragDroppedItems(prev => [...prev, item])}
                                            className={`p-2 rounded-lg text-[9px] font-mono border text-center transition-all ${
                                              isDropped 
                                                ? "bg-slate-950 border-slate-800 text-slate-600 scale-95" 
                                                : "bg-indigo-950/40 border-indigo-900/60 text-indigo-300 hover:border-indigo-500"
                                            }`}
                                          >
                                            {item}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Dropped result bar */}
                                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 min-h-[44px] flex flex-wrap gap-1.5 items-center">
                                      {dragDroppedItems.length === 0 ? (
                                        <span className="text-[9px] text-slate-500 italic">Click tags above in proper order...</span>
                                      ) : (
                                        dragDroppedItems.map((item, idx) => (
                                          <span 
                                            key={idx} 
                                            onClick={() => setDragDroppedItems(prev => prev.filter(x => x !== item))}
                                            className="px-2 py-1 rounded bg-indigo-900/80 text-indigo-200 border border-indigo-700/50 font-mono text-[9px] cursor-pointer"
                                          >
                                            {item}
                                          </span>
                                        ))
                                      )}
                                    </div>

                                    {/* Action validation buttons */}
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          if (dragDroppedItems[0] === "<button>" && dragDroppedItems[3] === "</button>") {
                                            setExerciseStatus("success");
                                            setExerciseFeedback("Oxford Synthesis Complete: Excellent structuring! Dynamic tags nested safely.");
                                          } else {
                                            setExerciseStatus("failure");
                                            setExerciseFeedback("Structure Error: Remember to open blocks before filling content.");
                                          }
                                        }}
                                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-[10px] font-bold text-white transition-colors"
                                      >
                                        Compile Arrangement
                                      </button>
                                      <button
                                        onClick={() => { setDragDroppedItems([]); setExerciseStatus("idle"); setExerciseFeedback(null); }}
                                        className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-400 hover:text-white"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* 2. Code Challenge (Programming) */}
                                {canvasType === "programming" && (
                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Fill-In-The-Blank Challenge</span>
                                      <h4 className="text-[11px] font-bold text-slate-300">Complete the loop to capture matching pairs:</h4>
                                    </div>

                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[10px] text-indigo-300 leading-normal">
                                      <p>items = [&quot;Apple&quot;, &quot;Berry&quot;, &quot;Peach&quot;]</p>
                                      <p>filtered = []</p>
                                      <p>for item in items:</p>
                                      <p className="pl-4">if len(item) == <span className="bg-indigo-900 border border-indigo-500/50 px-2 py-0.5 rounded text-white text-[10px] font-bold">{codeChallengeAnswer || "___"}</span>:</p>
                                      <p className="pl-8">filtered.append(item)</p>
                                      <p className="text-slate-500"># goal: filtered is [&quot;Berry&quot;, &quot;Peach&quot;]</p>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                      {["3", "4", "5", "len"].map((ans) => (
                                        <button
                                          key={ans}
                                          onClick={() => setCodeChallengeAnswer(ans)}
                                          className={`py-1.5 rounded-lg font-mono text-[10px] border text-center transition-all ${
                                            codeChallengeAnswer === ans 
                                              ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20" 
                                              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                                          }`}
                                        >
                                          {ans}
                                        </button>
                                      ))}
                                    </div>

                                    <button
                                      onClick={() => {
                                        if (codeChallengeAnswer === "5") {
                                          setExerciseStatus("success");
                                          setExerciseFeedback("Success! Berry & Peach both have a length of 5. Compiled perfectly.");
                                        } else {
                                          setExerciseStatus("failure");
                                          setExerciseFeedback("Array mismatch: 'Berry' has length 5, while 'Apple' has length 5? No, Apple is 5, but filtered is Berry & Peach.");
                                        }
                                      }}
                                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-[10px] font-bold text-white transition-colors"
                                    >
                                      Run Interpreter
                                    </button>
                                  </div>
                                )}

                                {/* 3. Quantum Excite Challenge (Science) */}
                                {canvasType === "science" && (
                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block">Quantum Jump Targets</span>
                                      <h4 className="text-[11px] font-bold text-slate-300">Tune energy level (n) to achieve Orbit Level 3:</h4>
                                    </div>

                                    {/* Slider */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                                        <span>Ground State (n=1)</span>
                                        <span className="text-indigo-400 font-bold">Target State (n=3)</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="1"
                                        value={physicsMass}
                                        onChange={(e) => setPhysicsMass(parseInt(e.target.value))}
                                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                      />
                                      <div className="flex justify-between text-[10px] font-bold px-1 font-mono">
                                        <span className={physicsMass === 1 ? "text-indigo-400" : "text-slate-600"}>n = 1</span>
                                        <span className={physicsMass === 2 ? "text-indigo-400" : "text-slate-600"}>n = 2</span>
                                        <span className={physicsMass === 3 ? "text-indigo-400" : "text-slate-600"}>n = 3</span>
                                      </div>
                                    </div>

                                    {/* Excite Button */}
                                    <button
                                      onClick={() => {
                                        if (physicsMass === 3) {
                                          setExerciseStatus("success");
                                          setExerciseFeedback("Target Met! Quantum Jump complete. Emitted a High Energy Wavelength Photon (Blue).");
                                        } else {
                                          setExerciseStatus("failure");
                                          setExerciseFeedback("Insufficient Energy: The photon didn't satisfy the orbit energy gap.");
                                        }
                                      }}
                                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-[10px] font-bold text-white transition-colors"
                                    >
                                      Fire Laser Beam 💥
                                    </button>
                                  </div>
                                )}

                                {/* 4. Flow Loop Challenge (Business) */}
                                {canvasType === "business" && (
                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block">Value Chain Structuring</span>
                                      <h4 className="text-[11px] font-bold text-slate-300">Identify the stage where Customer Retention loops are optimized:</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { id: "acq", label: "Acquisition (Ads/SEO)" },
                                        { id: "act", label: "Activation (Sign-up onboarding)" },
                                        { id: "ret", label: "Retention (Repeat usage loops)" },
                                        { id: "ref", label: "Referral (Word of mouth / shares)" }
                                      ].map((node) => (
                                        <button
                                          key={node.id}
                                          onClick={() => setBusinessFlowActiveNode(node.id)}
                                          className={`p-2 rounded-xl text-left border transition-all ${
                                            businessFlowActiveNode === node.id 
                                              ? "bg-indigo-600 border-indigo-500 text-white" 
                                              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                                          }`}
                                        >
                                          <span className="text-[10px] font-bold block">{node.label}</span>
                                        </button>
                                      ))}
                                    </div>

                                    <button
                                      onClick={() => {
                                        if (businessFlowActiveNode === "ret") {
                                          setExerciseStatus("success");
                                          setExerciseFeedback("Excellent choice! Retention blocks preserve cohorts and sustain growth factors.");
                                        } else {
                                          setExerciseStatus("failure");
                                          setExerciseFeedback("Incorrect focus: Acquisition drives new traffic but does not sustain cohort repeat loops.");
                                        }
                                      }}
                                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-[10px] font-bold text-white transition-colors"
                                    >
                                      Submit Loop Theory
                                    </button>
                                  </div>
                                )}

                                {/* 5. Geometry Plot challenge (Mathematics) */}
                                {canvasType === "math" && (
                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block">Slope Matching task</span>
                                      <h4 className="text-[11px] font-bold text-slate-300">Set Slope (m) to achieve a positive steep angle (m = 2):</h4>
                                    </div>

                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                                        <span>Flat (m=0)</span>
                                        <span className="text-indigo-400 font-bold">Steep Positive (m=2)</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="-2"
                                        max="2"
                                        step="1"
                                        value={mathSlope}
                                        onChange={(e) => setMathSlope(parseInt(e.target.value))}
                                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                      />
                                      <div className="flex justify-between text-[10px] font-bold px-1 font-mono">
                                        <span className={mathSlope === -2 ? "text-indigo-400" : "text-slate-600"}>m = -2</span>
                                        <span className={mathSlope === 0 ? "text-indigo-400" : "text-slate-600"}>m = 0</span>
                                        <span className={mathSlope === 2 ? "text-indigo-400" : "text-slate-600"}>m = 2</span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => {
                                        if (mathSlope === 2) {
                                          setExerciseStatus("success");
                                          setExerciseFeedback("Slope matched! Equation is y = 2x + c. Visually plotted successfully.");
                                        } else {
                                          setExerciseStatus("failure");
                                          setExerciseFeedback("Slope angle is either negative or flat. Steepen the slope value to 2.");
                                        }
                                      }}
                                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-[10px] font-bold text-white transition-colors"
                                    >
                                      Plot Line
                                    </button>
                                  </div>
                                )}

                                {/* Exercise Feedback overlay */}
                                {exerciseFeedback && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-2.5 rounded-xl border text-[10px] leading-relaxed ${
                                      exerciseStatus === "success" 
                                        ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" 
                                        : "bg-red-950/40 border-red-500/30 text-red-300"
                                    }`}
                                  >
                                    <p className="font-bold mb-0.5">{exerciseStatus === "success" ? "🎉 Mastered!" : "🤔 Review Needed"}</p>
                                    <p>{exerciseFeedback}</p>
                                    
                                    {exerciseStatus === "success" && (
                                      <button
                                        onClick={handleNextLesson}
                                        className="mt-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-[9px] text-indigo-400 font-bold active:scale-95 transition-transform"
                                      >
                                        Unlock Next Milestone →
                                      </button>
                                    )}
                                  </motion.div>
                                )}

                              </div>
                            ) : (
                              /* STANDARD LEARN MODE: Render the 5 Beautiful Simulators */
                              <div className="space-y-4">
                                
                                {/* 1. HTML Canvas */}
                                {canvasType === "html" && (
                                  <div className="space-y-3">
                                    <span className="text-[8px] font-mono text-indigo-300 block">LIVE WEBPAGE RENDER VIEW</span>
                                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                                      <div dangerouslySetInnerHTML={{ __html: htmlLiveCode }} />
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                      <button 
                                        onClick={() => setHtmlLiveCode(`<!-- Customized Live Frame -->
<div class="p-6 bg-purple-950 text-white rounded-2xl shadow-xl text-center border-2 border-purple-500/50">
  <h1 class="text-2xl font-bold text-purple-200">Interactive Purple</h1>
  <p class="text-xs text-purple-300 mt-2">Nesting structures, CSS styling parameters changed dynamically!</p>
</div>`)}
                                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-300 rounded-lg active:scale-95 transition-transform"
                                      >
                                        🎨 Apply Purple CSS
                                      </button>
                                      <button 
                                        onClick={() => setHtmlLiveCode(`<!-- Styled Alert Block -->
<div class="p-5 bg-indigo-950 text-white rounded-xl border border-indigo-400 flex items-center gap-3">
  <span class="text-2xl">⚡</span>
  <div class="text-left">
    <h3 class="font-bold text-xs text-indigo-200">Dynamic Alert</h3>
    <p class="text-[9px] text-slate-300">Live rendered card node compiled from instructions.</p>
  </div>
</div>`)}
                                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-300 rounded-lg active:scale-95 transition-transform"
                                      >
                                        ⚡ Build Flex Alert
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* 2. Programming Canvas */}
                                {canvasType === "programming" && (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-mono text-indigo-300">PYTHON COMPILER SIMULATOR (LOOP TRACING)</span>
                                      <button
                                        onClick={() => {
                                          if (codeExecutionLine < 5) {
                                            setCodeExecutionLine(prev => prev + 1);
                                          } else {
                                            setCodeExecutionLine(1);
                                          }
                                        }}
                                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[9px] font-bold flex items-center gap-1 active:scale-95 transition-all"
                                      >
                                        <Play className="w-2.5 h-2.5" /> Step Execution
                                      </button>
                                    </div>
                                    <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-3 font-mono text-[10px] space-y-1 relative">
                                      {[
                                        "1: numbers = [1, 2, 3]",
                                        "2: squared = []",
                                        "3: for n in numbers:",
                                        "4:     squared.append(n ** 2)",
                                        "5: print(squared)  # output console"
                                      ].map((line, idx) => (
                                        <div 
                                          key={idx} 
                                          className={`py-0.5 px-1.5 rounded transition-colors flex items-center justify-between ${
                                            codeExecutionLine === idx + 1 ? "bg-indigo-950/60 text-indigo-300 border-l-2 border-indigo-500 font-bold" : "text-slate-400"
                                          }`}
                                        >
                                          <span>{line}</span>
                                          {codeExecutionLine === idx + 1 && (
                                            <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 px-1 py-0.2 rounded text-indigo-400 font-sans">Active</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* Console output */}
                                    <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-[9px] font-mono text-emerald-400">
                                      <span className="text-slate-500 mr-2">Console:</span>
                                      {codeExecutionLine >= 1 && <span className="mr-1.5">Loaded numbers.</span>}
                                      {codeExecutionLine >= 2 && <span className="mr-1.5">initialized squared.</span>}
                                      {codeExecutionLine >= 3 && <span className="mr-1.5">Iterating loop...</span>}
                                      {codeExecutionLine >= 4 && <span className="mr-1.5">n={codeExecutionLine-2}, squaring.</span>}
                                      {codeExecutionLine >= 5 && <span className="text-white block font-bold mt-1">Output: [1, 4, 9]</span>}
                                    </div>
                                  </div>
                                )}

                                {/* 3. Science Canvas */}
                                {canvasType === "science" && (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-mono text-indigo-300">BOHR QUANTUM ATOMIC SHELL SIMULATOR</span>
                                      <button 
                                        onClick={() => {
                                          setPhysicsMass(3);
                                          speakAIResponseText("Exciting electron to energy shell 3! Photon released.");
                                        }}
                                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-[9px] text-white font-bold"
                                      >
                                        Excite (n=3)
                                      </button>
                                    </div>

                                    {/* Graphic Bohr Model SVG */}
                                    <div className="relative w-full h-[120px] bg-slate-900 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden">
                                      <svg className="w-full h-full" viewBox="0 0 200 120">
                                        {/* Core nucleus */}
                                        <circle cx="100" cy="60" r="12" fill="#4338ca" className="animate-pulse" />
                                        <circle cx="100" cy="60" r="4" fill="#818cf8" />
                                        
                                        {/* Orbits */}
                                        <circle cx="100" cy="60" r="22" fill="none" stroke="#334155" strokeWidth="1" />
                                        <circle cx="100" cy="60" r="38" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                                        <circle cx="100" cy="60" r="54" fill="none" stroke="#334155" strokeWidth="1" />

                                        {/* Orbit state labels */}
                                        <text x="100" y="32" fill="#475569" fontSize="6" textAnchor="middle" fontFamily="monospace">n=1</text>
                                        <text x="100" y="16" fill="#475569" fontSize="6" textAnchor="middle" fontFamily="monospace">n=2</text>
                                        <text x="100" y="2" fill="#475569" fontSize="6" textAnchor="middle" fontFamily="monospace">n=3</text>

                                        {/* Floating electron orbiting */}
                                        {physicsMass === 1 && (
                                          <circle cx="100" cy="38" r="4" fill="#a855f7" className="animate-bounce" />
                                        )}
                                        {physicsMass === 2 && (
                                          <circle cx="100" cy="22" r="4" fill="#e9d5ff" />
                                        )}
                                        {physicsMass === 3 && (
                                          <g>
                                            <circle cx="100" cy="6" r="4.5" fill="#38bdf8" className="animate-pulse" />
                                            {/* Released photon particle wave line */}
                                            <path d="M 100 6 Q 120 16, 140 6 T 180 6" fill="none" stroke="#06b6d4" strokeWidth="1" className="animate-pulse" />
                                          </g>
                                        )}
                                      </svg>

                                      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] font-mono text-slate-500">
                                        <span>Ground: {physicsMass === 1 ? "Active" : "Stable"}</span>
                                        <span className="text-indigo-400">Target State: Shell 3</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 4. Business Canvas */}
                                {canvasType === "business" && (
                                  <div className="space-y-3">
                                    <span className="text-[8px] font-mono text-indigo-300 block">CUSTOMER RETENTION COHORT value chain LOOP</span>
                                    
                                    {/* node block timeline */}
                                    <div className="grid grid-cols-5 gap-1 pt-1">
                                      {[
                                        { id: "acquisition", label: "Acquire", emoji: "📢" },
                                        { id: "activation", label: "Activate", emoji: "⚡" },
                                        { id: "retention", label: "Retain", emoji: "🔄" },
                                        { id: "referral", label: "Refer", emoji: "🗣" },
                                        { id: "revenue", label: "Revenue", emoji: "💰" }
                                      ].map((node) => (
                                        <button
                                          key={node.id}
                                          onClick={() => setBusinessFlowActiveNode(node.id)}
                                          className={`p-1.5 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${
                                            businessFlowActiveNode === node.id 
                                              ? "bg-indigo-950 border-indigo-500 text-indigo-300 scale-105 shadow-md" 
                                              : "bg-slate-900/60 border-slate-800 text-slate-500"
                                          }`}
                                        >
                                          <span className="text-xs">{node.emoji}</span>
                                          <span className="text-[7px] font-bold mt-1 truncate max-w-full">{node.label}</span>
                                        </button>
                                      ))}
                                    </div>

                                    {/* details panel */}
                                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                                      {businessFlowActiveNode === "acquisition" && (
                                        <>
                                          <h4 className="text-[10px] font-bold text-slate-300">Stage 1: Acquisition (Traffic Engines)</h4>
                                          <p className="text-[9px] text-slate-400 leading-normal">Optimizing SEO and performance marketing to scale incoming user pipelines securely.</p>
                                        </>
                                      )}
                                      {businessFlowActiveNode === "activation" && (
                                        <>
                                          <h4 className="text-[10px] font-bold text-slate-300">Stage 2: Activation (Aha! Moment)</h4>
                                          <p className="text-[9px] text-slate-400 leading-normal">Driving prompt value identification inside onboarding structures to settle retention churn.</p>
                                        </>
                                      )}
                                      {businessFlowActiveNode === "retention" && (
                                        <>
                                          <h4 className="text-[10px] font-bold text-slate-300">Stage 3: Cohort Retention (Repeat Loop)</h4>
                                          <p className="text-[9px] text-slate-400 leading-normal font-semibold text-indigo-300">The core catalyst! Sustaining active usage with custom notifications & progress unlocks.</p>
                                        </>
                                      )}
                                      {businessFlowActiveNode === "referral" && (
                                        <>
                                          <h4 className="text-[10px] font-bold text-slate-300">Stage 4: Referral Viral Loop</h4>
                                          <p className="text-[9px] text-slate-400 leading-normal">Enabling word-of-mouth coefficient factors to slash customer acquisition cost (CAC).</p>
                                        </>
                                      )}
                                      {businessFlowActiveNode === "revenue" && (
                                        <>
                                          <h4 className="text-[10px] font-bold text-slate-300">Stage 5: Compound Revenue Value</h4>
                                          <p className="text-[9px] text-slate-400 leading-normal">Unlocking premium value subscriptions, stabilizing high customer lifetime value (LTV).</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* 5. Mathematics Plotter Canvas */}
                                {canvasType === "math" && (
                                  <div className="space-y-3">
                                    <span className="text-[8px] font-mono text-indigo-300 block">GEOMETRIC LINE PLOTTER (y = mx + c)</span>
                                    
                                    {/* Sliders */}
                                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-slate-400">
                                          <span>Slope (m)</span>
                                          <span className="text-indigo-400">{mathSlope}</span>
                                        </div>
                                        <input 
                                          type="range" min="-3" max="3" step="1" 
                                          value={mathSlope} onChange={(e) => setMathSlope(parseInt(e.target.value))} 
                                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-slate-400">
                                          <span>Y-Intercept (c)</span>
                                          <span className="text-indigo-400">{mathIntercept}</span>
                                        </div>
                                        <input 
                                          type="range" min="-5" max="5" step="1" 
                                          value={mathIntercept} onChange={(e) => setMathIntercept(parseInt(e.target.value))} 
                                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                      </div>
                                    </div>

                                    {/* Graphic geometry coordinate grid */}
                                    <div className="relative w-full h-[120px] bg-slate-900 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden">
                                      <svg className="w-full h-full" viewBox="0 0 200 120">
                                        {/* Grid lines */}
                                        <line x1="0" y1="60" x2="200" y2="60" stroke="#1e293b" strokeWidth="1" />
                                        <line x1="100" y1="0" x2="100" y2="120" stroke="#1e293b" strokeWidth="1" />
                                        
                                        {/* Linear regression plot line based on sliders */}
                                        <line 
                                          x1="20" 
                                          y1={`${60 - (mathSlope * -40 + (mathIntercept * 5))}`} 
                                          x2="180" 
                                          y2={`${60 - (mathSlope * 40 + (mathIntercept * 5))}`} 
                                          stroke="#6366f1" 
                                          strokeWidth="2.5" 
                                          className="transition-all duration-300" 
                                        />
                                        
                                        {/* Equation card text inside SVG */}
                                        <rect x="5" y="5" width="75" height="20" rx="4" fill="#020617" opacity="0.8" />
                                        <text x="10" y="17" fill="#818cf8" fontSize="8" fontFamily="monospace">y = {mathSlope}x + ({mathIntercept})</text>
                                      </svg>
                                    </div>
                                  </div>
                                )}

                              </div>
                            )}

                          </div>
                        </div>
                      </div>

                    </div>

                    {/* 4. CHAT HISTORY DRAWER (Collapsible Inline Mentor) */}
                    <div className="absolute bottom-16 left-0 right-0 max-h-[140px] overflow-y-auto px-4 pointer-events-none">
                      <div className="space-y-1.5 flex flex-col justify-end h-full">
                        {chatMessages.slice(-2).map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-2.5 rounded-xl text-[10px] leading-relaxed border shadow-md backdrop-blur-md max-w-[85%] pointer-events-auto ${
                              msg.sender === "user"
                                ? "bg-indigo-600/90 border-indigo-500 text-white ml-auto rounded-br-none"
                                : "bg-slate-900/90 border-slate-800 text-slate-300 mr-auto rounded-bl-none"
                            }`}
                          >
                            <span className="font-bold text-[8px] uppercase tracking-wider block mb-0.5">
                              {msg.sender === "user" ? "You" : "AI Teacher"}
                            </span>
                            <p>{msg.text.slice(0, 110)}{msg.text.length > 110 ? "..." : ""}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5. FLOATING HUD CONTROLLER BAR (Bottom Navigation Control Deck) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-900 backdrop-blur-md py-2.5 px-4 flex gap-2 items-center z-20 shadow-xl">
                      
                      {/* Active Voice simulation mic */}
                      <button
                        onClick={handleToggleVoiceMode}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all relative ${
                          voiceState === "listening"
                            ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 animate-pulse"
                            : voiceState === "speaking"
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                            : "bg-slate-900 border-slate-800 text-indigo-400 hover:border-slate-700"
                        }`}
                      >
                        {voiceState === "listening" ? (
                          <Mic className="w-5 h-5" />
                        ) : (
                          <MicOff className="w-5 h-5 text-slate-400" />
                        )}
                        {/* pulsing mic indicator rings */}
                        {voiceState === "listening" && (
                          <span className="absolute inset-0 rounded-xl border border-red-500 animate-ping opacity-60" />
                        )}
                      </button>

                      {/* Input container */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (chatInput.trim()) {
                            handleSendChatMessage();
                          }
                        }} 
                        className="flex-1 flex gap-2"
                      >
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={voiceState === "listening" ? "Listening naturally..." : "Ask teacher, e.g. 'Simplify this'"}
                          className="flex-1 bg-slate-900/80 border border-slate-800 text-[11px] text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || isChatLoading}
                          className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/10 shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>

                    {/* 6. EXPANDABLE LESSON ROADMAP TIMELINE (Mobile Bottom Sheet) */}
                    <AnimatePresence>
                      {activeSyllabusSheetOpen && (
                        <>
                          {/* Backdrop backdrop-blur */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveSyllabusSheetOpen(false)}
                            className="absolute inset-0 bg-black z-40"
                          />

                          {/* Sliding Drawer */}
                          <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 z-50 shadow-2xl max-h-[70%] overflow-y-auto flex flex-col space-y-4"
                          >
                            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto" onClick={() => setActiveSyllabusSheetOpen(false)} />
                            
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <div>
                                <span className="text-[8px] font-extrabold text-indigo-400 uppercase tracking-widest block">Syllabus Journey Tracker</span>
                                <h4 className="text-xs font-extrabold text-white">Milestones to Topic Mastery</h4>
                              </div>
                              <button 
                                onClick={() => setActiveSyllabusSheetOpen(false)}
                                className="text-[10px] text-slate-400 font-bold hover:text-white"
                              >
                                Close
                              </button>
                            </div>

                            {/* Roadmap Timeline */}
                            <div className="space-y-4 py-2">
                              {curriculum.map((c, i) => (
                                <button
                                  key={c.id}
                                  disabled={i > currentConceptIndex}
                                  onClick={() => {
                                    setCurrentConceptIndex(i);
                                    setSelectedQuizAnswer(null);
                                    setHasSubmittedQuiz(false);
                                    setActiveSyllabusSheetOpen(false);
                                  }}
                                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                                    i === currentConceptIndex
                                      ? "bg-indigo-950/60 border-indigo-500/80 text-white"
                                      : i < currentConceptIndex
                                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                                      : "opacity-40 bg-slate-950/20 border-slate-900 text-slate-500 cursor-not-allowed"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {i < currentConceptIndex ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-400">
                                        {i + 1}
                                      </span>
                                    )}
                                    <div className="text-left">
                                      <h5 className="text-[11px] font-bold">{c.title}</h5>
                                      <p className="text-[9px] text-slate-400">{c.difficulty} Complexity</p>
                                    </div>
                                  </div>
                                  {i === currentConceptIndex && (
                                    <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                  </div>
                )}

                {/* 7. UNIVERSAL MOBILE BOTTOM TAB BAR */}
                {["dashboard", "topic_selection", "study_buddy"].includes(appState) && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-4 z-30 shadow-lg">
                    <button
                      onClick={() => setAppState("dashboard")}
                      className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                        appState === "dashboard" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                      <span className="text-[9px] font-bold mt-1">Dashboard</span>
                    </button>

                    <button
                      onClick={() => setAppState("topic_selection")}
                      className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                        appState === "topic_selection" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span className="text-[9px] font-bold mt-1">Classroom</span>
                    </button>

                    <button
                      onClick={() => setAppState("study_buddy")}
                      className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                        appState === "study_buddy" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-[9px] font-bold mt-1">Study Buddy</span>
                    </button>
                    
                    {selectedTopic && curriculum.length > 0 && (
                      <button
                        onClick={() => setAppState("classroom")}
                        className="flex flex-col items-center justify-center flex-1 h-full text-emerald-600 animate-pulse"
                      >
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-[9px] font-bold mt-1">Active</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* ==========================================
               DESKTOP VIEW (1440 x 900 px simulated/scaled)
               ========================================== */
            <motion.div
              key="desktop-workspace"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-6xl bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[640px]"
            >
              <AnimatePresence mode="wait">
                {["welcome_auth", "create_account", "learning_goal", "learning_preference", "skill_level", "daily_goal", "loading"].includes(appState) ? (
                  /* Desktop Split Splash Screen, Onboarding, & Loading */
                  <React.Fragment>
                    {["welcome_auth", "create_account", "learning_goal", "learning_preference", "skill_level", "daily_goal"].includes(appState) ? (
                      /* Desktop Split Onboarding Experience */
                      <React.Fragment>
                        {/* Left Panel: Onboarding Steps */}
                        <div className="w-[320px] p-10 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between shrink-0 relative border-r border-slate-800">
                          {/* Brand Logo */}
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-600/30">
                              M
                            </div>
                            <div>
                              <span className="font-extrabold text-white tracking-tight text-sm block">Mastery AI</span>
                              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Personal AI Teacher</span>
                            </div>
                          </div>

                          {/* Onboarding Steps Tree */}
                          <div className="my-auto py-10 space-y-8">
                            {[
                              {
                                step: 1,
                                title: "Account",
                                desc: "Personal profile setup",
                                states: ["welcome_auth", "create_account"]
                              },
                              {
                                step: 2,
                                title: "Goals",
                                desc: "Set learning outcomes",
                                states: ["learning_goal"]
                              },
                              {
                                step: 3,
                                title: "Learning Style",
                                desc: "Cognitive type match",
                                states: ["learning_preference"]
                              },
                              {
                                step: 4,
                                title: "Preferences",
                                desc: "Time & pace configuration",
                                states: ["skill_level", "daily_goal"]
                              }
                            ].map((s) => {
                              const isActive = s.states.includes(appState);
                              const isCompleted = (() => {
                                const allStates = [
                                  "welcome_auth",
                                  "create_account",
                                  "learning_goal",
                                  "learning_preference",
                                  "skill_level",
                                  "daily_goal",
                                  "topic_selection"
                                ];
                                const currentIdx = allStates.indexOf(appState);
                                const minStateIdx = Math.min(...s.states.map(state => allStates.indexOf(state)));
                                return currentIdx > minStateIdx && !isActive;
                              })();

                              return (
                                <div key={s.step} className="flex gap-4 items-start relative group">
                                  {/* Step indicator circle */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                                      isActive
                                        ? "bg-indigo-600 border-indigo-500 text-white ring-4 ring-indigo-500/20"
                                        : isCompleted
                                        ? "bg-emerald-600 border-emerald-500 text-white"
                                        : "bg-slate-900 border-slate-800 text-slate-400"
                                    }`}>
                                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                                    </div>
                                    {s.step < 4 && (
                                      <div className={`w-[2px] h-10 my-1 transition-colors ${
                                        isCompleted ? "bg-emerald-600" : "bg-slate-800"
                                      }`} />
                                    )}
                                  </div>

                                  {/* Step Info */}
                                  <div className="space-y-0.5">
                                    <span className={`text-[9px] uppercase tracking-widest font-bold block transition-colors ${
                                      isActive ? "text-indigo-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                                    }`}>
                                      Step {s.step}
                                    </span>
                                    <h3 className={`text-xs font-bold block transition-colors ${
                                      isActive || isCompleted ? "text-white" : "text-slate-400"
                                    }`}>
                                      {s.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                      {s.desc}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Left footer status */}
                          <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Secure Session Active
                          </div>
                        </div>

                        {/* Right Panel: Content Card */}
                        <div className="flex-1 bg-slate-50 p-10 md:p-14 flex flex-col justify-between overflow-y-auto">
                          <div className="max-w-lg mx-auto w-full space-y-6">
                            {/* AI Teacher Header Greeting */}
                            <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                              <div className="absolute inset-0 bg-indigo-50/10 -z-10" />
                              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-indigo-100 shadow-md">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-300 opacity-20 blur-sm"></div>
                                <img src="/images/ai_teacher_mentor.jpg" alt="AI Mentor" className="w-full h-full object-cover relative z-10" />
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">AI Teacher Mentor</span>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                  {appState === "welcome_auth" && "Welcome to Mastery AI. I am your expert tutor, ready to help you learn anything. Let's configure your profile!"}
                                  {appState === "create_account" && "Let's configure your basics to calibrate our communication pace!"}
                                  {appState === "learning_goal" && `Awesome, ${userName || "scholar"}! Choosing a main goal helps me design the most relevant syllabus modules.`}
                                  {appState === "learning_preference" && "Everyone absorbs knowledge uniquely. How should I explain complex conceptual blocks to you?"}
                                  {appState === "skill_level" && "I scale my explanations automatically. Where should we start our curriculum milestones?"}
                                  {appState === "daily_goal" && "Excellent. Last step: setting a daily focus block helps build strong cognitive habits!"}
                                </p>
                              </div>
                            </div>

                            {/* Interactive Screen content container */}
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                              {/* Welcome Auth */}
                              {appState === "welcome_auth" && (
                                <div className="space-y-5">
                                  <div className="space-y-2">
                                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                      Welcome to Mastery AI
                                    </h2>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                      Access a personal expert teacher anytime, tailor-made for your exact goals. Set up your classroom to begin.
                                    </p>
                                  </div>

                                  <div className="space-y-2.5">
                                    <button
                                      onClick={() => setAppState("create_account")}
                                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                      Continue with Google <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setAppState("create_account")}
                                      className="w-full py-3.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all"
                                    >
                                      Continue with Email
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Create Account */}
                              {appState === "create_account" && (
                                <div className="space-y-5">
                                  <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create your account</h2>
                                    <p className="text-xs text-slate-400">Let me get to know you</p>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="space-y-1.5">
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        What should I call you?
                                      </label>
                                      <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Your Age range
                                      </label>
                                      <div className="grid grid-cols-5 gap-2">
                                        {["Under 18", "18-24", "25-34", "35-44", "45+"].map((age) => (
                                          <button
                                            key={age}
                                            type="button"
                                            onClick={() => setAgeRange(age)}
                                            className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold border transition-all ${
                                              ageRange === age
                                                ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm"
                                                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                            }`}
                                          >
                                            {age}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-2 flex gap-3">
                                    <button
                                      onClick={() => setAppState("welcome_auth")}
                                      className="py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                                    >
                                      Back
                                    </button>
                                    <button
                                      onClick={() => setAppState("learning_goal")}
                                      disabled={!userName.trim() || !ageRange}
                                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                                    >
                                      Next: Choose Goal <ArrowRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Learning Goal selection cards */}
                              {appState === "learning_goal" && (
                                <div className="space-y-5">
                                  <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Choose your learning path</h2>
                                    <p className="text-xs text-slate-400">Select one core objective to target</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    {[
                                      {
                                        id: "skills",
                                        title: "Learn new skills",
                                        emoji: "🚀",
                                        desc: "Master programming, coding languages, business, physics, etc."
                                      },
                                      {
                                        id: "exams",
                                        title: "Prepare for exams",
                                        emoji: "📚",
                                        desc: "Upload textbook PDFs, slides, documents for custom testing."
                                      },
                                      {
                                        id: "professional",
                                        title: "Improve professionally",
                                        emoji: "🎯",
                                        desc: "Up-skill for executive careers and industrial credentials."
                                      },
                                      {
                                        id: "growth",
                                        title: "Personal growth",
                                        emoji: "🌱",
                                        desc: "Learn creative arts, philosophy, or any intellectual hobby."
                                      }
                                    ].map((goal) => (
                                      <button
                                        key={goal.id}
                                        onClick={() => setLearningGoal(goal.id)}
                                        className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-[120px] ${
                                          learningGoal === goal.id
                                            ? "bg-indigo-50/50 border-indigo-300 text-indigo-950 shadow-sm ring-1 ring-indigo-300/30 scale-[1.02]"
                                            : "bg-slate-50/40 border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-white"
                                        }`}
                                      >
                                        <span className="text-2xl">{goal.emoji}</span>
                                        <div>
                                          <h4 className="text-xs font-bold text-slate-800">{goal.title}</h4>
                                          <p className="text-[10px] text-slate-500 mt-1 leading-snug">{goal.desc}</p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>

                                  <div className="pt-2 flex gap-3">
                                    <button
                                      onClick={() => setAppState("create_account")}
                                      className="py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                                    >
                                      Back
                                    </button>
                                    <button
                                      onClick={() => setAppState("learning_preference")}
                                      disabled={!learningGoal}
                                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                                    >
                                      Next: Cognitive Style <ArrowRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Learning Style preferences */}
                              {appState === "learning_preference" && (
                                <div className="space-y-5">
                                  <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your cognitive learning styles</h2>
                                    <p className="text-xs text-slate-400">Select one or more matching styles</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    {[
                                      {
                                        id: "visual",
                                        title: "Visual Learner",
                                        emoji: "👁️",
                                        desc: "Explain using structured diagrams, analogies, and illustrations."
                                      },
                                      {
                                        id: "practice",
                                        title: "Practice Learner",
                                        emoji: "✍️",
                                        desc: "Focus on interactive code drills, quizzes, and exercises."
                                      },
                                      {
                                        id: "conversation",
                                        title: "Conversation Learner",
                                        emoji: "💬",
                                        desc: "Explain concept chains through discussions and Q&As."
                                      },
                                      {
                                        id: "reading",
                                        title: "Reading Learner",
                                        emoji: "📖",
                                        desc: "Deliver precise textbook descriptions and conceptual blocks."
                                      }
                                    ].map((pref) => {
                                      const isSelected = learningPreferences.includes(pref.id);
                                      return (
                                        <button
                                          key={pref.id}
                                          onClick={() => {
                                            if (isSelected) {
                                              setLearningPreferences(learningPreferences.filter((p) => p !== pref.id));
                                            } else {
                                              setLearningPreferences([...learningPreferences, pref.id]);
                                            }
                                          }}
                                          className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-[130px] relative ${
                                            isSelected
                                              ? "bg-indigo-50/50 border-indigo-300 text-indigo-950 shadow-sm ring-1 ring-indigo-300/30"
                                              : "bg-slate-50/40 border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-white"
                                          }`}
                                        >
                                          <div className="flex justify-between items-start w-full">
                                            <span className="text-2xl">{pref.emoji}</span>
                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                              isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                                            }`}>
                                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="text-xs font-bold text-slate-800">{pref.title}</h4>
                                            <p className="text-[10px] text-slate-500 mt-1 leading-snug">{pref.desc}</p>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className="pt-2 flex gap-3">
                                    <button
                                      onClick={() => setAppState("learning_goal")}
                                      className="py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                                    >
                                      Back
                                    </button>
                                    <button
                                      onClick={() => setAppState("skill_level")}
                                      disabled={learningPreferences.length === 0}
                                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                                    >
                                      Next: Skill Level <ArrowRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Skill Level Selection */}
                              {appState === "skill_level" && (
                                <div className="space-y-5">
                                  <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Starting point calibration</h2>
                                    <p className="text-xs text-slate-400">Where are you starting from?</p>
                                  </div>

                                  <div className="space-y-2.5">
                                    {[
                                      {
                                        id: "beginner",
                                        title: "Beginner level",
                                        emoji: "🌱",
                                        desc: "I am completely new. Explain everything from first-principles and skip no details."
                                      },
                                      {
                                        id: "intermediate",
                                        title: "Intermediate level",
                                        emoji: "🌿",
                                        desc: "I know some basics. Focus on higher complexity blocks and professional details."
                                      },
                                      {
                                        id: "advanced",
                                        title: "Advanced level",
                                        emoji: "🌳",
                                        desc: "I want deeper expert knowledge. Challenge me with complex concepts and edge-cases."
                                      }
                                    ].map((lvl) => (
                                      <button
                                        key={lvl.id}
                                        onClick={() => setSkillLevel(lvl.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex gap-4 items-center ${
                                          skillLevel === lvl.id
                                            ? "bg-indigo-50/50 border-indigo-300 text-indigo-950 shadow-sm ring-1 ring-indigo-300/30"
                                            : "bg-slate-50/30 border-slate-100 text-slate-700 hover:border-slate-200"
                                        }`}
                                      >
                                        <span className="text-2xl shrink-0">{lvl.emoji}</span>
                                        <div>
                                          <h4 className="text-xs font-bold text-slate-800">{lvl.title}</h4>
                                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{lvl.desc}</p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>

                                  <div className="pt-2 flex gap-3">
                                    <button
                                      onClick={() => setAppState("learning_preference")}
                                      className="py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                                    >
                                      Back
                                    </button>
                                    <button
                                      onClick={() => setAppState("daily_goal")}
                                      disabled={!skillLevel}
                                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                                    >
                                      Next: Daily Goal <ArrowRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Daily Goal commitment */}
                              {appState === "daily_goal" && (
                                <div className="space-y-5">
                                  <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configure daily focus block</h2>
                                    <p className="text-xs text-slate-400">Set your daily study time commitment</p>
                                  </div>

                                  <div className="grid grid-cols-4 gap-2">
                                    {[
                                      { id: "10m", title: "10 min", desc: "Quick habit" },
                                      { id: "30m", title: "30 min", desc: "Steady habit" },
                                      { id: "1h", title: "1 hour", desc: "Deep study" },
                                      { id: "2h", title: "2+ hours", desc: "Full master" }
                                    ].map((goal) => (
                                      <button
                                        key={goal.id}
                                        onClick={() => setDailyGoal(goal.id)}
                                        className={`text-center p-3 rounded-xl border transition-all ${
                                          dailyGoal === goal.id
                                            ? "bg-indigo-50 border-indigo-300 text-indigo-950 shadow-sm"
                                            : "bg-slate-50/40 border-slate-100 text-slate-700 hover:border-slate-200"
                                        }`}
                                      >
                                        <span className="text-xs font-bold block">{goal.title}</span>
                                        <span className="text-[9px] text-slate-400 mt-1 block">{goal.desc}</span>
                                      </button>
                                    ))}
                                  </div>

                                  {/* Interactive commitment progress visualization for desktop */}
                                  {dailyGoal && (
                                    <div className="bg-slate-900 rounded-2xl p-4 text-white border border-slate-800 shadow-md space-y-3.5">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-indigo-400 tracking-wider uppercase">Projected Study Milestones</span>
                                        <span className="font-mono text-emerald-400">Estimated progress pacing</span>
                                      </div>
                                      <div className="grid grid-cols-3 gap-3 border-y border-slate-800/80 py-3">
                                        <div className="text-center">
                                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Cognitive load</span>
                                          <span className="text-xs font-bold text-slate-200 mt-1 block">
                                            {dailyGoal === "10m" ? "Optimized light" : dailyGoal === "30m" ? "Balanced habit" : dailyGoal === "1h" ? "Intense absorption" : "Maximum acceleration"}
                                          </span>
                                        </div>
                                        <div className="text-center border-x border-slate-800/80">
                                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Total 30-Day volume</span>
                                          <span className="text-xs font-bold text-indigo-300 mt-1 block">
                                            {dailyGoal === "10m" ? "300 minutes" : dailyGoal === "30m" ? "900 minutes" : dailyGoal === "1h" ? "1,800 minutes" : "3,600+ minutes"}
                                          </span>
                                        </div>
                                        <div className="text-center">
                                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Target mastery level</span>
                                          <span className="text-xs font-bold text-emerald-400 mt-1 block">
                                            {dailyGoal === "10m" ? "Stage 1 Foundations" : dailyGoal === "30m" ? "Stage 3 Fluency" : dailyGoal === "1h" ? "Stage 5 Specialization" : "Elite Mastery Hub"}
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-[11px] text-slate-400 leading-normal italic text-center">
                                        &quot;I will tune my lesson sizes so you can complete them perfectly in your chosen daily window.&quot;
                                      </p>
                                    </div>
                                  )}

                                  <div className="pt-2 flex gap-3">
                                    <button
                                      onClick={() => setAppState("skill_level")}
                                      className="py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                                    >
                                      Back
                                    </button>
                                    <button
                                      onClick={() => setAppState("dashboard")}
                                      disabled={!dailyGoal}
                                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5"
                                    >
                                      <Sparkles className="w-4 h-4 animate-pulse" /> Complete Setup & Open Classroom
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Footer dynamic calibration */}
                          <div className="text-center text-[10px] text-slate-400 mt-4">
                            Calibrated for Oxford Interactive Teaching frameworks v3.6. Powering private masterclasses.
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      /* Classic Flow: Left Brand Intro + Right Simulated Classroom Preview (Topic selection / Loading) */
                      <React.Fragment>
                        {/* Left Panel: Dynamic branding introduction */}
                        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-between bg-gradient-to-br from-white via-indigo-50/10 to-indigo-50/30 relative">
                          {/* Floating SVG elements */}
                          <div className="absolute inset-0 pointer-events-none opacity-40">
                            {particles.map((p) => (
                              <div
                                key={p.id}
                                className="absolute bg-indigo-500/20 rounded-full"
                                style={{
                                  left: `${p.x}%`,
                                  top: `${p.y}%`,
                                  width: `${p.size * 2}px`,
                                  height: `${p.size * 2}px`,
                                  animation: `pulse 4s infinite ease-in-out`
                                }}
                              />
                            ))}
                          </div>

                          {/* Header brand tag */}
                          <div className="flex items-center gap-2 z-10">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                              M
                            </div>
                            <span className="font-extrabold text-slate-900 tracking-tight text-lg">Mastery AI</span>
                          </div>

                          {/* Core Headline section */}
                          <div className="my-10 space-y-6 z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs tracking-tight">
                              <Sparkles className="w-4 h-4" />
                              Premium Private Classroom Studio
                            </div>

                            <div className="space-y-2">
                              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
                                Learn anything.
                              </h1>
                              <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-600 tracking-tight leading-none">
                                Master everything.
                              </h2>
                            </div>

                            <p className="text-slate-500 text-base leading-relaxed max-w-md">
                              Your personal AI teacher that researches, teaches, explains visually, and adapts dynamically to your personal learning journey. Powered by state-of-the-art reasoning frameworks.
                            </p>

                            {/* Interactive dynamic curriculum choice area */}
                            {appState === "welcome_auth" ? (
                              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                <button
                                  onClick={() => setAppState("topic_selection")}
                                  className="py-4 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group"
                                >
                                  Get Started Free
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                  onClick={() => setAppState("topic_selection")}
                                  className="py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-800 text-sm font-semibold hover:border-slate-300 transition-colors"
                                >
                                  View Demo Topics
                                </button>
                              </div>
                            ) : (
                              /* Topic Selector */
                              <div className="pt-2 space-y-4">
                                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Enter custom topic to master
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={customTopic}
                                      onChange={(e) => setCustomTopic(e.target.value)}
                                      placeholder="e.g. Behavioral Economics, Rust Programming..."
                                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-300 text-slate-800"
                                    />
                                    <button
                                      onClick={() => handleInitiateLearning(customTopic)}
                                      disabled={!customTopic.trim()}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl px-5 transition-all disabled:opacity-50"
                                    >
                                      Go
                                    </button>
                                  </div>
                                </div>

                                {/* Popular quick-select */}
                                <div className="grid grid-cols-2 gap-2">
                                  {POPULAR_TOPICS.map((topic) => (
                                    <button
                                      key={topic.name}
                                      onClick={() => handleInitiateLearning(topic.name)}
                                      className="p-3 bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/25 rounded-xl text-left transition-all group flex items-start gap-2.5"
                                    >
                                      <span className="text-xl bg-slate-50 p-1 rounded-lg">{topic.icon}</span>
                                      <div>
                                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                          {topic.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{topic.desc}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer branding */}
                          <div className="flex items-center gap-6 text-xs text-slate-400 z-10">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Check className="w-4 h-4 text-emerald-500" /> Dynamic Analogies
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                              <Check className="w-4 h-4 text-emerald-500" /> Immersive Whiteboard
                            </span>
                          </div>
                        </div>

                        {/* Right Panel: Immersive visual preview of the futuristic classroom environment */}
                        <div className="w-full md:w-1/2 bg-slate-900 flex flex-col justify-center items-center p-8 relative overflow-hidden">
                          {/* Deep galactic workspace background */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#312e81,transparent_60%)]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#4c1d95,transparent_60%)]" />

                          {appState === "loading" ? (
                            /* Desktop Loading screen */
                            <div className="text-center text-white space-y-6 max-w-sm relative z-10">
                              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-400 border-r-purple-400 animate-spin"></div>
                                <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-xl font-bold tracking-tight">Drafting Personal Syllabus</h3>
                                <p className="text-xs text-slate-400 italic font-medium leading-relaxed">
                                  &quot;{loadingMessages[loadingMessageIndex]}&quot;
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Simulated Interactive Preview UI */
                            <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col">
                          {/* Top status header */}
                          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                              <span className="text-[11px] font-semibold text-slate-400 ml-2">Mentor Connection: Active</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                              v3.6 Live
                            </span>
                          </div>

                          <div className="p-6 space-y-5">
                            {/* AI Mentor visual widget */}
                            <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
                              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-indigo-500/30">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-300 opacity-20 blur-lg"></div>
                                <img
                                  src="/images/ai_teacher_mentor.jpg"
                                  alt="AI Tutor Avatar"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xs font-bold text-slate-200">Interactive Mentor Module</h3>
                                <p className="text-[11px] text-slate-400 leading-normal mt-1">
                                  &quot;I map complex, multi-dimensional subjects down to simple analogies. What would you like to build today?&quot;
                                </p>
                              </div>
                            </div>

                            {/* Conceptual flow widget */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                Live Interactive Whiteboard
                              </span>
                              <div className="border border-slate-800/80 bg-slate-900/40 rounded-xl p-3 flex flex-col items-center justify-center min-h-[140px] text-center relative overflow-hidden">
                                <div className="absolute top-2 right-2 flex gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span className="text-[8px] font-bold text-slate-500">ACTIVE</span>
                                </div>

                                <div className="space-y-3 w-full">
                                  <div className="flex justify-around items-center">
                                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs font-bold">
                                      Superposition
                                    </div>
                                    <div className="w-10 border-t border-dashed border-slate-700"></div>
                                    <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-bold">
                                      Entanglement
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-500 italic max-w-xs mx-auto">
                                    &quot;Spinning coins settle only when observed. Superposition is a coin mid-air.&quot;
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Learning progression bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>Mastery Progress</span>
                                <span>Level 1: Fundamentals</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-indigo-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
                  /* DESKTOP APP SHELL (Dashboard, Study Buddy, Topic Selection, Classroom) */
                  <div className="w-full flex divide-x divide-slate-100 h-[720px] overflow-hidden bg-slate-50/50">
                    
                    {/* LEFT SIDEBAR */}
                    <div className="w-60 bg-slate-900 text-slate-300 p-5 flex flex-col justify-between shrink-0">
                      {appState === "topic_selection" ? (
                        /* AI Teacher Panel */
                        <div className="space-y-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-6">
                            {/* Header brand tag */}
                            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
                                M
                              </div>
                              <div>
                                <span className="font-extrabold text-white tracking-tight text-sm block">Mastery AI</span>
                                <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase block">AI Teacher Mentor</span>
                              </div>
                            </div>

                            {/* AI Teacher Avatar Card */}
                            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                              
                              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400 animate-spin" style={{ animationDuration: "10s" }} />
                                <div className="w-12 h-12 rounded-full bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center text-xl shadow-inner shadow-indigo-500/20">
                                  👩‍🏫
                                </div>
                                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-slate-200">Professor Evelyn</h4>
                                <p className="text-[9px] text-slate-500 font-medium">Oxford Curriculum Expert</p>
                              </div>

                              <p className="text-[11px] text-slate-400 leading-normal italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40">
                                {courseCreationStep === "input" && '"Tell me what concept or discipline you wish to master. I will curate a personalized path."'}
                                {courseCreationStep === "questions" && '"Excellent choice. Let me ask you a few fast customization questions to align my pacing."'}
                                {courseCreationStep === "generating" && '"Stand by. I am consulting our Oxford-inspired cognitive curriculum models."'}
                                {courseCreationStep === "preview" && '"The draft is ready! Review the modules and concepts I synthesized for you."'}
                                {courseCreationStep === "visualization" && '"Here is the resulting interactive skill map. Launch it whenever you are ready."'}
                              </p>
                            </div>

                            {/* Teacher logs */}
                            <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3 max-h-[140px] overflow-y-auto scrollbar-none text-[10px] space-y-2">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-900 pb-1">AI Teacher Status</span>
                              <div className="space-y-1 text-slate-400">
                                <p>• Cognitive path engine online.</p>
                                {creationTopic && <p className="text-indigo-400">• Mapping &quot;{creationTopic}&quot;...</p>}
                                {creationGoal && <p className="text-purple-400">• Goal set: {creationGoal}</p>}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setAppState("dashboard")}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                          >
                            <ChevronLeft className="w-4 h-4" /> Exit to Dashboard
                          </button>
                        </div>
                      ) : (
                        /* STANDARD LEFT SIDEBAR */
                        <div className="space-y-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-6">
                            {/* Header brand tag */}
                            <div className="flex items-center gap-2.5 pb-2">
                              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
                                M
                              </div>
                              <div>
                                <span className="font-extrabold text-white tracking-tight text-sm block">Mastery AI</span>
                                <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase block">AI TEACHER MENTOR</span>
                              </div>
                            </div>

                            {/* Navigation links */}
                            <div className="space-y-1 pt-2">
                              <button
                                onClick={() => setAppState("dashboard")}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                  appState === "dashboard"
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "hover:bg-slate-800/40 hover:text-slate-200"
                                }`}
                              >
                                <Home className="w-4 h-4" />
                                <span>Dashboard Hub</span>
                              </button>

                              <button
                                onClick={() => setAppState("topic_selection")}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-slate-800/40 hover:text-slate-200"
                              >
                                <BookOpen className="w-4 h-4" />
                                <span>AI Classroom</span>
                              </button>

                              <button
                                onClick={() => setAppState("study_buddy")}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                  appState === "study_buddy"
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "hover:bg-slate-800/40 hover:text-slate-200"
                                }`}
                              >
                                <FileText className="w-4 h-4" />
                                <span>Study Buddy</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (selectedTopic && curriculum.length > 0) {
                                    setAppState("classroom");
                                  } else {
                                    setAppState("topic_selection");
                                  }
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                  appState === "classroom"
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "hover:bg-slate-800/40 hover:text-slate-200 animate-pulse"
                                }`}
                              >
                                <TrendingUp className="w-4 h-4" />
                                <span>Active Syllabus</span>
                              </button>
                            </div>
                          </div>

                          {/* Mentor Badge */}
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5 shadow-md">
                            <Award className="w-5 h-5 text-indigo-400 shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-[10px] font-bold text-slate-200 truncate">Oxford Model v3.6</h4>
                              <p className="text-[9px] text-slate-500 font-medium truncate">Continuous Learning</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CENTER COLUMN (DASHBOARD OR STUDY BUDDY OR TOPIC SELECTION OR CLASSROOM) */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white flex flex-col">
                      
                      {/* 1. DASHBOARD VIEW */}
                      {appState === "dashboard" && (
                        <div className="space-y-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-6">
                            {/* Greeting */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                              <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Good morning, {userName || "Alex"} 👋</h1>
                                <p className="text-xs text-slate-500 mt-0.5">Let&apos;s unlock another intellectual milestone today.</p>
                              </div>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Interactive connection active
                              </span>
                            </div>

                            {/* Connected Learning Cards */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Card 1: Classroom */}
                              <div className="bg-gradient-to-br from-indigo-50/20 to-indigo-50/5 hover:to-indigo-50/20 border border-indigo-100/60 rounded-2xl p-5 shadow-sm space-y-3 transition-all flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 font-bold text-xs">🎓 Classroom</span>
                                    <span className="text-[9px] text-indigo-500 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">AUTO-SYLLABUS</span>
                                  </div>
                                  <h3 className="font-extrabold text-slate-900 text-sm">Syllabus-Based Masterclasses</h3>
                                  <p className="text-xs text-slate-500 leading-normal">
                                    Enter any topic, from astrophysics to baking. The AI builds a full visual and theoretical course curriculum with progressive concept milestones.
                                  </p>
                                </div>
                                <button
                                  onClick={() => setAppState("topic_selection")}
                                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                                >
                                  Open AI Classroom
                                </button>
                              </div>

                              {/* Card 2: Study Buddy */}
                              <div className="bg-gradient-to-br from-purple-50/20 to-purple-50/5 hover:to-purple-50/20 border border-purple-100/60 rounded-2xl p-5 shadow-sm space-y-3 transition-all flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="p-1.5 bg-purple-50 rounded-lg text-purple-600 font-bold text-xs">📚 Study Buddy</span>
                                    <span className="text-[9px] text-purple-500 font-bold bg-purple-50 px-1.5 py-0.5 rounded">DOCUMENT CHAT</span>
                                  </div>
                                  <h3 className="font-extrabold text-slate-900 text-sm">Upload & Master Your Material</h3>
                                  <p className="text-xs text-slate-500 leading-normal">
                                    Drag & drop notes, transcripts, or textbook chapters. AI translates them into immersive summaries, intuitive analogies, and active drills.
                                  </p>
                                </div>
                                <button
                                  onClick={() => setAppState("study_buddy")}
                                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                                >
                                  Open Study Buddy
                                </button>
                              </div>
                            </div>

                            {/* Progress & AI Teacher Suggestions row */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Continue Learning card */}
                              <div className="border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 bg-white">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Last Active Lesson</span>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-extrabold text-slate-800 text-sm">{selectedTopic || "Python Programming"}</h4>
                                    <p className="text-[11px] text-slate-400 mt-1">Stage {currentConceptIndex + 1}: {activeLesson?.title || "Fundamentals of Scope"}</p>
                                  </div>
                                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                      <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="3.5" fill="transparent" />
                                      <circle cx="24" cy="24" r="20" stroke="#4f46e5" strokeWidth="3.5" fill="transparent" strokeDasharray="125" strokeDashoffset="45" />
                                    </svg>
                                    <span className="absolute text-[10px] font-bold text-slate-700">65%</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    if (selectedTopic && curriculum.length > 0) {
                                      setAppState("classroom");
                                    } else {
                                      handleInitiateLearning("Python Programming");
                                    }
                                  }}
                                  className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
                                >
                                  Resume Lesson
                                </button>
                              </div>

                              {/* AI suggestion */}
                              <div className="border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 bg-slate-50/50">
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">AI Smart recommendation</span>
                                <p className="text-xs font-semibold text-slate-800 leading-normal">
                                  💡 Next topic: <span className="text-indigo-600 font-extrabold">Object-Oriented Programming</span>
                                </p>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                  Since you mastered Functions, mapping classes & inheritance will maximize your fluency progression.
                                </p>
                                <button
                                  onClick={() => handleInitiateLearning("Object Oriented Programming")}
                                  className="w-full py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
                                >
                                  Begin Topic
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Stats at bottom */}
                          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-amber-50 rounded-xl text-amber-600 text-base">🔥</span>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Daily streak</span>
                                <span className="text-xs font-extrabold text-slate-800 block">7 consecutive days</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600 text-base">🧠</span>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Skills Mastered</span>
                                <span className="text-xs font-extrabold text-slate-800 block">12 cognitive nodes</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600 text-base">⏱</span>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Study Volume</span>
                                <span className="text-xs font-extrabold text-slate-800 block">15 total study hours</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. STUDY BUDDY VIEW */}
                      {appState === "study_buddy" && (
                        <div className="space-y-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-5">
                            {/* Header */}
                            <div className="border-b border-slate-100 pb-4">
                              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Study Buddy Workspace</h1>
                              <p className="text-xs text-slate-500 mt-0.5">Let AI digest your personal materials & build custom explanations.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Drag & drop */}
                              <div 
                                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setIsDragOver(false);
                                  const files = e.dataTransfer.files;
                                  if (files && files.length > 0) {
                                    const file = files[0];
                                    setStudyMaterialName(file.name);
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                      if (evt.target?.result) {
                                        setStudyMaterialText(evt.target.result as string);
                                      }
                                    };
                                    reader.readAsText(file);
                                  }
                                }}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col justify-center ${
                                  isDragOver ? "border-purple-500 bg-purple-50/40" : "border-slate-200 bg-white"
                                }`}
                              >
                                <UploadCloud className="w-10 h-10 text-purple-500 mx-auto animate-bounce mb-3" />
                                <h3 className="font-extrabold text-slate-800 text-sm">Drag & Drop notes / documents</h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                                  Drag PDF, txt, or outline here, or select file from your system explorer.
                                </p>
                                <input
                                  type="file"
                                  id="file-upload-desktop-pane"
                                  className="hidden"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                      const file = files[0];
                                      setStudyMaterialName(file.name);
                                      const reader = new FileReader();
                                      reader.onload = (evt) => {
                                        if (evt.target?.result) {
                                          setStudyMaterialText(evt.target.result as string);
                                        }
                                      };
                                      reader.readAsText(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="file-upload-desktop-pane"
                                  className="mt-4 mx-auto px-4 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-xs font-bold text-purple-600 rounded-xl cursor-pointer transition-all"
                                >
                                  Choose File from System
                                </label>
                              </div>

                              {/* Text inputs */}
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Name of Study Deck
                                  </label>
                                  <input
                                    type="text"
                                    value={studyMaterialName}
                                    onChange={(e) => setStudyMaterialName(e.target.value)}
                                    placeholder="e.g. World War II Outline, Physics Chapter 3"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Paste notes or textbooks
                                  </label>
                                  <textarea
                                    rows={6}
                                    value={studyMaterialText}
                                    onChange={(e) => setStudyMaterialText(e.target.value)}
                                    placeholder="Paste notes content or syllabus text directly here..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white leading-relaxed transition-all"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleInitiateStudyBuddy(studyMaterialText, studyMaterialName)}
                            disabled={!studyMaterialText.trim()}
                            className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5 animate-pulse"
                          >
                            <Sparkles className="w-4 h-4" />
                            Analyze Material & Initiate Study Session
                          </button>
                        </div>
                      )}

                      {/* 3. TOPIC SELECTION / COURSE CREATION WORKSPACE */}
                      {appState === "topic_selection" && (
                        <div className="flex-1 flex flex-col justify-between h-full overflow-y-auto">
                          
                          {/* STEP 1: INPUT */}
                          {courseCreationStep === "input" && (
                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                              <div className="space-y-6">
                                {/* Header */}
                                <div className="border-b border-slate-100 pb-4">
                                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Interactive Syllabus Builder</span>
                                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Learning Journey</h1>
                                  <p className="text-xs text-slate-550 mt-0.5">What do you want to master today? Our AI teacher will curate a custom Oxford-inspired path.</p>
                                </div>

                                {/* Popular Topics Cards */}
                                <div className="space-y-3">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Recommended Masteries</span>
                                  <div className="grid grid-cols-2 gap-4">
                                    {POPULAR_TOPICS.map((topic) => (
                                      <button
                                        key={topic.name}
                                        onClick={() => handleStartCourseCreation(topic.name)}
                                        className="text-left p-4.5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/15 hover:shadow-md transition-all duration-300 flex items-start gap-4 bg-white group cursor-pointer"
                                      >
                                        <span className="text-3xl bg-slate-50 p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">{topic.icon}</span>
                                        <div>
                                          <h4 className="text-xs font-black text-slate-800 group-hover:text-indigo-650 transition-colors">{topic.name}</h4>
                                          <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{topic.desc}</p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Custom topic form */}
                                <div className="space-y-2 pt-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Or Explore a Custom Topic</span>
                                  <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
                                    <input
                                      type="text"
                                      value={customTopic}
                                      onChange={(e) => setCustomTopic(e.target.value)}
                                      placeholder="e.g. Quantum Physics, Spanish Literature, Machine Learning..."
                                      className="flex-1 bg-transparent px-3 text-xs font-semibold text-slate-800 focus:outline-none"
                                    />
                                    <button
                                      onClick={() => handleStartCourseCreation(customTopic)}
                                      disabled={!customTopic.trim()}
                                      className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                                    >
                                      Create Pathway <Sparkles className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="text-center text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-4">
                                🔬 Multi-step synthesis adapts instantly to your active pacing, level, and goals.
                              </div>
                            </div>
                          )}

                          {/* STEP 2: QUESTIONS */}
                          {courseCreationStep === "questions" && (
                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                              <div className="space-y-6">
                                {/* Header / Progress */}
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <span>Personalizing for: <strong className="text-indigo-600">{creationTopic}</strong></span>
                                    <span>Question {currentQuestionIndex + 1} of 4</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" 
                                      style={{ width: `${((currentQuestionIndex + 1) / 4) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                                    {currentQuestionIndex === 0 && "Why do you want to learn this?"}
                                    {currentQuestionIndex === 1 && "What is your current level?"}
                                    {currentQuestionIndex === 2 && "How do you prefer learning?"}
                                    {currentQuestionIndex === 3 && "Daily study commitment?"}
                                  </h2>

                                  <div className="grid grid-cols-2 gap-4">
                                    {currentQuestionIndex === 0 && [
                                      { key: "Career advancement", desc: "Gain professional skills for job market fluency", icon: "💼" },
                                      { key: "Academic excellence", desc: "Deepen structured textbook knowledge & exams", icon: "🎓" },
                                      { key: "Personal interest", desc: "Pure curiosity-driven learning", icon: "🌱" },
                                      { key: "Building a project", desc: "Learn explicitly to manufacture a product", icon: "🛠️" }
                                    ].map((opt) => (
                                      <button
                                        key={opt.key}
                                        onClick={() => {
                                          setCreationGoal(opt.key);
                                          setCurrentQuestionIndex(1);
                                        }}
                                        className={`text-left p-4 rounded-2xl border transition-all shadow-sm space-y-2 hover:shadow-md cursor-pointer group bg-white ${
                                          creationGoal === opt.key ? "border-indigo-500 ring-2 ring-indigo-50 bg-indigo-50/5" : "border-slate-100 hover:border-indigo-100"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="text-2.5xl bg-slate-50 p-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors">{opt.icon}</span>
                                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${creationGoal === opt.key ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-bold text-slate-850">{opt.key}</h4>
                                          <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{opt.desc}</p>
                                        </div>
                                      </button>
                                    ))}

                                    {currentQuestionIndex === 1 && [
                                      { key: "Beginner", desc: "Zero coding or domain knowledge", icon: "⭐️" },
                                      { key: "Intermediate", desc: "Familiar with terminology & basic loops", icon: "⚡️" },
                                      { key: "Advanced", desc: "Ready to study architecture & optimization", icon: "🔬" }
                                    ].map((opt) => (
                                      <button
                                        key={opt.key}
                                        onClick={() => {
                                          setCreationLevel(opt.key);
                                          setCurrentQuestionIndex(2);
                                        }}
                                        className={`text-left p-4 rounded-2xl border transition-all shadow-sm space-y-2 hover:shadow-md cursor-pointer group bg-white ${
                                          creationLevel === opt.key ? "border-indigo-500 ring-2 ring-indigo-50 bg-indigo-50/5" : "border-slate-100 hover:border-indigo-100"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="text-2.5xl bg-slate-50 p-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors">{opt.icon}</span>
                                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${creationLevel === opt.key ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-bold text-slate-850">{opt.key}</h4>
                                          <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{opt.desc}</p>
                                        </div>
                                      </button>
                                    ))}

                                    {currentQuestionIndex === 2 && [
                                      { key: "Visual whiteboard maps", desc: "Syllabi illustrated with dynamic schemas", icon: "🎨" },
                                      { key: "Practice drills & projects", desc: "Interactive compilers & simulator challenges", icon: "💻" },
                                      { key: "Conversational discussion", desc: "Q&A dialog with your mentor teacher", icon: "💬" },
                                      { key: "Comprehensive text guides", desc: "Analogies & detailed breakdown guides", icon: "📖" }
                                    ].map((opt) => (
                                      <button
                                        key={opt.key}
                                        onClick={() => {
                                          setCreationPreference(opt.key);
                                          setCurrentQuestionIndex(3);
                                        }}
                                        className={`text-left p-4 rounded-2xl border transition-all shadow-sm space-y-2 hover:shadow-md cursor-pointer group bg-white ${
                                          creationPreference === opt.key ? "border-indigo-500 ring-2 ring-indigo-50 bg-indigo-50/5" : "border-slate-100 hover:border-indigo-100"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="text-2.5xl bg-slate-50 p-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors">{opt.icon}</span>
                                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${creationPreference === opt.key ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-bold text-slate-850">{opt.key}</h4>
                                          <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{opt.desc}</p>
                                        </div>
                                      </button>
                                    ))}

                                    {currentQuestionIndex === 3 && [
                                      { key: "10 mins/day", desc: "Micro learning habit", icon: "⏱️" },
                                      { key: "30 mins/day", desc: "Standard balanced integration", icon: "⏳" },
                                      { key: "1 hour/day", desc: "Immersive high absorption", icon: "🚀" }
                                    ].map((opt) => (
                                      <button
                                        key={opt.key}
                                        onClick={() => {
                                          setCreationTime(opt.key);
                                          setTimeout(() => {
                                            handleTriggerGeneration();
                                          }, 300);
                                        }}
                                        className={`text-left p-4 rounded-2xl border transition-all shadow-sm space-y-2 hover:shadow-md cursor-pointer group bg-white ${
                                          creationTime === opt.key ? "border-indigo-500 ring-2 ring-indigo-50 bg-indigo-50/5" : "border-slate-100 hover:border-indigo-100"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="text-2.5xl bg-slate-50 p-1.5 rounded-lg group-hover:bg-indigo-50 transition-colors">{opt.icon}</span>
                                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${creationTime === opt.key ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400"}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-bold text-slate-850">{opt.key}</h4>
                                          <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{opt.desc}</p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                <button
                                  onClick={() => {
                                    if (currentQuestionIndex > 0) {
                                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                                    } else {
                                      setCourseCreationStep("input");
                                    }
                                  }}
                                  className="py-2.5 px-5 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                  Back
                                </button>
                                <span className="text-[10px] font-bold text-slate-400">Pacing Alignment Online</span>
                              </div>
                            </div>
                          )}

                          {/* STEP 3: GENERATING */}
                          {courseCreationStep === "generating" && (
                            <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-8 my-auto">
                              {/* Glowing loader */}
                              <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />
                                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-600 border-r-purple-500 animate-spin flex items-center justify-center" style={{ animationDuration: "1.2s" }}>
                                  <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
                                </div>
                                <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 border-2 border-white shadow-sm">
                                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                </span>
                              </div>

                              <div className="text-center space-y-2 max-w-md">
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Professor Evelyn is Mapping...</h2>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  Formulating modular lessons, custom coordinate plot exercises, and sandbox coding evaluations based on {creationTopic}.
                                </p>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full max-w-sm space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  <span>Compiling Curriculum</span>
                                  <span>{generationProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-300"
                                    style={{ width: `${generationProgress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Generation steps status checklist */}
                              <div className="w-full max-w-xs space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                {generationSteps.map((step, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-xs">
                                    <div className="shrink-0">
                                      {step.completed ? (
                                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">✓</div>
                                      ) : step.active ? (
                                        <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                                      )}
                                    </div>
                                    <span className={`font-semibold ${step.completed ? "text-slate-500 line-through" : step.active ? "text-indigo-600 font-extrabold animate-pulse" : "text-slate-400"}`}>
                                      {step.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* STEP 4: PREVIEW */}
                          {courseCreationStep === "preview" && (
                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                              <div className="space-y-5">
                                {/* Header */}
                                <div className="border-b border-slate-100 pb-3">
                                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Curriculum Synthesized</span>
                                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Personalized Roadmap</h1>
                                  <p className="text-xs text-slate-500 mt-0.5">Explore the modules structured by Professor Evelyn matching your {creationLevel} level.</p>
                                </div>

                                {/* 2-Column Preview layout */}
                                <div className="grid grid-cols-5 gap-6">
                                  {/* Left Column (Roadmap) */}
                                  <div className="col-span-3 space-y-3 max-h-[340px] overflow-y-auto pr-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Modular Syllabus</span>
                                    {curriculum.length > 0 ? (
                                      curriculum.map((module: any, idx: number) => (
                                        <div 
                                          key={idx} 
                                          className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex gap-4 hover:border-indigo-100 hover:shadow-md transition-all"
                                        >
                                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/30 flex items-center justify-center text-xl shrink-0">
                                            {module.emoji || "📚"}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Module {idx + 1}</span>
                                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                                              <span className="text-[9px] font-semibold text-slate-400">{module.lessons?.length || 4} units</span>
                                            </div>
                                            <h4 className="text-xs font-black text-slate-800 mt-1">{module.title}</h4>
                                            <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{module.description}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-6 text-xs text-slate-400">Roadmap elements compiling...</div>
                                    )}
                                  </div>

                                  {/* Right Column (Course Metadata / Context Card) */}
                                  <div className="col-span-2 space-y-4">
                                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 shadow-inner">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Pedagogical Strategy</span>
                                      <div className="space-y-3">
                                        <div className="flex gap-2.5 items-start">
                                          <span className="text-sm">🎓</span>
                                          <div>
                                            <h5 className="text-[10px] font-black text-slate-750">Cognitive Anchors</h5>
                                            <p className="text-[9px] text-slate-450 mt-0.5 leading-relaxed">Synthesizing visual graphs & HTML arrangement coordinates for {creationPreference} learners.</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2.5 items-start">
                                          <span className="text-sm">⏱️</span>
                                          <div>
                                            <h5 className="text-[10px] font-black text-slate-750">Weekly Commitment</h5>
                                            <p className="text-[9px] text-slate-450 mt-0.5 leading-relaxed">Distributed learning paced at {creationTime} weekly slots.</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2.5 items-start">
                                          <span className="text-sm">🔑</span>
                                          <div>
                                            <h5 className="text-[10px] font-black text-slate-750">Final Milestone Project</h5>
                                            <p className="text-[9px] text-slate-450 mt-0.5 leading-relaxed">Practical active code editor capstone tailored for real-world utility.</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-4 border-t border-slate-100 pt-4">
                                <button
                                  onClick={() => setCourseCreationStep("questions")}
                                  className="py-3 px-6 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  Modify Criteria
                                </button>
                                <button
                                  onClick={handleTriggerGeneration}
                                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  Generate Interactive Skill Tree <Sparkles className="w-4 h-4 animate-pulse" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* STEP 5: VISUALIZATION */}
                          {courseCreationStep === "visualization" && (
                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                              <div className="space-y-4">
                                {/* Header */}
                                <div className="border-b border-slate-100 pb-3 flex justify-between items-end">
                                  <div>
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Neural Skill Tree Graph</span>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Progression</h1>
                                    <p className="text-xs text-slate-500 mt-0.5">Explore the concept nodes. Double click to unlock dependencies or test active modules.</p>
                                  </div>
                                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-500 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" /> Live Graph Engine
                                  </div>
                                </div>

                                {/* Main Skill map block */}
                                <div className="relative w-full h-[280px] bg-slate-900 rounded-3xl border border-slate-850 overflow-hidden shadow-inner flex items-center justify-center">
                                  {/* Grid background */}
                                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                                  {/* SVG Connections & Nodes */}
                                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {/* Connection paths */}
                                    <line x1="20%" y1="50%" x2="40%" y2="25%" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
                                    <line x1="20%" y1="50%" x2="40%" y2="75%" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
                                    <line x1="40%" y1="25%" x2="65%" y2="25%" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                                    <line x1="40%" y1="75%" x2="65%" y2="75%" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                                    <line x1="65%" y1="25%" x2="85%" y2="50%" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                                    <line x1="65%" y1="75%" x2="85%" y2="50%" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                                  </svg>

                                  {/* Node 1: Beginner */}
                                  <div className="absolute left-[12%] top-[40%] transform -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center text-white text-base shadow-lg shadow-indigo-500/20 animate-pulse relative">
                                      ✨
                                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-black">✓</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-indigo-400 mt-2">Active Foundations</span>
                                  </div>

                                  {/* Node 2: Intermediate Module */}
                                  <div className="absolute left-[35%] top-[20%] flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-850 border border-indigo-400 flex items-center justify-center text-indigo-400 text-base shadow-md cursor-pointer hover:scale-105 transition-transform">
                                      ⚡️
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-300 mt-2">Core Logic Loops</span>
                                  </div>

                                  {/* Node 3: Advanced Exercises */}
                                  <div className="absolute left-[35%] top-[65%] flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-850 border border-indigo-400 flex items-center justify-center text-indigo-400 text-base shadow-md cursor-pointer hover:scale-105 transition-transform">
                                      💻
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-300 mt-2">Structural Assembly</span>
                                  </div>

                                  {/* Node 4: Capstone Block */}
                                  <div className="absolute left-[60%] top-[20%] flex flex-col items-center">
                                    <div className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 text-sm relative">
                                      🔒
                                    </div>
                                    <span className="text-[9px] font-medium text-slate-500 mt-2">Capstone Project</span>
                                  </div>

                                  {/* Node 5: Practical Exercises */}
                                  <div className="absolute left-[60%] top-[65%] flex flex-col items-center">
                                    <div className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 text-sm relative">
                                      🔒
                                    </div>
                                    <span className="text-[9px] font-medium text-slate-500 mt-2">Sandbox Practice</span>
                                  </div>

                                  {/* Node 6: Master */}
                                  <div className="absolute left-[82%] top-[40%] transform -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 text-base relative">
                                      🏆
                                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center text-[8px] font-bold">🔒</span>
                                    </div>
                                    <span className="text-[9px] font-medium text-slate-500 mt-2">Mastery Certified</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setAppState("classroom");
                                }}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                              >
                                <Sparkles className="w-4 h-4 animate-pulse" /> Launch Course Sandbox
                              </button>
                            </div>
                          )}

                        </div>
                      )}

                      {/* 4. SYLLABUS / CLASSROOM VIEW */}
                      {appState === "classroom" && (
                        <div className="space-y-6 flex-1 flex flex-col h-full overflow-hidden">
                          {/* A. ACTIVE LESSON HEADLINE */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                            <div>
                              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">
                                <BookOpen className="w-4 h-4 animate-pulse" /> Concept Stage {currentConceptIndex + 1} of 4 • {canvasType.toUpperCase()} MODE
                              </div>
                              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                                {activeLesson?.title}
                              </h1>
                            </div>
                            
                            {/* Practice Mode toggler */}
                            <button
                              onClick={() => setIsExerciseMode(!isExerciseMode)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 active:scale-95 ${
                                isExerciseMode 
                                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              ✏️ {isExerciseMode ? "Return to Learning Sandbox" : "Test Your Understanding (Practice)"}
                            </button>
                          </div>

                          {/* B. PROGRESS TRACKER ROW */}
                          <div className="grid grid-cols-4 gap-3 shrink-0">
                            {curriculum.map((c, i) => (
                              <button
                                key={c.id}
                                disabled={i > currentConceptIndex}
                                onClick={() => {
                                  setCurrentConceptIndex(i);
                                  setSelectedQuizAnswer(null);
                                  setHasSubmittedQuiz(false);
                                }}
                                className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                                  i === currentConceptIndex
                                    ? "bg-indigo-50/60 border-indigo-200 text-indigo-950 font-extrabold shadow-sm"
                                    : i < currentConceptIndex
                                    ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                                    : "opacity-40 bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate text-xs">
                                  {i < currentConceptIndex ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                  ) : (
                                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                                  )}
                                  <span className="truncate">{c.title}</span>
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* C. TWO-COLUMN SPLIT CONTAINER (Text/Bridge vs Visual Sandbox/Practice) */}
                          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden min-h-0">
                            
                            {/* Column 1: Theoretical Foundation & Analogical Bridges */}
                            <div className="overflow-y-auto pr-2 space-y-5 scrollbar-none flex flex-col">
                              
                              {/* Conceptual description card */}
                              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md block w-fit">
                                  Theoretical Foundation
                                </span>
                                <div className="text-xs text-slate-600 leading-relaxed space-y-3 whitespace-pre-wrap">
                                  {activeLesson?.content}
                                </div>
                              </div>

                              {/* Analogical Bridge Box */}
                              {activeLesson?.analogy && (
                                <div className="bg-gradient-to-br from-amber-50/40 to-amber-50/10 border border-amber-100 rounded-2xl p-5 shadow-sm space-y-1.5 relative overflow-hidden shrink-0">
                                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/20 rounded-full blur-xl" />
                                  <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wider">
                                    <Lightbulb className="w-4 h-4 text-amber-500" /> Intuitive Analogy Bridge
                                  </span>
                                  <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
                                    &quot;{activeLesson.analogy}&quot;
                                  </p>
                                </div>
                              )}

                              {/* Whiteboard Prompt */}
                              {activeLesson?.diagramPrompt && (
                                <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-md shrink-0">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                                  <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-extrabold block mb-2 tracking-wider">Whiteboard Illustration Objective</span>
                                  <p className="font-mono text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-4 border border-slate-800/60 rounded-xl">
                                    &quot;{activeLesson?.diagramPrompt}&quot;
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Column 2: Interactive Sandbox or Diagnostic Challenges */}
                            <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between overflow-y-auto scrollbar-none shadow-xl shadow-indigo-950/20 relative">
                              
                              {/* Header block inside Column 2 */}
                              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4 shrink-0">
                                <span className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                                  <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} /> 
                                  {isExerciseMode ? "Comprehension Challenge Active" : "Interactive Concept Sandbox"}
                                </span>
                                
                                {/* Quick canvas-type selection nodes */}
                                <div className="flex bg-slate-900 rounded-xl p-0.5 border border-slate-800">
                                  {[
                                    { type: "html", icon: "🌐", label: "HTML" },
                                    { type: "programming", icon: "💻", label: "Code" },
                                    { type: "science", icon: "⚛️", label: "Science" },
                                    { type: "business", icon: "📈", label: "Metrics" },
                                    { type: "math", icon: "🧮", label: "Math" }
                                  ].map((c) => (
                                    <button
                                      key={c.type}
                                      onClick={() => {
                                        setCanvasType(c.type as any);
                                        setIsExerciseMode(false);
                                      }}
                                      className={`px-2 py-1 text-[10px] rounded-lg transition-all font-bold flex items-center gap-1 ${
                                        canvasType === c.type ? "bg-slate-800 border border-slate-700 text-white" : "opacity-40 hover:opacity-75"
                                      }`}
                                    >
                                      <span>{c.icon}</span>
                                      <span className="hidden xl:inline">{c.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* CHALLENGE WORKSPACE */}
                              <div className="flex-1 flex flex-col justify-center min-h-[250px]">
                                {isExerciseMode ? (
                                  <div className="space-y-4">
                                    
                                    {/* 1. HTML Block */}
                                    {canvasType === "html" && (
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block font-mono">HTML Block Tag Composition</span>
                                          <h4 className="text-xs font-bold text-slate-300">Assemble tags sequentially to form a proper button link card:</h4>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                          {["<button>", "Buy Now", "</button>", "class=\"btn\""].map((item, idx) => {
                                            const isDropped = dragDroppedItems.includes(item);
                                            return (
                                              <button
                                                key={idx}
                                                disabled={isDropped}
                                                onClick={() => setDragDroppedItems(prev => [...prev, item])}
                                                className={`p-2.5 rounded-lg text-xs font-mono border text-center transition-all ${
                                                  isDropped 
                                                    ? "bg-slate-950 border-slate-900 text-slate-700 scale-95" 
                                                    : "bg-indigo-950/40 border-indigo-900/40 text-indigo-300 hover:border-indigo-400"
                                                }`}
                                              >
                                                {item}
                                              </button>
                                            );
                                          })}
                                        </div>

                                        {/* Assembly Display */}
                                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 min-h-[50px] flex flex-wrap gap-2 items-center">
                                          {dragDroppedItems.length === 0 ? (
                                            <span className="text-xs text-slate-500 italic">Click the modular code blocks above to sequence them...</span>
                                          ) : (
                                            dragDroppedItems.map((item, idx) => (
                                              <span 
                                                key={idx} 
                                                onClick={() => setDragDroppedItems(prev => prev.filter(x => x !== item))}
                                                className="px-2.5 py-1.5 rounded bg-indigo-900/80 text-indigo-100 border border-indigo-700/50 font-mono text-xs cursor-pointer hover:bg-indigo-950"
                                              >
                                                {item}
                                              </span>
                                            ))
                                          )}
                                        </div>

                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              if (dragDroppedItems[0] === "<button>" && dragDroppedItems[3] === "</button>") {
                                                setExerciseStatus("success");
                                                setExerciseFeedback("Oxford compiler success: Valid HTML arrangement structural trace initialized.");
                                              } else {
                                                setExerciseStatus("failure");
                                                setExerciseFeedback("Nesting Mismatch: You must open <button> before closing it with </button>.");
                                              }
                                            }}
                                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors"
                                          >
                                            Evaluate Layout Elements
                                          </button>
                                          <button
                                            onClick={() => { setDragDroppedItems([]); setExerciseStatus("idle"); setExerciseFeedback(null); }}
                                            className="px-4 py-2 bg-slate-900 border border-slate-850 rounded-xl text-xs text-slate-400 hover:text-white"
                                          >
                                            Reset
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* 2. Programming Block */}
                                    {canvasType === "programming" && (
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Loop Match logic</span>
                                          <h4 className="text-xs font-bold text-slate-300">Complete loop filter criteria for matching pairs:</h4>
                                        </div>

                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-indigo-300 leading-relaxed">
                                          <p>items = [&quot;Apple&quot;, &quot;Berry&quot;, &quot;Peach&quot;]</p>
                                          <p>filtered = []</p>
                                          <p>for item in items:</p>
                                          <p className="pl-4">if len(item) == <span className="bg-indigo-900 border border-indigo-500/50 px-2 py-0.5 rounded text-white font-bold">{codeChallengeAnswer || "___"}</span>:</p>
                                          <p className="pl-8">filtered.append(item)</p>
                                          <p className="text-slate-500 mt-2"># goal: filtered is [&quot;Berry&quot;, &quot;Peach&quot;]</p>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                          {["3", "4", "5", "len"].map((ans) => (
                                            <button
                                              key={ans}
                                              onClick={() => setCodeChallengeAnswer(ans)}
                                              className={`py-2 rounded-xl font-mono text-xs border text-center transition-all ${
                                                codeChallengeAnswer === ans 
                                                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20" 
                                                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                                              }`}
                                            >
                                              {ans}
                                            </button>
                                          ))}
                                        </div>

                                        <button
                                          onClick={() => {
                                            if (codeChallengeAnswer === "5") {
                                              setExerciseStatus("success");
                                              setExerciseFeedback("Correct! 'Berry' and 'Peach' both satisfy length 5 loop filters.");
                                            } else {
                                              setExerciseStatus("failure");
                                              setExerciseFeedback("Array mismatch: Chosen length yields unexpected outputs.");
                                            }
                                          }}
                                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors"
                                        >
                                          Compile & Execute Loop 🚀
                                        </button>
                                      </div>
                                    )}

                                    {/* 3. Science Bohr shell */}
                                    {canvasType === "science" && (
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Bohr Shell Excitation Target</span>
                                          <h4 className="text-xs font-bold text-slate-300">Set laser frequency level to stimulate orbit index 3:</h4>
                                        </div>

                                        <div className="space-y-1 bg-slate-900 p-4 rounded-xl border border-slate-800">
                                          <div className="flex justify-between text-xs text-slate-400 font-mono">
                                            <span>n=1</span>
                                            <span className="text-indigo-400 font-bold">Target State (n=3)</span>
                                          </div>
                                          <input
                                            type="range"
                                            min="1"
                                            max="3"
                                            step="1"
                                            value={physicsMass}
                                            onChange={(e) => setPhysicsMass(parseInt(e.target.value))}
                                            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                          />
                                          <div className="flex justify-between text-xs font-bold px-1 font-mono mt-1">
                                            <span className={physicsMass === 1 ? "text-indigo-400" : "text-slate-600"}>n = 1</span>
                                            <span className={physicsMass === 2 ? "text-indigo-400" : "text-slate-600"}>n = 2</span>
                                            <span className={physicsMass === 3 ? "text-indigo-400" : "text-slate-600"}>n = 3</span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => {
                                            if (physicsMass === 3) {
                                              setExerciseStatus("success");
                                              setExerciseFeedback("High Energy Emission Success! Electron stimulated to Orbit level 3. Wavelength matching complete!");
                                            } else {
                                              setExerciseStatus("failure");
                                              setExerciseFeedback("Quantum Gap Mismatch: Level too low to satisfy orbit delta energy requirement.");
                                            }
                                          }}
                                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors"
                                        >
                                          Activate Laser Particle Beam 💥
                                        </button>
                                      </div>
                                    )}

                                    {/* 4. Business value loop */}
                                    {canvasType === "business" && (
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Customer Cohort Churn node</span>
                                          <h4 className="text-xs font-bold text-slate-300">Identify the cohort loop optimization node:</h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          {[
                                            { id: "acq", label: "Acquisition (Top of funnel traffic)" },
                                            { id: "act", label: "Activation (Immediate value perception)" },
                                            { id: "ret", label: "Retention (Cohort repeat usage locks)" },
                                            { id: "ref", label: "Referral (Word-of-mouth shared loops)" }
                                          ].map((node) => (
                                            <button
                                              key={node.id}
                                              onClick={() => setBusinessFlowActiveNode(node.id)}
                                              className={`p-3 rounded-xl text-left border transition-all ${
                                                businessFlowActiveNode === node.id 
                                                  ? "bg-indigo-600 border-indigo-500 text-white" 
                                                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                                              }`}
                                            >
                                              <span className="text-xs font-bold block">{node.label}</span>
                                            </button>
                                          ))}
                                        </div>

                                        <button
                                          onClick={() => {
                                            if (businessFlowActiveNode === "ret") {
                                              setExerciseStatus("success");
                                              setExerciseFeedback("Correct! Retention cohort repeats are key to organic compounding loops.");
                                            } else {
                                              setExerciseStatus("failure");
                                              setExerciseFeedback("Funnel error: That node controls incoming streams, not cohort loops.");
                                            }
                                          }}
                                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors"
                                        >
                                          Submit Funnel Theory
                                        </button>
                                      </div>
                                    )}

                                    {/* 5. Math Geometry Plot */}
                                    {canvasType === "math" && (
                                      <div className="space-y-3">
                                        <div className="space-y-1">
                                          <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest block font-mono">Steep Slope Regression</span>
                                          <h4 className="text-xs font-bold text-slate-300">Calibrate the slope (m) to exactly 2:</h4>
                                        </div>

                                        <div className="space-y-1 bg-slate-900 p-4 rounded-xl border border-slate-800">
                                          <div className="flex justify-between text-xs text-slate-400 font-mono">
                                            <span>Flat (m=0)</span>
                                            <span className="text-indigo-400 font-bold">Steep Positive (m=2)</span>
                                          </div>
                                          <input
                                            type="range"
                                            min="-2"
                                            max="2"
                                            step="1"
                                            value={mathSlope}
                                            onChange={(e) => setMathSlope(parseInt(e.target.value))}
                                            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                          />
                                          <div className="flex justify-between text-xs font-bold px-1 font-mono mt-1">
                                            <span className={mathSlope === -2 ? "text-indigo-400" : "text-slate-600"}>m = -2</span>
                                            <span className={mathSlope === 0 ? "text-indigo-400" : "text-slate-600"}>m = 0</span>
                                            <span className={mathSlope === 2 ? "text-indigo-400" : "text-slate-600"}>m = 2</span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => {
                                            if (mathSlope === 2) {
                                              setExerciseStatus("success");
                                              setExerciseFeedback("Plotted successfully! Positive steep angle achieved.");
                                            } else {
                                              setExerciseStatus("failure");
                                              setExerciseFeedback("Slope angle is flat or negative. Set m value to 2.");
                                            }
                                          }}
                                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors"
                                        >
                                          Regression Line Plot
                                        </button>
                                      </div>
                                    )}

                                    {/* Feedback dialog */}
                                    {exerciseFeedback && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`p-4 rounded-xl border text-xs leading-relaxed ${
                                          exerciseStatus === "success" 
                                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" 
                                            : "bg-red-950/40 border-red-500/30 text-red-300"
                                        }`}
                                      >
                                        <p className="font-bold mb-1">{exerciseStatus === "success" ? "🎉 Stage Mastery Gained!" : "🤔 Core Feedback"}</p>
                                        <p>{exerciseFeedback}</p>
                                        
                                        {exerciseStatus === "success" && (
                                          <button
                                            onClick={handleNextLesson}
                                            className="mt-3 px-4 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-indigo-400 font-bold active:scale-95 transition-transform"
                                          >
                                            Unlock Stage {currentConceptIndex + 2} Syllabus →
                                          </button>
                                        )}
                                      </motion.div>
                                    )}

                                  </div>
                                ) : (
                                  /* STANDARD LEARN MODE SIMULATORS (Desktop Interactive visual canvas viewports) */
                                  <div className="space-y-4">
                                    
                                    {/* 1. HTML Builder */}
                                    {canvasType === "html" && (
                                      <div className="space-y-4">
                                        <span className="text-[9px] font-mono text-indigo-300 block tracking-wider">LIVE EMBEDDED RENDER FRAME (IFRAME SIMULATOR)</span>
                                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                          <div dangerouslySetInnerHTML={{ __html: htmlLiveCode }} />
                                        </div>
                                        <div className="flex gap-2 justify-center shrink-0">
                                          <button 
                                            onClick={() => setHtmlLiveCode(`<!-- Purple Premium Block -->
<div class="p-6 bg-purple-950 text-white rounded-2xl shadow-2xl text-center border-2 border-purple-500/50">
  <h1 class="text-2xl font-black text-purple-200">Interactive Purple Canvas</h1>
  <p class="text-xs text-purple-300 mt-2">Nesting blocks and changing colors dynamically using Tailwind utility classes.</p>
</div>`)}
                                            className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl hover:text-white transition-colors"
                                          >
                                            🎨 Apply Deep Violet Theme
                                          </button>
                                          <button 
                                            onClick={() => setHtmlLiveCode(`<!-- Emerald Alert Box -->
<div class="p-5 bg-emerald-950 text-white rounded-2xl border border-emerald-400/50 flex items-center gap-3">
  <span class="text-2xl">⚡</span>
  <div class="text-left">
    <h3 class="font-extrabold text-xs text-emerald-200">Flexible Alert Container</h3>
    <p class="text-[10px] text-slate-300">Dynamic node elements nested safely within a layout.</p>
  </div>
</div>`)}
                                            className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl hover:text-white transition-colors"
                                          >
                                            ⚡ Build Styled Alert
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* 2. Python compiler Loop trace */}
                                    {canvasType === "programming" && (
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-mono text-indigo-300 tracking-wider">PYTHON EXECUTION LINE TRACER</span>
                                          <button
                                            onClick={() => {
                                              if (codeExecutionLine < 5) {
                                                setCodeExecutionLine(prev => prev + 1);
                                              } else {
                                                setCodeExecutionLine(1);
                                              }
                                            }}
                                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                                          >
                                            <Play className="w-3 h-3" /> Execute Step
                                          </button>
                                        </div>
                                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs space-y-1">
                                          {[
                                            "1: numbers = [1, 2, 3]",
                                            "2: squared = []",
                                            "3: for n in numbers:",
                                            "4:     squared.append(n ** 2)",
                                            "5: print(squared)  # output console"
                                          ].map((line, idx) => (
                                            <div 
                                              key={idx} 
                                              className={`py-1 px-2.5 rounded transition-colors flex items-center justify-between ${
                                                codeExecutionLine === idx + 1 ? "bg-indigo-950/60 text-indigo-300 border-l-2 border-indigo-500 font-bold" : "text-slate-400"
                                              }`}
                                            >
                                              <span>{line}</span>
                                              {codeExecutionLine === idx + 1 && (
                                                <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.2 rounded text-indigo-400 font-sans">Active</span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-xs font-mono text-emerald-400">
                                          <span className="text-slate-500 mr-2">Tracer Output Logs:</span>
                                          {codeExecutionLine >= 1 && <span className="mr-2">Memory: numbers=[1,2,3].</span>}
                                          {codeExecutionLine >= 2 && <span className="mr-2">Memory: squared=[].</span>}
                                          {codeExecutionLine >= 3 && <span className="mr-2">Status: Loop Init.</span>}
                                          {codeExecutionLine >= 4 && <span className="mr-2">Status: Append Squared.</span>}
                                          {codeExecutionLine >= 5 && <span className="text-white block font-bold mt-2">Stdout: [1, 4, 9]</span>}
                                        </div>
                                      </div>
                                    )}

                                    {/* 3. Science Bohr shell */}
                                    {canvasType === "science" && (
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-mono text-indigo-300 tracking-wider">ATOMIC PARTICLE ORBITS</span>
                                          <button 
                                            onClick={() => {
                                              setPhysicsMass(3);
                                              speakAIResponseText("Exciting electron. Releasing energy photon wave.");
                                            }}
                                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                                          >
                                            Stimulate (n=3)
                                          </button>
                                        </div>

                                        <div className="relative w-full h-[150px] bg-slate-900 rounded-xl border border-slate-850 flex items-center justify-center overflow-hidden">
                                          <svg className="w-full h-full" viewBox="0 0 200 120">
                                            <circle cx="100" cy="60" r="12" fill="#4338ca" className="animate-pulse" />
                                            <circle cx="100" cy="60" r="4" fill="#818cf8" />
                                            
                                            <circle cx="100" cy="60" r="22" fill="none" stroke="#334155" strokeWidth="1" />
                                            <circle cx="100" cy="60" r="38" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                                            <circle cx="100" cy="60" r="54" fill="none" stroke="#334155" strokeWidth="1" />

                                            <text x="100" y="32" fill="#475569" fontSize="6" textAnchor="middle" fontFamily="monospace">n=1</text>
                                            <text x="100" y="16" fill="#475569" fontSize="6" textAnchor="middle" fontFamily="monospace">n=2</text>
                                            <text x="100" y="2" fill="#475569" fontSize="6" textAnchor="middle" fontFamily="monospace">n=3</text>

                                            {physicsMass === 1 && <circle cx="100" cy="38" r="4" fill="#a855f7" className="animate-bounce" />}
                                            {physicsMass === 2 && <circle cx="100" cy="22" r="4" fill="#e9d5ff" />}
                                            {physicsMass === 3 && (
                                              <g>
                                                <circle cx="100" cy="6" r="4.5" fill="#38bdf8" />
                                                <path d="M 100 6 Q 120 16, 140 6 T 180 6" fill="none" stroke="#06b6d4" strokeWidth="1" />
                                              </g>
                                            )}
                                          </svg>
                                        </div>
                                      </div>
                                    )}

                                    {/* 4. Business flow */}
                                    {canvasType === "business" && (
                                      <div className="space-y-4">
                                        <span className="text-[9px] font-mono text-indigo-300 block tracking-wider">PRODUCT FUNNEL RETENTION COHORTS</span>
                                        <div className="grid grid-cols-5 gap-2">
                                          {[
                                            { id: "acquisition", label: "Acquire", emoji: "📢" },
                                            { id: "activation", label: "Activate", emoji: "⚡" },
                                            { id: "retention", label: "Retain", emoji: "🔄" },
                                            { id: "referral", label: "Refer", emoji: "🗣" },
                                            { id: "revenue", label: "Revenue", emoji: "💰" }
                                          ].map((node) => (
                                            <button
                                              key={node.id}
                                              onClick={() => setBusinessFlowActiveNode(node.id)}
                                              className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                                                businessFlowActiveNode === node.id 
                                                  ? "bg-indigo-950 border-indigo-500 text-indigo-300 scale-105 shadow-md" 
                                                  : "bg-slate-900 border border-slate-800 text-slate-500"
                                              }`}
                                            >
                                              <span className="text-xl">{node.emoji}</span>
                                              <span className="text-[9px] font-bold mt-1.5 truncate max-w-full">{node.label}</span>
                                            </button>
                                          ))}
                                        </div>

                                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                                          {businessFlowActiveNode === "acquisition" && (
                                            <p className="text-xs text-slate-300 leading-normal">Top funnel marketing channels focused on driving quality target traffic cohorts.</p>
                                          )}
                                          {businessFlowActiveNode === "activation" && (
                                            <p className="text-xs text-slate-300 leading-normal">Onboarding optimization elements. Assures prompts yield an active Aha! Moment.</p>
                                          )}
                                          {businessFlowActiveNode === "retention" && (
                                            <p className="text-xs text-indigo-300 font-semibold leading-normal">Compound Cohort loops: Retaining usage frequencies via progress timelines.</p>
                                          )}
                                          {businessFlowActiveNode === "referral" && (
                                            <p className="text-xs text-slate-300 leading-normal">Word-of-mouth shared coefficient factors that decrease client acquisition cost (CAC).</p>
                                          )}
                                          {businessFlowActiveNode === "revenue" && (
                                            <p className="text-xs text-slate-300 leading-normal">Stabilizing lifetime value (LTV) through progressive value unlocks.</p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* 5. Math Coordinate plot */}
                                    {canvasType === "math" && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-slate-400">
                                              <span>Slope (m)</span>
                                              <span className="text-indigo-400">{mathSlope}</span>
                                            </div>
                                            <input 
                                              type="range" min="-3" max="3" step="1" 
                                              value={mathSlope} onChange={(e) => setMathSlope(parseInt(e.target.value))} 
                                              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-slate-400">
                                              <span>Y-Intercept (c)</span>
                                              <span className="text-indigo-400">{mathIntercept}</span>
                                            </div>
                                            <input 
                                              type="range" min="-5" max="5" step="1" 
                                              value={mathIntercept} onChange={(e) => setMathIntercept(parseInt(e.target.value))} 
                                              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                          </div>
                                        </div>

                                        <div className="relative w-full h-[150px] bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                                          <svg className="w-full h-full" viewBox="0 0 200 120">
                                            <line x1="0" y1="60" x2="200" y2="60" stroke="#1e293b" strokeWidth="1" />
                                            <line x1="100" y1="0" x2="100" y2="120" stroke="#1e293b" strokeWidth="1" />
                                            
                                            <line 
                                              x1="20" 
                                              y1={`${60 - (mathSlope * -40 + (mathIntercept * 5))}`} 
                                              x2="180" 
                                              y2={`${60 - (mathSlope * 40 + (mathIntercept * 5))}`} 
                                              stroke="#6366f1" 
                                              strokeWidth="2.5" 
                                              className="transition-all duration-300" 
                                            />
                                            
                                            <rect x="5" y="5" width="80" height="20" rx="4" fill="#020617" opacity="0.8" />
                                            <text x="10" y="17" fill="#818cf8" fontSize="8" fontFamily="monospace">y = {mathSlope}x + ({mathIntercept})</text>
                                          </svg>
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                )}
                              </div>

                              {/* Footer guide inside Column 2 */}
                              <div className="text-[10px] text-slate-500 text-center pt-3 border-t border-slate-800/40 shrink-0">
                                Click or drag components above to dynamically compile.
                              </div>

                            </div>

                          </div>
                        </div>
                      )}

                    </div>

                    {/* RIGHT COLUMN (INTERACTIVE AI TEACHER CONVERSATION PANEL OR LEARNING PROFILE) */}
                    <div className="w-72 bg-slate-50 p-5 flex flex-col justify-between shrink-0 h-full">
                      {appState === "topic_selection" ? (
                        /* Learning Profile Panel */
                        <div className="space-y-6 flex flex-col h-full justify-between">
                          <div className="space-y-6">
                            <div className="border-b border-slate-200 pb-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Session Profile</span>
                              <h3 className="text-sm font-black text-slate-800">Your Learning Persona</h3>
                            </div>

                            {/* Learning Profile indicators */}
                            <div className="space-y-4">
                              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Topic</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">✨</span>
                                  <span className="text-xs font-black text-slate-800 truncate">{creationTopic || "Not Selected"}</span>
                                </div>
                              </div>

                              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Academic Goal</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">💼</span>
                                  <span className="text-xs font-bold text-slate-750 truncate">{creationGoal || "Awaiting choice..."}</span>
                                </div>
                              </div>

                              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Pacing Skill Level</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">⚡️</span>
                                  <span className="text-xs font-bold text-slate-700 truncate">{creationLevel || "Awaiting choice..."}</span>
                                </div>
                              </div>

                              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Concept Absorption</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">🎨</span>
                                  <span className="text-xs font-bold text-slate-700 truncate">{creationPreference || "Awaiting choice..."}</span>
                                </div>
                              </div>

                              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Time Commitment</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-base">⏳</span>
                                  <span className="text-xs font-bold text-slate-700 truncate">{creationTime || "Awaiting choice..."}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-center text-[10px] text-slate-400">
                            Oxford Teaching Framework v3.6
                          </div>
                        </div>
                      ) : (
                        /* STANDARD RIGHT SIDEBAR CONVERSATION */
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex flex-col flex-1 overflow-hidden">
                            {/* AI Avatar */}
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-3 shrink-0">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-indigo-200 bg-white shadow-sm">
                                <img
                                  src="/images/ai_teacher_mentor.jpg"
                                  alt="AI Mentor Avatar"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">Your AI Mentor</h4>
                                <p className="text-[10px] text-slate-400">Continuous cognitive feedback</p>
                              </div>
                            </div>

                            {/* Chat Bubbles */}
                            {appState === "classroom" ? (
                              /* CLASSROOM CHAT */
                              <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3 scrollbar-none">
                                {chatMessages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex flex-col max-w-[90%] ${
                                      msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                    }`}
                                  >
                                    <div
                                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.sender === "user"
                                          ? "bg-indigo-600 text-white rounded-tr-none"
                                          : "bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm"
                                      }`}
                                    >
                                      {msg.text}
                                    </div>

                                    {msg.visualRepresentation && (
                                      <div className="w-full mt-2 bg-slate-900 rounded-xl p-3 text-white border border-slate-800 shadow-md">
                                        <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                          <Sparkles className="w-3 h-3" /> Live Concept Flow: {msg.visualRepresentation.title}
                                        </p>
                                        <div className="relative w-full h-[150px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            {msg.visualRepresentation.edges.map((edge, idx) => {
                                              const fromNode = msg.visualRepresentation?.nodes.find((n) => n.id === edge.from);
                                              const toNode = msg.visualRepresentation?.nodes.find((n) => n.id === edge.to);
                                              if (!fromNode || !toNode) return null;
                                              const x1 = (fromNode.x / 600) * 100;
                                              const y1 = (fromNode.y / 200) * 100;
                                              const x2 = (toNode.x / 600) * 100;
                                              const y2 = (toNode.y / 200) * 100;
                                              return (
                                                <line
                                                  key={idx}
                                                  x1={`${x1}%`}
                                                  y1={`${y1}%`}
                                                  x2={`${x2}%`}
                                                  y2={`${y2}%`}
                                                  stroke="#475569"
                                                  strokeWidth="1.5"
                                                  strokeDasharray="4 4"
                                                />
                                              );
                                            })}
                                          </svg>
                                          {msg.visualRepresentation.nodes.map((node) => {
                                            const leftVal = (node.x / 600) * 100;
                                            const topVal = (node.y / 200) * 100;
                                            return (
                                              <div
                                                key={node.id}
                                                className="absolute px-2 py-0.5 rounded text-[9px] font-bold border transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                                style={{
                                                  left: `${leftVal}%`,
                                                  top: `${topVal}%`,
                                                  backgroundColor: `${node.color}15`,
                                                  borderColor: node.color,
                                                  color: node.color
                                                }}
                                              >
                                                {node.label}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {isChatLoading && (
                                  <div className="flex items-center gap-2 mr-auto max-w-[80%] bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                                    Mentor is illustrating...
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* DASHBOARD / STUDY BUDDY SIDEBAR CHAT */
                              <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3 scrollbar-none">
                                {sidebarChatMessages.map((msg, sidx) => (
                                  <div
                                    key={sidx}
                                    className={`flex flex-col max-w-[90%] ${
                                      msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                    }`}
                                  >
                                    <div
                                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.sender === "user"
                                          ? "bg-indigo-600 text-white rounded-tr-none"
                                          : "bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm"
                                      }`}
                                    >
                                      {msg.text}
                                    </div>
                                  </div>
                                ))}
                                {isSidebarChatLoading && (
                                  <div className="flex items-center gap-2 mr-auto max-w-[80%] bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                                    Thinking...
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Input form */}
                          {appState === "classroom" ? (
                            <form onSubmit={handleSendChatMessage} className="flex gap-2 shrink-0">
                              <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask anything, request diagrams..."
                                className="flex-1 bg-white border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-300"
                              />
                              <button
                                type="submit"
                                disabled={!chatInput.trim() || isChatLoading}
                                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </form>
                          ) : (
                            <form onSubmit={handleSendSidebarChatMessage} className="flex gap-2 shrink-0">
                              <input
                                type="text"
                                value={sidebarChatText}
                                onChange={(e) => setSidebarChatText(e.target.value)}
                                placeholder="Ask teacher about studies..."
                                className="flex-1 bg-white border border-slate-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-300"
                              />
                              <button
                                type="submit"
                                disabled={!sidebarChatText.trim() || isSidebarChatLoading}
                                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global CSS animation definitions */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
