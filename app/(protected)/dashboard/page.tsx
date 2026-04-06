"use client"

import * as React from "react"
import { SectionCards } from "@/components/section-cards"
import { RecordsTable } from "@/components/records-table"
import { DashboardCharts } from "@/components/dashboard-charts"
import { useSummary, useAllRecords, queryKeys } from "@/lib/hooks/use-queries"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  const queryClient = useQueryClient()
  const { data: summary, isLoading: summaryLoading } = useSummary()
  const { data: recordsData, isLoading: recordsLoading } = useAllRecords()

  const records = recordsData?.records ?? []
  const loading = summaryLoading || recordsLoading

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.summary })
    queryClient.invalidateQueries({ queryKey: queryKeys.allRecords })
  }

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">Monitor your income, expenses, and overall financial health.</p>
      </div>

      <SectionCards summary={summary ?? null} loading={loading} />

      <DashboardCharts records={records} loading={loading} />

      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Button variant="link" asChild>
            <Link href="/dashboard/records">View All</Link>
          </Button>
        </div>
        <RecordsTable
          records={records.slice(0, 5)}
          loading={loading}
          onRefresh={handleRefresh}
          hideActions={true}
        />
      </div>
    </div>
  )
}
