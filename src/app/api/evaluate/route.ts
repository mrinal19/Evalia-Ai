import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answers } = await req.json();

  const lastAnswer = answers[answers.length - 1]?.toLowerCase() || "";

  // ❌ BAD ANSWER CONDITIONS
  const isBad =
    lastAnswer.includes("don't know") ||
    lastAnswer.includes("do not know") ||
    lastAnswer.includes("no idea") ||
    lastAnswer.length < 20;

  // ✅ GOOD ANSWER CONDITIONS
  const isGood =
    lastAnswer.includes("example") ||
    lastAnswer.includes("imagine") ||
    lastAnswer.includes("pizza") ||
    lastAnswer.includes("chocolate") ||
    lastAnswer.length > 80;

  // 🎯 FINAL DECISION
  if (isBad) {
    return NextResponse.json({
      clarity: 2,
      warmth: 3,
      simplicity: 2,
      fluency: 2,
      strengths: "Shows honesty",
      weaknesses: "Lacks explanation and clarity",
      improvements: "Try explaining with examples",
      evidence: "Very short or unclear answer",
      verdict: "Reject",
    });
  }

  if (isGood) {
    return NextResponse.json({
      clarity: 9,
      warmth: 8,
      simplicity: 9,
      fluency: 8,
      strengths: "Clear, simple, and example-based explanation",
      weaknesses: "Could add more variety in examples",
      improvements: "Try adding one more real-life example",
      evidence: "Used relatable explanation with structured flow",
      verdict: "Hire",
    });
  }

  // ⚖️ MID CASE
  return NextResponse.json({
    clarity: 6,
    warmth: 6,
    simplicity: 6,
    fluency: 6,
    strengths: "Basic understanding shown",
    weaknesses: "Lacks depth and examples",
    improvements: "Add real-life examples and structure",
    evidence: "Partial explanation",
    verdict: "Maybe",
  });
}
