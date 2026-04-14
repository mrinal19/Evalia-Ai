"use client";

import { useEffect, useState } from "react";

export default function Results() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("result");
    const past = localStorage.getItem("history");

    if (stored) setData(JSON.parse(stored));
    if (past) setHistory(JSON.parse(past));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-lg">Evaluating candidate...</p>
      </div>
    );
  }

  const confidence = Math.round(
    ((data.clarity || 0) +
      (data.warmth || 0) +
      (data.fluency || 0)) / 3
  );

  const overallScore = Math.round(
    ((data.clarity || 0) +
      (data.warmth || 0) +
      (data.simplicity || 0) +
      (data.fluency || 0)) / 4
  );

  const scores = [
    { label: "Clarity", value: data.clarity },
    { label: "Warmth", value: data.warmth },
    { label: "Simplicity", value: data.simplicity },
    { label: "Fluency", value: data.fluency },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* 🔥 HEADER */}
      <h1 className="text-4xl text-center mb-10 font-bold">
        Candidate Evaluation Dashboard
      </h1>

      {/* 🔥 MAIN CARD */}
      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-2xl shadow-lg">

        {/* Verdict + Score */}
        <div className="flex justify-between items-center mb-6">
          <span
            className={`px-5 py-2 rounded-full font-semibold ${
              data.verdict === "Hire"
                ? "bg-green-600"
                : data.verdict === "Reject"
                ? "bg-red-600"
                : "bg-yellow-500"
            }`}
          >
            {data.verdict}
          </span>

          <span className="text-xl font-bold">
            Overall Score: {overallScore}/10
          </span>
        </div>

        {/* Confidence */}
        <p className="text-purple-400 mb-6">
          Confidence Score: {confidence}%
        </p>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          {scores.map((s, i) => (
            <div key={i} className="bg-black p-4 rounded-lg">
              <p className="text-sm mb-1">{s.label}</p>
              <p className="text-lg font-bold">{s.value}/10</p>

              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${s.value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-semibold">Strengths</h3>
            <p className="text-gray-300">{data.strengths}</p>
          </div>

          <div>
            <h3 className="font-semibold">Weaknesses</h3>
            <p className="text-gray-300">{data.weaknesses}</p>
          </div>

          <div>
            <h3 className="font-semibold">Improvement Plan</h3>
            <p className="text-gray-300">{data.improvements}</p>
          </div>

          <div>
            <h3 className="font-semibold">Evidence</h3>
            <p className="italic text-gray-400">
              "{data.evidence}"
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 HISTORY SECTION */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl mb-4">Past Attempts</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No previous attempts</p>
        ) : (
          <div className="space-y-3">
            {history.slice().reverse().map((item, i) => (
              <div
                key={i}
                className="bg-gray-800 p-4 rounded-lg flex justify-between"
              >
                <span>
                  Attempt #{history.length - i}
                </span>

                <span
                  className={`${
                    item.verdict === "Hire"
                      ? "text-green-400"
                      : item.verdict === "Reject"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {item.verdict}
                </span>

                <span>{item.clarity}/10</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 ACTION BUTTON */}
      <div className="text-center mt-10">
        <button
          onClick={() => (window.location.href = "/interview")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg hover:scale-105 transition"
        >
          Retake Interview
        </button>
      </div>

    </div>
  );
}