import { scoringRules } from "@/config/scoringRules"

export interface CreditInputs {
  income: number
  emi: number
  creditUsage: number
  missedPayments: number
  creditHistoryAge: number
  activeLoans: number
}

export interface CreditScoreResult {
  score: number
  details: {
    grade: string
    factors: string[]
  }
}

export function calculateCreditScore(inputs: CreditInputs): CreditScoreResult {
  let score = 300
  const factors: string[] = []

  const paymentScore = Math.max(
    0,
    scoringRules.paymentHistory.weight -
      inputs.missedPayments * scoringRules.paymentHistory.penaltyPerMissed
  )
  score += paymentScore
  factors.push(scoringRules.paymentHistory.messages(inputs.missedPayments))

  const utilizationTier = scoringRules.creditUtilization.tiers.find(
    (t) => inputs.creditUsage <= t.max
  )
  if (utilizationTier) {
    const tierScore = utilizationTier.fixed ?? utilizationTier.formula!(inputs.creditUsage)
    score += tierScore
    factors.push(utilizationTier.message)
  }

  const historyScore = scoringRules.creditHistory.formula(inputs.creditHistoryAge)
  score += historyScore
  factors.push(scoringRules.creditHistory.messages(inputs.creditHistoryAge))

  const mix = scoringRules.creditMix.rules(inputs.activeLoans)
  score += mix.score
  factors.push(mix.message)

  const ratio = inputs.emi / inputs.income
  const income = scoringRules.incomeRatio.rules(ratio)
  score += income.score
  factors.push(income.message)

  score = Math.min(900, Math.round(score))

  let grade = "Poor"
  if (score >= 750) grade = "Excellent"
  else if (score >= 650) grade = "Good"
  else if (score >= 550) grade = "Fair"

  return {
    score,
    details: {
      grade,
      factors,
    },
  }
}
