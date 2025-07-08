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
  let score = 300 // Base score
  const factors: string[] = []

  // Payment History (35% weight) - Most important factor
  const paymentHistoryScore = Math.max(0, 250 - inputs.missedPayments * 40)
  score += paymentHistoryScore

  if (inputs.missedPayments === 0) {
    factors.push("Perfect payment history boosts your score significantly")
  } else if (inputs.missedPayments <= 2) {
    factors.push(`${inputs.missedPayments} missed payment(s) slightly impact your score`)
  } else {
    factors.push(`${inputs.missedPayments} missed payments significantly hurt your score`)
  }

  // Credit Utilization (30% weight)
  let utilizationScore = 0
  if (inputs.creditUsage <= 10) {
    utilizationScore = 180
    factors.push("Excellent credit utilization (≤10%) maximizes your score")
  } else if (inputs.creditUsage <= 30) {
    utilizationScore = 150 - (inputs.creditUsage - 10) * 2
    factors.push("Good credit utilization helps maintain a healthy score")
  } else if (inputs.creditUsage <= 50) {
    utilizationScore = 110 - (inputs.creditUsage - 30) * 1.5
    factors.push("High credit utilization is negatively impacting your score")
  } else {
    utilizationScore = 80 - (inputs.creditUsage - 50) * 1
    factors.push("Very high credit utilization significantly hurts your score")
  }
  score += utilizationScore

  // Credit History Length (15% weight)
  const historyScore = Math.min(90, inputs.creditHistoryAge * 0.75)
  score += historyScore

  if (inputs.creditHistoryAge >= 60) {
    factors.push("Long credit history strengthens your profile")
  } else if (inputs.creditHistoryAge >= 24) {
    factors.push("Moderate credit history age is beneficial")
  } else {
    factors.push("Short credit history limits your score potential")
  }

  // Credit Mix and New Credit (20% weight combined)
  let mixScore = 0
  if (inputs.activeLoans >= 2 && inputs.activeLoans <= 4) {
    mixScore = 60
    factors.push("Good credit mix with multiple account types")
  } else if (inputs.activeLoans === 1) {
    mixScore = 40
    factors.push("Limited credit mix - consider diversifying account types")
  } else if (inputs.activeLoans === 0) {
    mixScore = 20
    factors.push("No active loans - having some credit accounts can help")
  } else {
    mixScore = 30
    factors.push("Too many active loans may indicate credit dependency")
  }
  score += mixScore

  // Income to EMI ratio impact
  const emiRatio = inputs.emi / inputs.income
  let incomeScore = 0
  if (emiRatio <= 0.3) {
    incomeScore = 40
    factors.push("Excellent debt-to-income ratio shows financial stability")
  } else if (emiRatio <= 0.4) {
    incomeScore = 30
    factors.push("Good debt-to-income ratio")
  } else if (emiRatio <= 0.5) {
    incomeScore = 20
    factors.push("High debt-to-income ratio may concern lenders")
  } else {
    incomeScore = 10
    factors.push("Very high debt-to-income ratio is a significant risk factor")
  }
  score += incomeScore

  // Cap the score at 900
  score = Math.min(900, Math.round(score))

  // Determine grade
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
