// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import TopBar from "@/components/ui/topbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CreditSim-Navigate Your Credit with Confidence",
  description: "Analyze and improve your credit score with advanced AI insights, scenario comparisons, and personalized recommendations.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TopBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
