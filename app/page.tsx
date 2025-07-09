"use client"

import { useState, useEffect } from "react"
import { GoogleTranslate } from "@/components/google-translate"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { CreditScoreGauge } from "@/components/credit-score-gauge"
import { InputSliders } from "@/components/input-sliders"
import { ScenarioComparison } from "@/components/scenario-comparison"
import { ScoreProjection } from "@/components/score-projection"
import { AIChat } from "@/components/ai-chat"
import { PDFReportGenerator } from "@/components/pdf-report-generator"
import { NaturalLanguageInput } from "@/components/natural-language-input"
import { calculateCreditScore, type CreditInputs } from "@/lib/credit-score-calculator"
import { Download, TrendingUp, MessageCircle, BarChart3 } from "lucide-react"

export default function CreditScoreSimulator() {
  const [inputs, setInputs] = useState<CreditInputs>({
    income: 50000,
    emi: 15000,
    creditUsage: 30,
    missedPayments: 0,
    creditHistoryAge: 24,
    activeLoans: 2,
  })

  const [score, setScore] = useState(750)
  const [scoreDetails, setScoreDetails] = useState({
    grade: "Good",
    factors: [] as string[],
  })

  const [comparisonScenario, setComparisonScenario] = useState<CreditInputs | null>(null)
  const [activeTab, setActiveTab] = useState("simulator")

  useEffect(() => {
    const result = calculateCreditScore(inputs)
    setScore(result.score)
    setScoreDetails(result.details)
  }, [inputs])

  const handleInputChange = (field: keyof CreditInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleNaturalLanguageInput = (parsedInputs: Partial<CreditInputs>) => {
    setInputs((prev) => ({ ...prev, ...parsedInputs }))
  }

  const createScenario = () => {
    setComparisonScenario({ ...inputs })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">CreditSim-Navigate Your Credit with Confidence</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Analyze and improve your credit score with advanced AI insights, scenario comparisons, and personalized recommendations
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <Badge variant="outline" className="bg-white dark:bg-gray-800">
              Score: {score}
            </Badge>
            <ThemeToggle />
            <GoogleTranslate />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800">
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Simulator
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Compare
            </TabsTrigger>
            <TabsTrigger value="projection" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Projection
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI Advisor
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Report
            </TabsTrigger>
          </TabsList>

          {/* Simulator Tab */}
          <TabsContent value="simulator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Controls */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Tell Us About Your Finances</CardTitle>
                    <CardDescription>Enter a short description of your income, expenses, and credit activity.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NaturalLanguageInput onInputParsed={handleNaturalLanguageInput} />
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Financial Parameters</CardTitle>
                    <CardDescription>Adjust your financial details to see real-time score changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InputSliders inputs={inputs} onInputChange={handleInputChange} />
                  </CardContent>
                </Card>
              </div>

              {/* Score Display */}
              <div className="space-y-6">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle>Your Credit Score</CardTitle>
                    <CardDescription>Current score: {scoreDetails.grade}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CreditScoreGauge score={score} />
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-sm">Key Factors:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {scoreDetails.factors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={createScenario} className="w-full">
                  Create Comparison Scenario
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            <ScenarioComparison
              currentInputs={inputs}
              comparisonScenario={comparisonScenario}
              onScenarioChange={setComparisonScenario}
            />
          </TabsContent>

          {/* Projection Tab */}
          <TabsContent value="projection">
            <ScoreProjection inputs={inputs} currentScore={score} />
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat">
            <AIChat inputs={inputs} currentScore={score} />
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report">
            <PDFReportGenerator
              inputs={inputs}
              score={score}
              scoreDetails={scoreDetails}
              comparisonScenario={comparisonScenario}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
