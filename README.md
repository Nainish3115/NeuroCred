# CreditSim-Navigate Your Credit with Confidence

A full-stack AI-powered credit simulation and advisory platform built with Next.js, Tailwind CSS, TypeScript, and OpenAI GPT-4o. This web app helps users understand, simulate, and improve their credit score through intuitive UI, natural language input, sliders, projection graphs, and personalized credit reports.

[Live Demo →](https://neuro-cred.vercel.app) 
Downloadable Credit Report | Light/Dark Theme | Multi-language Support


## Key Features


-  **Credit Simulator** with sliders and natural language input
- **Comparison Dashboard**: Current vs Scenario scores, impact charts
- **24-Month Projection**: Conservative, Aggressive & Optimistic curves
- **AI Advisor** (OpenAI GPT-4o) for personalized credit guidance
- **Credit Score Report** (PDF): Executive summary, analysis, & timeline
- **Light/Dark Mode** toggle with smooth transitions
- **Google Translate** for multilingual accessibility
- **Downloadable reports** for user records

## Pages Overview

### 1. Credit Simulator
- Slider-based and natural language input to modify:
  - Income, EMI, Credit Usage, Missed Payments, Loans
- Live **Credit Score Gauge** updates with animation

### 2. Comparison
- View **Current vs Scenario** score using dual gauges
- Graph to compare key financial parameters
- Slider controls for hypothetical adjustments
- **Impact Analysis** of changes

### 3. 24-Month Projection
- Visualize score growth over time:
  - Conservative
  - Optimistic
  - Aggressive
- Backed with recommended **Action Plan**

### 4. AI Advisor
- Ask credit questions in natural language
- Context-aware responses powered by OpenAI
- Clickable suggestion follow-ups and chatbot-style interaction

### 5. Credit Report Generator
- Auto-generated downloadable report containing:
  1. **Executive Summary**
  2. **Financial Profile**
  3. **Score Analysis**
  4. **Recommendations**
  5. **Improvement Timeline**

---

## Tech Stack

- **Next.js 14**
- **TypeScript + React**
- **Tailwind CSS**
- **OpenAI API (GPT-4o)**
- **Lucide Icons**
- **Chart.js / Recharts**
- **Google Translate Integration**
- **Vercel Hosting**

---

## ⚙Setup & Installation

1. **Clone the Repo**
```bash
git clone https://github.com/Nainish3115/NeuroCred.git
npm install -g pnpm
pnpm install
pnpm dev
