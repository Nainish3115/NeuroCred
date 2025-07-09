"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CreditInputs } from "@/lib/credit-score-calculator"
import { Send, Bot, User, Lightbulb, TrendingUp, AlertCircle } from "lucide-react"

interface AIChatProps {
  inputs: CreditInputs
  currentScore: number
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

// List of credit-relevant keywords
const creditKeywords = [
  "credit score", "loan", "emi", "credit usage", "missed payments","Best strategy",
  "income", "cibil", "credit report", "debt", "repayment", "financial profile", "fico",
  "credit card", "credit limit", "payment history", "late fees", "credit bureau",
  "account age", "credit inquiry", "hard inquiry", "soft inquiry", "financial discipline",
  "secured loan", "unsecured loan", "creditworthiness", "loan default", "credit monitoring","How can I improve my credit score?",
      "What factors are hurting my score?",
      "What if I pay off my loans early?",
      "How long will it take to reach 800?",
]

function isCreditScoreRelated(message: string): boolean {
  const lower = message.toLowerCase()
  return creditKeywords.some(keyword => lower.includes(keyword))
}

export function AIChat({ inputs, currentScore }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "1",
    type: "ai",
    content: `Hello! I'm your AI Credit Advisor. I can see your current credit score is ${currentScore}. I'm here to help you understand your credit profile and suggest improvements. What would you like to know?`,
    timestamp: new Date(),
    
  }])

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

 const generateAIResponse = async (userMessage: string): Promise<string> => {
  const res = await fetch("/api/credit-advisor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage, inputs, currentScore }),
  })

  const data = await res.json()

  const cleaned = data.reply
    .replace(/\*\*/g, "") // remove bold (**bold**)
    .replace(/\*/g, "") // remove any leftover bullet markers
    .replace(/\d+\.\s*/g, (match: any) => `\n${match}`) // each numbered point on a new line
    .replace(/-\s+/g, "   - ") // indent sub-points
    .trim()

  return cleaned
}

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    let replyText = ""

    if (isCreditScoreRelated(inputMessage)) {
      replyText = await generateAIResponse(inputMessage)
    } else {
      replyText = "I'm focused on helping you with your credit score and financial health. Try asking about credit usage, EMI, missed payments, or loan strategies."
    }

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: replyText,
      timestamp: new Date(),
      
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const quickActions = [
    { icon: TrendingUp, text: "Improve Score", query: "How can I improve my credit score quickly?" },
    { icon: AlertCircle, text: "Risk Factors", query: "What factors are hurting my credit score?" },
    { icon: Lightbulb, text: "Best Strategy", query: "What is the best strategy for my situation?" },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            AI Credit Advisor
          </CardTitle>
          <CardDescription>Get personalized advice based on your credit profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(action.query)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {action.text}
                  </Button>
                )
              })}
            </div>

            <ScrollArea className="h-96 w-full border rounded-lg p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-lg p-3 ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}>
                        <p className="text-sm">{message.content}</p>
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-auto p-1 text-left justify-start w-full hover:bg-white/10"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about your credit score..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Your Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentScore}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Credit Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{inputs.income.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Income</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{inputs.creditUsage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Credit Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
