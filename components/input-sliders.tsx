"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { CreditInputs } from "@/lib/credit-score-calculator";
import {
  IndianRupee,
  Calendar,
  CreditCard,
  AlertTriangle,
  Clock,
  Building,
} from "lucide-react";

interface InputSlidersProps {
  inputs: CreditInputs;
  onInputChange: (field: keyof CreditInputs, value: number) => void;
}

// ✅ Safe client-only currency formatter
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export function InputSliders({ inputs, onInputChange }: InputSlidersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sliderConfigs = [
    {
      key: "income" as keyof CreditInputs,
      label: "Monthly Income",
      min: 10000,
      max: 200000,
      step: 5000,
      format: formatCurrency,
      icon: IndianRupee,
      description: "Your monthly gross income",
    },
    {
      key: "emi" as keyof CreditInputs,
      label: "Total EMI",
      min: 0,
      max: 100000,
      step: 1000,
      format: formatCurrency,
      icon: CreditCard,
      description: "Total monthly EMI payments",
    },
    {
      key: "creditUsage" as keyof CreditInputs,
      label: "Credit Utilization",
      min: 0,
      max: 100,
      step: 5,
      format: (value: number) => `${value}%`,
      icon: Building,
      description: "Percentage of credit limit used",
    },
    {
      key: "missedPayments" as keyof CreditInputs,
      label: "Missed Payments (Last 12 months)",
      min: 0,
      max: 12,
      step: 1,
      format: (value: number) => `${value} payments`,
      icon: AlertTriangle,
      description: "Number of missed payments in the last year",
    },
    {
      key: "creditHistoryAge" as keyof CreditInputs,
      label: "Credit History Age",
      min: 6,
      max: 120,
      step: 6,
      format: (value: number) => `${value} months`,
      icon: Clock,
      description: "Age of your oldest credit account",
    },
    {
      key: "activeLoans" as keyof CreditInputs,
      label: "Active Loans",
      min: 0,
      max: 10,
      step: 1,
      format: (value: number) => `${value} loans`,
      icon: Calendar,
      description: "Number of active loan accounts",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sliderConfigs.map((config) => {
        const Icon = config.icon;
        return (
          <Card key={config.key} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <Label className="text-sm font-medium">{config.label}</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {config.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isClient ? config.format(config.min) : ""}
                  </span>
                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {isClient ? config.format(inputs[config.key]) : ""}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isClient ? config.format(config.max) : ""}
                  </span>
                </div>

                <Slider
                  value={[inputs[config.key]]}
                  onValueChange={(value) =>
                    onInputChange(config.key, value[0])
                  }
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
