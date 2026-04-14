"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative overflow-hidden h-screen w-full bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center justify-center">

      {/* 🔥 Floating glow effects */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-600 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* 🔥 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-6xl font-bold tracking-tight text-center"
      >
        Evalia AI
      </motion.h1>

      {/* 🔥 Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-gray-300 text-lg text-center max-w-xl"
      >
        AI that listens, evaluates, and understands how you teach — not just what you say.
      </motion.p>

      {/* 🔥 Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 px-8 py-4 rounded-xl text-lg font-semibold 
        bg-gradient-to-r from-purple-500 to-pink-500 
        hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] 
        transition duration-300 ease-in-out"
        onClick={() => window.location.href = "/interview"}
      >
        Start Interview →
      </motion.button>

      {/* 🔥 Small detail */}
      <p className="mt-6 text-sm text-gray-500">
        Powered by AI-driven evaluation engine
      </p>

    </main>
  );
}