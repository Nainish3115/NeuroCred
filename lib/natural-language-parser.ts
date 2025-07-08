import type { CreditInputs } from "./credit-score-calculator"

export function parseNaturalLanguageInput(input: string): Partial<CreditInputs> {
  const parsed: Partial<CreditInputs> = {}
  const text = input.toLowerCase()

  // Income parsing
  const incomePatterns = [
    /(?:earn|income|salary|make).*?(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d+)*(?:k|thousand|lakh|l)?)/i,
    /(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d+)*(?:k|thousand|lakh|l)?)\s*(?:income|salary|earn|monthly)/i,
    /(\d+(?:,\d+)*(?:k|thousand|lakh|l)?)\s*(?:₹|rs\.?|rupees?)\s*(?:income|salary|monthly)/i,
  ]

  for (const pattern of incomePatterns) {
    const match = text.match(pattern)
    if (match) {
      parsed.income = parseAmount(match[1])
      break
    }
  }

  // EMI parsing
  const emiPatterns = [
    /(?:emi|installment).*?(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d+)*(?:k|thousand)?)/i,
    /(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d+)*(?:k|thousand)?)\s*(?:emi|installment)/i,
    /(\d+(?:,\d+)*(?:k|thousand)?)\s*(?:₹|rs\.?|rupees?)\s*emi/i,
  ]

  for (const pattern of emiPatterns) {
    const match = text.match(pattern)
    if (match) {
      parsed.emi = parseAmount(match[1])
      break
    }
  }

  // Credit utilization parsing
  const utilizationPatterns = [
    /(?:credit\s+)?(?:utilization|usage|used).*?(\d+)%/i,
    /(\d+)%\s*(?:credit\s+)?(?:utilization|usage|used)/i,
    /(?:using|utilized?)\s*(\d+)%/i,
  ]

  for (const pattern of utilizationPatterns) {
    const match = text.match(pattern)
    if (match) {
      parsed.creditUsage = Number.parseInt(match[1])
      break
    }
  }

  // Missed payments parsing
  const missedPaymentPatterns = [
    /(\d+)\s*missed\s*payments?/i,
    /missed\s*(\d+)\s*payments?/i,
    /(\d+)\s*(?:late|delayed)\s*payments?/i,
  ]

  for (const pattern of missedPaymentPatterns) {
    const match = text.match(pattern)
    if (match) {
      parsed.missedPayments = Number.parseInt(match[1])
      break
    }
  }

  // Credit history age parsing
  const historyPatterns = [
    /(\d+)\s*(?:years?|yrs?)\s*(?:credit\s*)?history/i,
    /(?:credit\s*)?history.*?(\d+)\s*(?:years?|yrs?)/i,
    /(\d+)\s*(?:months?|mos?)\s*(?:credit\s*)?history/i,
    /(?:credit\s*)?history.*?(\d+)\s*(?:months?|mos?)/i,
  ]

  for (const pattern of historyPatterns) {
    const match = text.match(pattern)
    if (match) {
      const value = Number.parseInt(match[1])
      // Convert years to months if needed
      parsed.creditHistoryAge = text.includes("year") || text.includes("yr") ? value * 12 : value
      break
    }
  }

  // Active loans parsing
  const loanPatterns = [
    /(\d+)\s*(?:active\s*)?loans?/i,
    /(\d+)\s*(?:loan|credit)\s*accounts?/i,
    /(?:have|got)\s*(\d+)\s*loans?/i,
  ]

  for (const pattern of loanPatterns) {
    const match = text.match(pattern)
    if (match) {
      parsed.activeLoans = Number.parseInt(match[1])
      break
    }
  }

  // Handle common phrases
  if (text.includes("good payment history") || text.includes("never missed")) {
    parsed.missedPayments = 0
  }

  if (text.includes("bad payment history") || text.includes("many missed")) {
    parsed.missedPayments = parsed.missedPayments || 5
  }

  return parsed
}

function parseAmount(amountStr: string): number {
  // Remove commas and convert to lowercase
  const cleaned = amountStr.replace(/,/g, "").toLowerCase()

  // Extract number
  const numberMatch = cleaned.match(/(\d+(?:\.\d+)?)/)
  if (!numberMatch) return 0

  const baseAmount = Number.parseFloat(numberMatch[1])

  // Handle suffixes
  if (cleaned.includes("lakh") || cleaned.includes("l")) {
    return baseAmount * 100000
  } else if (cleaned.includes("k") || cleaned.includes("thousand")) {
    return baseAmount * 1000
  }

  return baseAmount
}
