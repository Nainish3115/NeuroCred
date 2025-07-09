"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { calculateCreditScore, type CreditInputs } from "@/lib/credit-score-calculator"
import { Target } from "lucide-react"

interface ScoreProjectionProps {
  inputs: CreditInputs
  currentScore: number
}

export function ScoreProjection({ inputs, currentScore }: ScoreProjectionProps) {
  // Generate projection data for different scenarios
  const generateProjectionData = () => {
    const months = 24
    const data = []

    // Conservative scenario (minimal improvements)
    const conservativeData = []
    // Optimistic scenario (good improvements)
    const optimisticData = []
    // Aggressive scenario (maximum improvements)
    const aggressiveData = []

    for (let i = 0; i <= months; i++) {
      const month = i

      // Conservative: Slow improvement
      const conservativeInputs = {
        ...inputs,
        missedPayments: Math.max(0, inputs.missedPayments - Math.floor(i / 6)),
        creditUsage: Math.max(10, inputs.creditUsage - i * 0.5),
        creditHistoryAge: inputs.creditHistoryAge + i,
      }
      const conservativeScore = calculateCreditScore(conservativeInputs).score

      // Optimistic: Moderate improvement
      const optimisticInputs = {
        ...inputs,
        missedPayments: Math.max(0, inputs.missedPayments - Math.floor(i / 3)),
        creditUsage: Math.max(10, inputs.creditUsage - i * 1),
        creditHistoryAge: inputs.creditHistoryAge + i,
        emi: Math.max(0, inputs.emi - i * 200),
      }
      const optimisticScore = calculateCreditScore(optimisticInputs).score

      // Aggressive: Fast improvement
      const aggressiveInputs = {
        ...inputs,
        missedPayments: i >= 3 ? 0 : inputs.missedPayments,
        creditUsage: Math.max(5, inputs.creditUsage - i * 2),
        creditHistoryAge: inputs.creditHistoryAge + i,
        emi: Math.max(0, inputs.emi - i * 500),
      }
      const aggressiveScore = calculateCreditScore(aggressiveInputs).score

      data.push({
        month: `Month ${i}`,
        monthNum: i,
        conservative: conservativeScore,
        optimistic: optimisticScore,
        aggressive: aggressiveScore,
      })
    }

    return data
  }

  const projectionData = generateProjectionData()
  const finalScores = {
    conservative: projectionData[projectionData.length - 1].conservative,
    optimistic: projectionData[projectionData.length - 1].optimistic,
    aggressive: projectionData[projectionData.length - 1].aggressive,
  }

  const improvements = {
    conservative: finalScores.conservative - currentScore,
    optimistic: finalScores.optimistic - currentScore,
    aggressive: finalScores.aggressive - currentScore,
  }

  const scenarios = [
    {
      name: "Conservative",
      description: "Minimal changes, slow improvement",
      color: "#F59E0B",
      improvement: improvements.conservative,
      finalScore: finalScores.conservative,
      actions: ["Make all payments on time", "Avoid new credit applications", "Keep credit utilization stable"],
    },
    {
      name: "Optimistic",
      description: "Moderate improvements over time",
      color: "#3B82F6",
      improvement: improvements.optimistic,
      finalScore: finalScores.optimistic,
      actions: ["Reduce credit utilization by 50%", "Pay down existing debt", "Maintain perfect payment history"],
    },
    {
      name: "Aggressive",
      description: "Maximum effort, fastest improvement",
      color: "#10B981",
      improvement: improvements.aggressive,
      finalScore: finalScores.aggressive,
      actions: ["Pay off all outstanding debt", "Reduce credit utilization to <10%", "Consider debt consolidation"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>24-Month Score Projection</CardTitle>
          <CardDescription>See how your credit score could improve with different strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthNum" tickFormatter={(value) => `${value}M`} />
              <YAxis domain={[300, 900]} />
              <Tooltip
                labelFormatter={(value) => `Month ${value}`}
                formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Line type="monotone" dataKey="conservative" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="optimistic" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="aggressive" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {scenario.name}
                <Badge
                  variant={scenario.improvement >= 0 ? "default" : "destructive"}
                  style={{ backgroundColor: scenario.color }}
                >
                  {scenario.improvement >= 0 ? "+" : ""}
                  {scenario.improvement}
                </Badge>
              </CardTitle>
              <CardDescription>{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Final Score:</span>
                  <span className="text-2xl font-bold" style={{ color: scenario.color }}>
                    {scenario.finalScore}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Action Plan:</h4>
                  <ul className="space-y-1">
                    {scenario.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <Target className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: scenario.color }} />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
