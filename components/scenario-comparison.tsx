"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InputSliders } from "@/components/input-sliders"
import { CreditScoreGauge } from "@/components/credit-score-gauge"
import { calculateCreditScore, type CreditInputs } from "@/lib/credit-score-calculator"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ArrowRight, Copy, RotateCcw } from "lucide-react"

interface ScenarioComparisonProps {
  currentInputs: CreditInputs
  comparisonScenario: CreditInputs | null
  onScenarioChange: (scenario: CreditInputs | null) => void
}

export function ScenarioComparison({ currentInputs, comparisonScenario, onScenarioChange }: ScenarioComparisonProps) {
  const [scenarioInputs, setScenarioInputs] = useState<CreditInputs>(comparisonScenario || { ...currentInputs })

  const currentResult = calculateCreditScore(currentInputs)
  const scenarioResult = calculateCreditScore(scenarioInputs)
  const scoreDifference = scenarioResult.score - currentResult.score

  const handleInputChange = (field: keyof CreditInputs, value: number) => {
    setScenarioInputs((prev) => ({ ...prev, [field]: value }))
  }

  const copyCurrentToScenario = () => {
    setScenarioInputs({ ...currentInputs })
  }

  const resetScenario = () => {
    setScenarioInputs({ ...currentInputs })
  }

  const comparisonData = [
    {
      name: "Current",
      score: currentResult.score,
      fill: "#3B82F6",
    },
    {
      name: "Scenario",
      score: scenarioResult.score,
      fill: scoreDifference >= 0 ? "#10B981" : "#EF4444",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Scenario Comparison
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyCurrentToScenario}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Current
              </Button>
              <Button variant="outline" size="sm" onClick={resetScenario}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Compare your current situation with a hypothetical scenario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Score */}
            <Card className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg mb-2">Current Score</h3>
                <CreditScoreGauge score={currentResult.score} />
              </div>
            </Card>

            {/* Comparison Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <ArrowRight className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <Badge variant={scoreDifference >= 0 ? "default" : "destructive"} className="text-lg px-3 py-1">
                  {scoreDifference >= 0 ? "+" : ""}
                  {scoreDifference}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Score Change</p>
              </div>
            </div>

            {/* Scenario Score */}
            <Card className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg mb-2">Scenario Score</h3>
                <CreditScoreGauge score={scenarioResult.score} />
              </div>
            </Card>
          </div>

          {/* Bar Chart Comparison */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Score Comparison</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[300, 900]} />
                <Tooltip />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Input Controls */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Adjust Scenario Parameters</CardTitle>
          <CardDescription>Modify the values below to see how they would affect your credit score</CardDescription>
        </CardHeader>
        <CardContent>
          <InputSliders inputs={scenarioInputs} onInputChange={handleInputChange} />
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Current Factors</h4>
              <ul className="space-y-2">
                {currentResult.details.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Scenario Factors</h4>
              <ul className="space-y-2">
                {scenarioResult.details.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
