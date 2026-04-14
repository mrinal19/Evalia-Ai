"use client";

import { useState, useEffect, useRef } from "react";

export default function Interview() {
  const [displayedText, setDisplayedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [questions, setQuestions] = useState<string[]>([
    "Explain fractions to a 10-year-old.",
  ]);

  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // ✅ ALWAYS SAFE
const currentQuestion =
  typeof questions[step] === "string"
    ? questions[step]
    : "";
  // ✨ Typing animation (SAFE)
  useEffect(() => {
  // 🛑 HARD STOP if invalid
  if (!currentQuestion || typeof currentQuestion !== "string") {
    setDisplayedText("Thinking...");
    return;
  }

  let i = 0;

  if (intervalRef.current) clearInterval(intervalRef.current);

  intervalRef.current = setInterval(() => {
    i++;

    // 🛑 EXTRA SAFETY
    if (typeof currentQuestion !== "string") {
      setDisplayedText("Thinking...");
      return;
    }

    setDisplayedText(currentQuestion.slice(0, i));

    if (i >= currentQuestion.length) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, 30);

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [currentQuestion]);
  // 🔊 Voice (NO repetition)
  useEffect(() => {
    if (!currentQuestion) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(currentQuestion);
    speech.rate = 0.85;

    const timeout = setTimeout(() => {
      window.speechSynthesis.speak(speech);
    }, 300);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [currentQuestion]);

  // ⏱️ Timer
  useEffect(() => {
    setTimeLeft(60);
  }, [step]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // 🎤 Voice input
  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  // 🤖 Generate next question
  const generateNextQuestion = async (answers: string[]) => {
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const text = await res.text();
      console.log("AI QUESTION RAW:", text);

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      return (
        data.question ||
        "Can you explain that in a simpler way with an example?"
      );
    } catch {
      return "Can you explain that in a simpler way with an example?";
    }
  };

  // 🚀 Main flow (CLEAN + NO RACE CONDITION)
  const handleNext = async () => {
    if (!answer.trim()) {
      alert("Please answer before moving ahead 😊");
      return;
    }

    const updatedAnswers = [...allAnswers, answer];
    setAllAnswers(updatedAnswers);
    setAnswer("");

    // 🔥 QUESTION FLOW (FIXED PROPERLY)
    if (step < 2) {
      setDisplayedText("Thinking...");

      let nextQ = await generateNextQuestion(updatedAnswers);

      // 🛑 Ensure valid + unique
      if (
        !nextQ ||
        nextQ.trim().length < 5 ||
        questions.includes(nextQ)
      ) {
        const fallback = [
          "Can you give a real-life example?",
          "How would you explain this to a weaker student?",
          "Can you simplify this further?",
        ];

        nextQ =
          fallback[Math.floor(Math.random() * fallback.length)];
      }

      // ✅ FIRST update questions
      setQuestions((prev) => [...prev, nextQ]);

      // ✅ THEN move step (NO timeout hack needed now)
      setStep((prev) => prev + 1);

      return;
    }

    // 🔥 FINAL SUBMIT
    setLoading(true);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });

      const text = await res.text();

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {
          clarity: 5,
          warmth: 5,
          simplicity: 5,
          fluency: 5,
          strengths: "Basic attempt made",
          weaknesses: "Lacks clarity",
          evidence: "Generic explanation",
          verdict: "Maybe",
        };
      }

      localStorage.setItem("result", JSON.stringify(data));

      const history = JSON.parse(localStorage.getItem("history") || "[]");
      history.push(data);
      localStorage.setItem("history", JSON.stringify(history));

      window.location.href = "/results";

    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="bg-gray-900 p-8 rounded-2xl max-w-xl w-full shadow-lg">

        <p className="text-sm text-purple-400 mb-2">
          Evalia AI • Your Interviewer
        </p>

        <p className="text-gray-400 text-sm mb-2">
          Take your time. Explain as if you're teaching a child.
        </p>

        <p className="text-sm text-red-400 mb-2">
          ⏱️ Time left: {timeLeft}s
        </p>

        <h2 className="text-xl mb-6 min-h-[60px]">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h2>

        <textarea
          className="w-full p-4 bg-black border border-gray-700 rounded-lg"
          rows={4}
          placeholder="Type your answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button
          onClick={startListening}
          className="mt-3 w-full border border-purple-500 py-2 rounded-lg hover:bg-purple-600"
        >
          {listening ? "Listening..." : "🎤 Speak Answer"}
        </button>

        <button
          onClick={handleNext}
          className="mt-5 w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg"
        >
          {step === 2
            ? loading
              ? "Evaluating..."
              : "Finish Interview"
            : "Next Question →"}
        </button>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Question {step + 1} of 3
        </p>
      </div>
    </div>
  );
}