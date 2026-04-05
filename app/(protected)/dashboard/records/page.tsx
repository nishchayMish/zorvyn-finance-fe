"use client"

import * as React from "react"
import api from "@/lib/api-client"
import { RecordsTable } from "@/components/records-table"
import { AddRecordDialog } from "@/components/add-record-dialog"
import { recordService, RecordData, SummaryData, RecordsResponse } from "@/lib/services/record-service"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    PlusIcon, Search, Filter, Loader2, ChevronDown,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    Wallet, TrendingUp, TrendingDown, IndianRupee, Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LIMIT_OPTIONS = [5, 10, 20, 50] as const

const StatCard = ({ label, value, icon, borderColor }: { label: string; value: number | string; icon: React.ReactNode; borderColor: string }) => (
    <div className={cn("relative flex-1 min-w-[130px] rounded-xl border p-4 overflow-hidden bg-zinc-900/60 backdrop-blur-sm transition-colors duration-200 hover:bg-zinc-900/80", borderColor)}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-end justify-between gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
            <span className="text-zinc-600 mb-0.5">{icon}</span>
        </div>
    </div>
)

const PaginationControls = ({
    page, totalPages, limit, onPageChange, onLimitChange,
}: {
    page: number; totalPages: number; limit: number; onPageChange: (p: number) => void; onLimitChange: (l: number) => void
}) => {
    const [jumpValue, setJumpValue] = React.useState("")

    if (totalPages <= 1) return null

    const getPageItems = (): (number | "ellipsis-l" | "ellipsis-r")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const items: (number | "ellipsis-l" | "ellipsis-r")[] = [1]
        if (page > 3) items.push("ellipsis-l")
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) items.push(i)
        if (page < totalPages - 2) items.push("ellipsis-r")
        items.push(totalPages)
        return items
    }

    const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        const p = parseInt(jumpValue, 10)
        if (!isNaN(p) && p >= 1 && p <= totalPages) onPageChange(p)
        setJumpValue("")
    }

    return (
        <div className="px-4 lg:px-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
                <span className="text-xs text-zinc-500 whitespace-nowrap">Rows per page</span>
                <div className="flex items-center gap-1">
                    {LIMIT_OPTIONS.map(l => (
                        <button key={l} onClick={() => { onLimitChange(l); onPageChange(1) }}
                            className={cn("h-7 w-9 rounded-md border text-xs font-medium transition-all duration-150",
                                l === limit
                                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                            )}>
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                <button onClick={() => onPageChange(1)} disabled={page === 1}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors">
                    <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors">
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1">
                    {getPageItems().map((item, idx) => {
                        if (item === "ellipsis-l" || item === "ellipsis-r") {
                            return <span key={`${item}-${idx}`} className="h-7 w-7 flex items-center justify-center text-zinc-600 text-xs select-none">···</span>
                        }
                        return (
                            <button key={item} onClick={() => onPageChange(item)}
                                className={cn("h-7 w-7 flex items-center justify-center rounded-md border text-xs font-medium transition-all duration-150",
                                    item === page
                                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                                )}>
                                {item}
                            </button>
                        )
                    })}
                </div>

                <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors">
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors">
                    <ChevronsRight className="h-3.5 w-3.5" />
                </button>

                <div className="h-4 w-px bg-zinc-800 mx-1" />

                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-500 whitespace-nowrap">Go to</span>
                    <input type="number" min={1} max={totalPages} value={jumpValue}
                        onChange={e => setJumpValue(e.target.value)} onKeyDown={handleJump}
                        placeholder={String(page)}
                        className="h-7 w-12 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
                <span className="text-xs text-zinc-600 whitespace-nowrap ml-1">of {totalPages}</span>
            </div>
        </div>
    )
}

export default function RecordsPage() {
    const [data, setData] = React.useState<RecordsResponse | null>(null)
    const [summary, setSummary] = React.useState<SummaryData | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [userRole, setUserRole] = React.useState<string>("viewer")

    // Filters & Pagination State
    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(5)
    const [typeFilter, setTypeFilter] = React.useState<string>("all")
    const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [categories, setCategories] = React.useState<string[]>([])

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = React.useState("")

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 1000)
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

    const fetchSummary = async () => {
        try {
            const s = await recordService.getSummary()
            setSummary(s)
        } catch (error) {
            console.error("Summary error:", error)
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await recordService.getRecords({
                page,
                limit,
                type: typeFilter === "all" ? undefined : typeFilter,
                category: categoryFilter === "all" ? undefined : categoryFilter,
                search: debouncedSearch || undefined
            })
            setData(res)

            // Extract unique categories from backend records if not already set
            if (res.records.length > 0) {
              const uniqueCats = Array.from(new Set(res.records.map(r => r.category))).filter(Boolean)
              setCategories(prev => Array.from(new Set([...prev, ...uniqueCats])) as string[])
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
        fetchSummary()
    }, [page, limit, typeFilter, categoryFilter, debouncedSearch])

    // Reset page when filters change
    React.useEffect(() => {
        setPage(1)
    }, [typeFilter, categoryFilter, debouncedSearch])

    const hasActiveFilters = typeFilter !== "all" || categoryFilter !== "all"

    return (
        <div className="flex flex-col gap-6 min-h-screen bg-zinc-950 text-white">
            
            <div className="px-4 lg:px-8 pt-8 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <Wallet className="h-4 w-4 text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight leading-none">Records</h1>
                            <p className="text-zinc-500 text-sm mt-0.5">Manage and track your financial transactions.</p>
                        </div>
                    </div>

                    {userRole === "admin" && (
                        <AddRecordDialog
                            onRecordAdded={() => { fetchData(); fetchSummary(); }}
                            triggerBtn={
                                <Button className="bg-violet-600 hover:bg-violet-700 text-white border-0 h-9">
                                    <PlusIcon className="mr-2 size-4" />
                                    Add Record
                                </Button>
                            }
                        />
                    )}
                </div>
            </div>

            <div className="px-4 lg:px-8">
                {summary ? (
                    <div className="flex gap-3 flex-wrap">
                        <StatCard 
                            label="Total Income" 
                            value={`₹${summary.totalIncome.toLocaleString()}`} 
                            icon={<TrendingUp className="h-5 w-5 text-emerald-400" />} 
                            borderColor="border-emerald-500/20" 
                        />
                        <StatCard 
                            label="Total Expense" 
                            value={`₹${summary.totalExpense.toLocaleString()}`} 
                            icon={<TrendingDown className="h-5 w-5 text-rose-400" />} 
                            borderColor="border-rose-500/20" 
                        />
                        <StatCard 
                            label="Net Balance" 
                            value={`₹${summary.netBalance.toLocaleString()}`} 
                            icon={<IndianRupee className="h-5 w-5 text-violet-400" />} 
                            borderColor="border-violet-500/20" 
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-zinc-600 text-sm py-6">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading stats…
                    </div>
                )}
            </div>

            <div className="px-4 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <Input
                        placeholder="Search notes…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500/40 focus-visible:border-zinc-600"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 h-9 text-sm border rounded-lg bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors",
                                typeFilter !== "all" && "border-violet-500/40 text-violet-300 bg-violet-500/10"
                            )}>
                                <Filter className="h-3.5 w-3.5 opacity-70" />
                                {typeFilter === "all" ? "Type" : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                                <ChevronDown className="h-3 w-3 opacity-50 ml-0.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                            <DropdownMenuItem onClick={() => setTypeFilter("all")} className="cursor-pointer focus:bg-zinc-800">All Types</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeFilter("income")} className="cursor-pointer focus:bg-zinc-800 text-emerald-400">Income</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTypeFilter("expense")} className="cursor-pointer focus:bg-zinc-800 text-red-400">Expense</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 h-9 text-sm border rounded-lg bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors",
                                categoryFilter !== "all" && "border-violet-500/40 text-violet-300 bg-violet-500/10"
                            )}>
                                <Tag className="h-3.5 w-3.5 opacity-70" />
                                {categoryFilter === "all" ? "Category" : categoryFilter}
                                <ChevronDown className="h-3 w-3 opacity-50 ml-0.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-200 max-h-[300px] overflow-auto">
                            <DropdownMenuItem onClick={() => setCategoryFilter("all")} className="cursor-pointer focus:bg-zinc-800">All Categories</DropdownMenuItem>
                            {categories.map(cat => (
                                <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)} className="cursor-pointer focus:bg-zinc-800 capitalize">
                                    {cat}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {hasActiveFilters && (
                        <button
                            onClick={() => { setTypeFilter("all"); setCategoryFilter("all") }}
                            className="h-9 px-3 text-xs text-zinc-400 border border-zinc-800 rounded-lg bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors">
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            <div className="px-4 lg:px-8">
                <RecordsTable
                    records={data?.records || []}
                    loading={loading}
                    onRefresh={() => { fetchData(); fetchSummary(); }}
                />
            </div>

            {data && (
                <PaginationControls
                    page={page}
                    totalPages={data.pagination.totalPages}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            )}
        </div>
    )
}
