export const scoringRules = {
  paymentHistory: {
    weight: 250,
    penaltyPerMissed: 40,
    messages: (missed: number) => {
      if (missed === 0) return "Perfect payment history boosts your score significantly"
      if (missed <= 2) return `${missed} missed payment(s) slightly impact your score`
      return `${missed} missed payments significantly hurt your score`
    },
  },
  creditUtilization: {
    weight: 180,
    tiers: [
      { max: 10, fixed: 180, message: "Excellent credit utilization (≤10%) maximizes your score" },
      { max: 30, formula: (usage: number) => 150 - (usage - 10) * 2, message: "Good credit utilization helps maintain a healthy score" },
      { max: 50, formula: (usage: number) => 110 - (usage - 30) * 1.5, message: "High credit utilization is negatively impacting your score" },
      { max: 100, formula: (usage: number) => 80 - (usage - 50), message: "Very high credit utilization significantly hurts your score" },
    ]
  },
  creditHistory: {
    weight: 90,
    formula: (months: number) => Math.min(90, months * 0.75),
    messages: (months: number) => {
      if (months >= 60) return "Long credit history strengthens your profile"
      if (months >= 24) return "Moderate credit history age is beneficial"
      return "Short credit history limits your score potential"
    }
  },
  creditMix: {
    weight: 60,
    rules: (loans: number) => {
      if (loans >= 2 && loans <= 4) return { score: 60, message: "Good credit mix with multiple account types" }
      if (loans === 1) return { score: 40, message: "Limited credit mix - consider diversifying account types" }
      if (loans === 0) return { score: 20, message: "No active loans - having some credit accounts can help" }
      return { score: 30, message: "Too many active loans may indicate credit dependency" }
    }
  },
  incomeRatio: {
    weight: 40,
    rules: (ratio: number) => {
      if (ratio <= 0.3) return { score: 40, message: "Excellent debt-to-income ratio shows financial stability" }
      if (ratio <= 0.4) return { score: 30, message: "Good debt-to-income ratio" }
      if (ratio <= 0.5) return { score: 20, message: "High debt-to-income ratio may concern lenders" }
      return { score: 10, message: "Very high debt-to-income ratio is a significant risk factor" }
    }
  }
}