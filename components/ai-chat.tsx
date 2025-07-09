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

export function AIChat({ inputs, currentScore }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: `Hello! I'm your AI Credit Advisor. I can see your current credit score is ${currentScore}. I'm here to help you understand your credit profile and suggest improvements. What would you like to know?`,
      timestamp: new Date(),
      suggestions: [
        "How can I improve my credit score?",
        "What factors are hurting my score?",
        "What if I pay off my loans early?",
        "How long will it take to reach 800?",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Simple rule-based responses (in production, this would use a real AI service)
    if (message.includes("improve") || message.includes("better")) {
      const suggestions = []
      if (inputs.creditUsage > 30) suggestions.push("reduce credit utilization below 30%")
      if (inputs.missedPayments > 0) suggestions.push("maintain perfect payment history")
      if (inputs.emi / inputs.income > 0.4) suggestions.push("consider reducing your debt-to-income ratio")

      return `Based on your profile, here are the top ways to improve your credit score: ${suggestions.join(", ")}. Focus on these areas for the biggest impact.`
    }

    if (message.includes("factors") || message.includes("hurting")) {
      const issues = []
      if (inputs.creditUsage > 50) issues.push("high credit utilization (currently " + inputs.creditUsage + "%)")
      if (inputs.missedPayments > 0) issues.push(inputs.missedPayments + " missed payments in the last year")
      if (inputs.activeLoans > 5) issues.push("too many active loans (" + inputs.activeLoans + ")")

      return issues.length > 0
        ? `The main factors negatively affecting your score are: ${issues.join(", ")}. Let's work on addressing these issues.`
        : "Your credit profile looks quite healthy! The main areas for improvement are maintaining low credit utilization and perfect payment history."
    }

    if (message.includes("pay off") || message.includes("early")) {
      const newEmi = Math.max(0, inputs.emi - 5000)
      const improvement = Math.floor((inputs.emi - newEmi) / 1000) * 10
      return `If you pay off some loans early, reducing your EMI from ₹${inputs.emi.toLocaleString()} to ₹${newEmi.toLocaleString()}, your credit score could improve by approximately ${improvement} points over 6-12 months.`
    }

    if (message.includes("800") || message.includes("excellent")) {
      const pointsNeeded = 800 - currentScore
      const timeEstimate = Math.ceil(pointsNeeded / 10) * 3 // Rough estimate: 10 points per 3 months
      return `To reach a score of 800, you need to improve by ${pointsNeeded} points. With consistent good practices, this could take approximately ${timeEstimate} months. Focus on keeping credit utilization below 10% and maintaining perfect payment history.`
    }

    if (message.includes("utilization")) {
      const currentUtilization = inputs.creditUsage
      const recommendedUtilization = Math.min(30, currentUtilization)
      return `Your current credit utilization is ${currentUtilization}%. For optimal credit scores, keep it below 30%, and ideally below 10%. If you can reduce it to ${recommendedUtilization}%, you could see a score improvement of 20-50 points.`
    }

    // Default response
    return `I understand you're asking about "${userMessage}". Based on your current profile (Score: ${currentScore}, Income: ₹${inputs.income.toLocaleString()}, EMI: ₹${inputs.emi.toLocaleString()}), I'd recommend focusing on reducing credit utilization and maintaining consistent payments. Would you like specific advice on any particular aspect?`
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

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        suggestions: [
          "Tell me more about this",
          "What other options do I have?",
          "How long will this take?",
          
        ],
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
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
            {/* Quick Actions */}
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

            {/* Chat Messages */}
            <ScrollArea className="h-96 w-full border rounded-lg p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }`}
                      >
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
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
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

      {/* Current Profile Summary */}
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
