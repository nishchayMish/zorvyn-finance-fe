"use client"

import * as React from "react"
import { RecordsTable } from "@/components/records-table"
import { AddRecordDialog } from "@/components/add-record-dialog"
import { recordService, RecordData, RecordsResponse } from "@/lib/services/record-service"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { PlusIcon, SearchIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RecordsPage() {
  const [data, setData] = React.useState<RecordsResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [userRole, setUserRole] = React.useState<string>("viewer")

  // Filters & Pagination State
  const [page, setPage] = React.useState(1)
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categories, setCategories] = React.useState<string[]>([])

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

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
      const res = await recordService.getRecords({
        page,
        limit: 5,
        type: typeFilter === "all" ? undefined : typeFilter,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        search: debouncedSearch || undefined
      })
      setData(res)

      // Get unique categories for the filter (ideally from a separate endpoint, 
      // but we'll extract from current results or keep a static list)
      if (categories.length === 0 && res.records.length > 0) {
        const uniqueCats = Array.from(new Set(res.records.map(r => r.category))).filter(Boolean)
        setCategories(uniqueCats as string[])
      }

    } catch (error: any) {
      console.error("Records error:", error)
      toast.error("Failed to load records")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [page, typeFilter, categoryFilter, debouncedSearch])

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1)
  }, [typeFilter, categoryFilter, debouncedSearch])

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
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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

      <div className="px-4 lg:px-6 space-y-4">
        <RecordsTable
          records={data?.records || []}
          loading={loading}
          onRefresh={fetchData}
        />

        {data && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => {
                  if (
                    data.pagination.totalPages > 7 &&
                    p !== 1 &&
                    p !== data.pagination.totalPages &&
                    Math.abs(p - page) > 1
                  ) {
                    if (Math.abs(p - page) === 2) return <PaginationEllipsis key={p} />
                    return null
                  }

                  return (
                    <PaginationItem key={p}>
                      <PaginationLink 
                        isActive={page === p}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={page === data.pagination.totalPages || data.pagination.totalPages === 0}
                    className={(page === data.pagination.totalPages || data.pagination.totalPages === 0) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-xs text-muted-foreground">
              Showing {data.records.length} of {data.pagination.totalRecords} records
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
