"use client"

import * as React from "react"
import { RecordsTable } from "@/components/records-table"
import { AddRecordDialog } from "@/components/add-record-dialog"
import { recordService, RecordData } from "@/lib/services/record-service"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RecordsPage() {
  const [records, setRecords] = React.useState<RecordData[]>([])
  const [filteredRecords, setFilteredRecords] = React.useState<RecordData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [userRole, setUserRole] = React.useState<string>("viewer")

  // Filters
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [categories, setCategories] = React.useState<string[]>([])

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser)
        setUserRole(u.role || "viewer")
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const recordsRes = await recordService.getRecords()
      setRecords(recordsRes)

      const uniqueCats = Array.from(new Set(recordsRes.map(r => r.category))).filter(Boolean)
      setCategories(uniqueCats as string[])

    } catch (error: any) {
      console.error("Records error:", error)
      toast.error("Failed to load records")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    let result = records

    if (typeFilter !== "all") {
      result = result.filter(r => r.type === typeFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter(r => r.category === categoryFilter)
    }

    setFilteredRecords(result)
  }, [typeFilter, categoryFilter, records])

  return (
    <div className="flex flex-col gap-6 pb-32">
      <div className="flex flex-col gap-2 px-4 lg:px-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Records</h1>
            <p className="text-muted-foreground mt-1">Manage and track your financial transactions.</p>
          </div>
          {userRole === "admin" && (
            <AddRecordDialog
              onRecordAdded={fetchData}
              triggerBtn={
                <Button>
                  <PlusIcon className="mr-2 size-4" />
                  Add Record
                </Button>
              }
            />
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 px-4 lg:px-6 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <RecordsTable
          records={filteredRecords}
          loading={loading}
          onRefresh={fetchData}
        />
      </div>
    </div>
  )
}
