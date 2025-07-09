"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { CreditInputs } from "@/lib/credit-score-calculator"
import { Download, FileText, Mail, Share2 } from "lucide-react"

interface PDFReportGeneratorProps {
  inputs: CreditInputs
  score: number
  scoreDetails: {
    grade: string
    factors: string[]
  }
  comparisonScenario: CreditInputs | null
}

export function PDFReportGenerator({ inputs, score, scoreDetails, comparisonScenario }: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDFReport = async () => {
    setIsGenerating(true)

    try {
      // In a real implementation, this would use react-pdf or pdf-lib
      // For now, we'll create a comprehensive HTML report that can be printed as PDF
      const reportContent = generateReportHTML()

      // Create a new window with the report content
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(reportContent)
        printWindow.document.close()

        // Trigger print dialog
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateReportHTML = () => {
    const currentDate = new Date().toLocaleDateString()

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Credit Score Report - ${currentDate}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; }
        .score-section { background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .score-large { font-size: 48px; font-weight: bold; color: #3B82F6; text-align: center; }
        .grade { font-size: 24px; color: #10B981; text-align: center; margin-top: 10px; }
        .section { margin: 30px 0; }
        .section h2 { color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { border: 1px solid #E5E7EB; padding: 15px; border-radius: 6px; }
        .factor-list { list-style: none; padding: 0; }
        .factor-list li { padding: 8px 0; border-bottom: 1px solid #F3F4F6; }
        .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .comparison-table th, .comparison-table td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
        .comparison-table th { background: #F9FAFB; font-weight: bold; }
        .recommendations { background: #FEF3C7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B; }
        .footer { margin-top: 40px; text-align: center; color: #6B7280; font-size: 12px; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Credit Score Analysis Report</h1>
        <p>Generated on ${currentDate}</p>
      </div>

      <div class="score-section">
        <div class="score-large">${score}</div>
        <div class="grade">${scoreDetails.grade}</div>
        <p style="text-align: center; margin-top: 15px;">Credit Score Range: 300 - 900</p>
      </div>

      <div class="section">
        <h2>Current Financial Profile</h2>
        <div class="grid">
          <div class="card">
            <h3>Income & Expenses</h3>
            <p><strong>Monthly Income:</strong> ₹${inputs.income.toLocaleString()}</p>
            <p><strong>Total EMI:</strong> ₹${inputs.emi.toLocaleString()}</p>
            <p><strong>EMI-to-Income Ratio:</strong> ${((inputs.emi / inputs.income) * 100).toFixed(1)}%</p>
          </div>
          <div class="card">
            <h3>Credit Profile</h3>
            <p><strong>Credit Utilization:</strong> ${inputs.creditUsage}%</p>
            <p><strong>Credit History Age:</strong> ${inputs.creditHistoryAge} months</p>
            <p><strong>Active Loans:</strong> ${inputs.activeLoans}</p>
            <p><strong>Missed Payments (12m):</strong> ${inputs.missedPayments}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Score Factors Analysis</h2>
        <ul class="factor-list">
          ${scoreDetails.factors.map((factor) => `<li>• ${factor}</li>`).join("")}
        </ul>
      </div>

      ${
        comparisonScenario
          ? `
      <div class="section">
        <h2>Scenario Comparison</h2>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Current</th>
              <th>Scenario</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly Income</td>
              <td>₹${inputs.income.toLocaleString()}</td>
              <td>₹${comparisonScenario.income.toLocaleString()}</td>
              <td>${comparisonScenario.income - inputs.income >= 0 ? "+" : ""}₹${(comparisonScenario.income - inputs.income).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total EMI</td>
              <td>₹${inputs.emi.toLocaleString()}</td>
              <td>₹${comparisonScenario.emi.toLocaleString()}</td>
              <td>${comparisonScenario.emi - inputs.emi >= 0 ? "+" : ""}₹${(comparisonScenario.emi - inputs.emi).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Credit Utilization</td>
              <td>${inputs.creditUsage}%</td>
              <td>${comparisonScenario.creditUsage}%</td>
              <td>${comparisonScenario.creditUsage - inputs.creditUsage >= 0 ? "+" : ""}${comparisonScenario.creditUsage - inputs.creditUsage}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      `
          : ""
      }

      <div class="recommendations">
        <h2>Personalized Recommendations</h2>
        <h3>Immediate Actions (0-3 months):</h3>
        <ul>
          ${inputs.creditUsage > 30 ? "<li>Reduce credit card utilization below 30%</li>" : ""}
          ${inputs.missedPayments > 0 ? "<li>Set up automatic payments to avoid future missed payments</li>" : ""}
          <li>Review and dispute any errors on your credit report</li>
          <li>Avoid applying for new credit unless absolutely necessary</li>
        </ul>
        
        <h3>Medium-term Goals (3-12 months):</h3>
        <ul>
          <li>Maintain credit utilization below 10% for optimal scores</li>
          <li>Consider paying down high-interest debt first</li>
          <li>Keep old credit accounts open to maintain credit history length</li>
          ${inputs.emi / inputs.income > 0.4 ? "<li>Work on reducing overall debt-to-income ratio</li>" : ""}
        </ul>

        <h3>Long-term Strategy (1+ years):</h3>
        <ul>
          <li>Build a diverse credit mix with responsible usage</li>
          <li>Monitor your credit report regularly for accuracy</li>
          <li>Consider becoming an authorized user on a family member's account</li>
          <li>Plan major purchases to minimize credit inquiries</li>
        </ul>
      </div>

      <div class="section">
        <h2>Score Improvement Timeline</h2>
        <div class="grid">
          <div class="card">
            <h3>3 Months</h3>
            <p>Expected improvement: 20-40 points</p>
            <p>Focus: Payment history, utilization reduction</p>
          </div>
          <div class="card">
            <h3>6 Months</h3>
            <p>Expected improvement: 40-70 points</p>
            <p>Focus: Debt reduction, account management</p>
          </div>
          <div class="card">
            <h3>12 Months</h3>
            <p>Expected improvement: 70-120 points</p>
            <p>Focus: Long-term credit building strategies</p>
          </div>
          <div class="card">
            <h3>24 Months</h3>
            <p>Target score: 750+</p>
            <p>Focus: Maintaining excellent credit habits</p>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>This report is generated by Credit Score Simulator for educational purposes.</p>
        <p>Consult with financial advisors for personalized advice.</p>
        <p>Report generated on ${currentDate}</p>
      </div>
    </body>
    </html>
    `
  }

  const reportSections = [
    { title: "Executive Summary", description: "Current score and grade overview" },
    { title: "Financial Profile", description: "Income, expenses, and credit details" },
    { title: "Score Analysis", description: "Factors affecting your credit score" },
    { title: "Recommendations", description: "Personalized improvement strategies" },
    { title: "Timeline", description: "Expected improvement over time" },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Credit Score Report
          </CardTitle>
          <CardDescription>
            Generate a comprehensive PDF report with your credit analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Preview */}
            <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Credit Score Analysis Report</h3>
                <p className="text-gray-600 dark:text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                  <div className="text-lg text-green-600">{scoreDetails.grade}</div>
                  <div className="text-sm text-gray-500">Credit Score</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Income:</span>
                    <span className="font-semibold">₹{inputs.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EMI:</span>
                    <span className="font-semibold">₹{inputs.emi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credit Usage:</span>
                    <span className="font-semibold">{inputs.creditUsage}%</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-semibold">Report Includes:</h4>
                {reportSections.map((section, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{section.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={generatePDFReport} disabled={isGenerating} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {isGenerating ? "Generating..." : "Download PDF Report"}
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Report
              </Button>

              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Report
              </Button>
            </div>

            {/* Report Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reportSections.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{scoreDetails.factors.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Key Factors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{comparisonScenario ? "2" : "1"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Scenarios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Month Outlook</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Customization */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Report Customization</CardTitle>
          <CardDescription>Customize what to include in your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Include Sections:</h4>
                {reportSections.map((section, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{section.title}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Additional Options:</h4>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Include comparison scenario</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Include improvement timeline</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Include personalized recommendations</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Include detailed calculations</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
