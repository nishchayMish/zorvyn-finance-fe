"use client"

import * as React from "react"
import { SectionCards } from "@/components/section-cards"
import { RecordsTable } from "@/components/records-table"
import { AddRecordDialog } from "@/components/add-record-dialog"
import { recordService, SummaryData, RecordData } from "@/lib/services/record-service"
import { toast } from "sonner"

export default function Page() {
  const [summary, setSummary] = React.useState<SummaryData | null>(null)
  const [records, setRecords] = React.useState<RecordData[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [summaryRes, recordsRes] = await Promise.all([
        recordService.getSummary(),
        recordService.getRecords()
      ])
      setSummary(summaryRes)
      setRecords(recordsRes)
    } catch (error: any) {
      console.error("Dashboard error:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-8 pb-32">
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">Monitor your income, expenses, and overall financial health.</p>
      </div>

      <SectionCards summary={summary} loading={loading} />
      
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        <RecordsTable records={records} loading={loading} onRefresh={fetchData} />

      </div>

      <AddRecordDialog onRecordAdded={fetchData} />
    </div>
  )
}

