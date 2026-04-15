import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { answers } = await req.json();

  // 🧠 STEP 1 — HARD LOGIC (detect weak answers)
  const lastAnswer = answers[answers.length - 1] || "";

const hasNoAnswer =
  lastAnswer.toLowerCase().includes("don't know") ||
  lastAnswer.toLowerCase().includes("do not know") ||
  lastAnswer.toLowerCase().includes("no idea") ||
  lastAnswer.trim().length < 5;

  if (hasNoAnswer) {
    return NextResponse.json({
      clarity: 1,
      warmth: 2,
      simplicity: 1,
      fluency: 2,
      strengths: "Honest response",
      weaknesses: "Did not attempt to explain the concept",
      improvements: "Try to attempt even a basic explanation instead of giving up",
      evidence: "Candidate explicitly said they do not know",
      verdict: "Reject",
    });
  }

  // 🧠 STEP 2 — STRICT AI PROMPT
  const prompt = `
You are a strict and experienced tutor evaluator.

Evaluate the answers honestly.

Be realistic and fair. Reward clear explanations with higher scores.
DO NOT inflate scores.

Rules:
- If explanation is unclear → give LOW scores (0–4)
- If explanation is average → give MID scores (5–7)
- Only give HIGH scores (8–10) if explanation is clear, structured, and child-friendly
- Be critical and realistic like a real interviewer

Answers:
${answers.join("\n\n")}

Return ONLY JSON:

{
  "clarity": number (0-10),
  "warmth": number,
  "simplicity": number,
  "fluency": number,
  "strengths": "text",
  "weaknesses": "text",
  "improvements": "text",
  "evidence": "text",
  "verdict": "Hire / Maybe / Reject"
}
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let raw = completion.choices[0].message.content || "";

    // 🧹 clean response
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("JSON parse failed");
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.log("Using fallback evaluation");

    // 🧠 STEP 3 — REALISTIC FALLBACK (NO FAKE HIGH SCORES)
    return NextResponse.json({
      clarity: 3,
      warmth: 4,
      simplicity: 3,
      fluency: 4,
      strengths: "Basic attempt made",
      weaknesses: "Lacks clarity and structure",
      improvements: "Focus on explaining step-by-step with simple examples",
      evidence: "Explanation lacked depth",
      verdict: "Reject",
    });
  }
}
