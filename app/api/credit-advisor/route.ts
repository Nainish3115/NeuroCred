import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define keywords related to credit topics
const creditKeywords = [
  "credit score", "loan", "emi", "credit usage", "missed payments","Best strategy",
  "income", "cibil", "credit report", "debt", "repayment", "financial profile", "fico",
  "credit card", "credit limit", "payment history", "late fees", "credit bureau",
  "account age", "credit inquiry", "hard inquiry", "soft inquiry", "secured loan",
  "unsecured loan", "creditworthiness", "loan default", "credit monitoring","How can I improve my credit score?",
  "What factors are hurting my score?","What if I pay off my loans early?","How long will it take to reach 800?",
];

// Function to check if a message is credit-related
function isCreditScoreRelated(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return creditKeywords.some(keyword => lowerMessage.includes(keyword));
}

export async function POST(req: NextRequest) {
  const { message, inputs, currentScore } = await req.json();

  // Filter out unrelated queries
  if (!isCreditScoreRelated(message)) {
    return NextResponse.json({
      reply: "I'm here to help only with credit score and related financial topics. Please ask something related to your credit profile."
    });
  }

  // Prompt for OpenAI
  const userPrompt = `
You are a financial advisor AI helping a user understand and improve their credit score.
Here is the user's profile:
- Credit Score: ${currentScore}
- Income: ₹${inputs.income}
- EMI: ₹${inputs.emi}
- Credit Usage: ${inputs.creditUsage}%
- Missed Payments: ${inputs.missedPayments}
- Credit History Age: ${inputs.creditHistoryAge} months
- Active Loans: ${inputs.activeLoans}

User asked: "${message}"
`;

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful AI credit advisor." },
      { role: "user", content: userPrompt },
    ],
  });

  const reply = completion.choices[0]?.message.content || "Sorry, I couldn't process that.";

  return NextResponse.json({ reply });
}
