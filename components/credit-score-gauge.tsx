"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface CreditScoreGaugeProps {
  score: number
}

export function CreditScoreGauge({ score }: CreditScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 750) return "#10B981" // Green
    if (score >= 650) return "#F59E0B" // Yellow
    if (score >= 550) return "#F97316" // Orange
    return "#EF4444" // Red
  }

  const getScoreGrade = (score: number) => {
    if (score >= 750) return "Excellent"
    if (score >= 650) return "Good"
    if (score >= 550) return "Fair"
    return "Poor"
  }

  const data = [
    { name: "Score", value: score - 300, fill: getScoreColor(score) },
    { name: "Remaining", value: 900 - score, fill: "#E5E7EB" },
  ]

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{score}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{getScoreGrade(score)}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">300 - 900 Range</div>
      </div>
    </div>
  )
}
