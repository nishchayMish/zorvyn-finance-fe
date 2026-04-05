"use client"

import * as React from "react"
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
import { Skeleton } from "@/components/ui/skeleton"

interface SectionCardsProps {
  summary: SummaryData | null
  loading?: boolean
}

function CardSkeleton() {
  return (
    <Card className="relative overflow-hidden flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between space-x-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="size-8 rounded-md" />
        </div>
        <Skeleton className="h-8 w-36 mt-2" />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-2.5 w-32" />
      </CardFooter>
    </Card>
  )
}

export function SectionCards({ summary, loading }: SectionCardsProps) {
  const cards = [
    {
      title: "Current Balance",
      value: summary?.netBalance || 0,
      description: "Total available across all accounts",
      icon: <WalletIcon />,
      color: "text-primary",
      footer: "Updated just now"
    },
    {
      title: "Total Income",
      value: summary?.totalIncome || 0,
      description: "Earnings and cash inflows",
      icon: <ArrowUpCircleIcon />,
      color: "text-green-500",
      footer: "Monthly tracking active"
    },
    {
      title: "Total Expense",
      value: summary?.totalExpense || 0,
      description: "Spending and cash outflows",
      icon: <ArrowDownCircleIcon />,
      color: "text-red-500",
      footer: "Optimizing budget"
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-3 *:data-[slot=card]:border-white/5 *:data-[slot=card]:bg-zinc-900/40 *:data-[slot=card]:transition-all *:data-[slot=card]:hover:bg-zinc-900/60 *:data-[slot=card]:hover:shadow-lg *:data-[slot=card]:hover:shadow-primary/5">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        : cards.map((card, index) => (
          <Card key={index} className="relative overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between space-x-2">
                <CardDescription className="text-sm font-medium">
                  {card.title}
                </CardDescription>
                <div className={cn("flex-shrink-0 rounded-md p-2 bg-white/5", card.color)}>
                  {React.cloneElement(card.icon as React.ReactElement<{ className?: string }>, { className: "size-4" })}
                </div>
              </div>
              <CardTitle className={cn("text-2xl pt-2 font-bold tabular-nums truncate tracking-tight w-full", card.color)}>
                ₹{card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1">
              <div className="text-xs text-muted-foreground truncate w-full">
                {card.description}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold opacity-50 truncate w-full mt-0.5">
                {card.footer}
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}

