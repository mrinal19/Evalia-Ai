import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { answers } = await req.json();

  const prompt = `
You are an elite tutor evaluator with 10+ years of experience.

You are calm, sharp, observant, and slightly strict.

Your job:
- Evaluate the candidate silently
- Detect weak explanations, lack of clarity, or fluff
- Reward strong, structured, child-friendly teaching
- Adjust your behavior dynamically

Conversation so far:
${answers.join("\n\n")}

Instructions:

1. Internally classify LAST answer as:
   - "weak" (confusing, vague, no structure)
   - "average" (okay but lacks depth/examples)
   - "strong" (clear, structured, child-friendly)

2. Based on that:

IF WEAK:
- Ask simpler, probing, slightly challenging question
- Push them to clarify
- Tone: slightly strict but not rude

IF AVERAGE:
- Ask improvement-based question
- Push for examples or clarity

IF STRONG:
- Ask deeper or real-world scenario question
- Increase difficulty

3. Rules:
- Ask ONLY ONE question
- Keep it natural (1–2 lines)
- DO NOT sound like AI
- DO NOT repeat previous questions
- Make it feel like a real human interviewer

Return ONLY JSON:

{
  "question": "your question"
}
`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let text = completion.choices[0].message.content || "";

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        question:
          "That wasn’t very clear. Can you explain it more simply?",
      });
    }
  } catch (err) {
    return NextResponse.json({
      question:
        "Can you explain that in a simpler way with an example?",
    });
  }
}