"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { CreditInputs } from "@/lib/credit-score-calculator"
import { parseNaturalLanguageInput } from "@/lib/natural-language-parser"
import { Send, Sparkles } from "lucide-react"

interface NaturalLanguageInputProps {
  onInputParsed: (inputs: Partial<CreditInputs>) => void
}

export function NaturalLanguageInput({ onInputParsed }: NaturalLanguageInputProps) {
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastParsed, setLastParsed] = useState<Partial<CreditInputs> | null>(null)

  const handleSubmit = async () => {
    if (!input.trim()) return

    setIsProcessing(true)
    try {
      const parsed = parseNaturalLanguageInput(input)
      setLastParsed(parsed)
      onInputParsed(parsed)
      setInput("")
    } catch (error) {
      console.error("Error parsing input:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const examples = [
    "I earn ₹75,000 monthly with ₹20,000 EMI and 2 missed payments",
    "My income is 50K, credit usage 40%, and 3 active loans",
    "I have 5 years credit history with 25% utilization",
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Describe your financial situation... (e.g., 'I earn ₹50K monthly with 2 EMIs and good payment history')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 min-h-[80px]"
        />
        <Button onClick={handleSubmit} disabled={!input.trim() || isProcessing} className="self-end">
          {isProcessing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>

      {lastParsed && Object.keys(lastParsed).length > 0 && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200 mb-2">Parsed the following values:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(lastParsed).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="bg-green-100 dark:bg-green-800">
                {key}: {typeof value === "number" ? value.toLocaleString() : value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInput(example)}
              className="text-xs h-auto py-2 px-3 whitespace-normal text-left"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
