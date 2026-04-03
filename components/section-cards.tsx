"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, WalletIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from "lucide-react"
import { SummaryData } from "@/lib/services/record-service"
import { cn } from "@/lib/utils"

interface SectionCardsProps {
  summary: SummaryData | null
  loading?: boolean
}

export function SectionCards({ summary, loading }: SectionCardsProps) {
  const cards = [
    {
      title: "Current Balance",
      value: summary?.balance || 0,
      description: "Total available across all accounts",
      icon: <WalletIcon className="size-5 text-primary" />,
      color: "text-primary",
      footer: "Updated just now"
    },
    {
      title: "Total Income",
      value: summary?.totalIncome || 0,
      description: "Earnings and cash inflows",
      icon: <ArrowUpCircleIcon className="size-5 text-green-500" />,
      color: "text-green-500",
      footer: "Monthly tracking active"
    },
    {
      title: "Total Expense",
      value: summary?.totalExpense || 0,
      description: "Spending and cash outflows",
      icon: <ArrowDownCircleIcon className="size-5 text-red-500" />,
      color: "text-red-500",
      footer: "Optimizing budget"
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-3 *:data-[slot=card]:border-white/5 *:data-[slot=card]:bg-zinc-900/40 *:data-[slot=card]:transition-all *:data-[slot=card]:hover:bg-zinc-900/60 *:data-[slot=card]:hover:shadow-lg *:data-[slot=card]:hover:shadow-primary/5">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10 bg-gradient-to-br from-primary/30 to-transparent p-4 rounded-full">
            {React.cloneElement(card.icon as React.ReactElement<{ className?: string }>, { className: "size-10" })}
          </div>
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              {card.icon}
              {card.title}
            </CardDescription>
            <CardTitle className={cn("text-3xl font-bold tabular-nums", card.color)}>
              ${card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground line-clamp-1">
              {card.description}
            </div>
            <div className="text-[10px] uppercase tracking-wider font-semibold opacity-50">
              {card.footer}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
