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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const SLIDER_CONFIG: Record<keyof CreditInputs, {
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  icon: any;
  description: string;
}> = {
  income: {
    label: "Monthly Income",
    min: 10000,
    max: 2000000,
    step: 5000,
    format: formatCurrency,
    icon: IndianRupee,
    description: "Your monthly gross income",
  },
  emi: {
    label: "Total EMI",
    min: 0,
    max: 1000000,
    step: 1000,
    format: formatCurrency,
    icon: CreditCard,
    description: "Total monthly EMI payments",
  },
  creditUsage: {
    label: "Credit Utilization",
    min: 0,
    max: 100,
    step: 5,
    format: (value: number) => `${value}%`,
    icon: Building,
    description: "Percentage of credit limit used",
  },
  missedPayments: {
    label: "Missed Payments (Last 24 months)",
    min: 0,
    max: 24,
    step: 1,
    format: (value: number) => `${value} payments`,
    icon: AlertTriangle,
    description: "Number of missed payments in the last 2 year",
  },
  creditHistoryAge: {
    label: "Credit History Age",
    min: 6,
    max: 120,
    step: 6,
    format: (value: number) => `${value} months`,
    icon: Clock,
    description: "Age of your oldest credit account",
  },
  activeLoans: {
    label: "Active Loans",
    min: 0,
    max: 10,
    step: 1,
    format: (value: number) => `${value} loans`,
    icon: Calendar,
    description: "Number of active loan accounts",
  },
};

export function InputSliders({ inputs, onInputChange }: InputSlidersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(SLIDER_CONFIG).map(([key, config]) => {
        const typedKey = key as keyof CreditInputs;
        const Icon = config.icon;

        return (
          <Card key={typedKey} className="p-4">
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
                    {isClient ? config.format(inputs[typedKey]) : ""}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isClient ? config.format(config.max) : ""}
                  </span>
                </div>

                <Slider
                  value={[inputs[typedKey]]}
                  onValueChange={(value) => onInputChange(typedKey, value[0])}
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
