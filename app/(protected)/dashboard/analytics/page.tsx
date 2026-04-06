"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis, PieChart, Pie, Cell } from "recharts"
import { useAllRecords } from "@/lib/hooks/use-queries"
import type { RecordData } from "@/lib/services/record-service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function AnalyticsPage() {
  const router = useRouter()
  const [typeFilter, setTypeFilter] = React.useState<string>("expense")

  const { data: recordsData, isLoading } = useAllRecords()
  const records: RecordData[] = recordsData?.records ?? []

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser)
        if (u.role === "viewer") {
          toast.error("Unauthorized to view analytics")
          router.replace("/dashboard")
        }
      } catch (e) {
        console.error("Failed to parse user", e)
      }
    }
  }, [router])

  const { monthlyData, categoryData } = React.useMemo(() => {
    if (!records || records.length === 0) return { monthlyData: [], categoryData: [] }

    // 1. Monthly Trends (Last 12 months)
    const monthMap: Record<string, { income: number; expense: number }> = {}
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthStr = d.toLocaleString("default", { month: "short", year: "2-digit" })
      monthMap[monthStr] = { income: 0, expense: 0 }
    }

    records.forEach((r) => {
      const d = new Date(r.date)
      const monthStr = d.toLocaleString("default", { month: "short", year: "2-digit" })
      if (monthMap[monthStr]) {
        if (r.type === "income") monthMap[monthStr].income += r.amount
        if (r.type === "expense") monthMap[monthStr].expense += r.amount
      }
    })

    const monthlyD = Object.entries(monthMap).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))

    // 2. Category-wise Breakdown (dependent on type filter)
    const filteredForCategory = records.filter(r => r.type === typeFilter)
    
    const catMap: Record<string, number> = {}
    filteredForCategory.forEach(r => {
      catMap[r.category] = (catMap[r.category] || 0) + r.amount
    })

    const catD = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort descending

    return { monthlyData: monthlyD, categoryData: catD }
  }, [records, typeFilter])

  return (
    <div className="flex flex-col gap-6 pb-32">
      <div className="flex flex-col gap-2 px-4 lg:px-6 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Discover deeper insights into your spending and earnings.</p>
      </div>

      {isLoading ? (
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[432px] rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 flex flex-col gap-4">
               <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-zinc-800" />
                    <Skeleton className="h-3 w-48 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-8 w-24 bg-zinc-800" />
               </div>
               <div className="flex-1 flex items-center justify-center">
                  <Skeleton className="h-48 w-48 rounded-full bg-zinc-800" />
               </div>
               <div className="flex gap-2 justify-center">
                  <Skeleton className="h-3 w-12 bg-zinc-800" />
                  <Skeleton className="h-3 w-12 bg-zinc-800" />
                  <Skeleton className="h-3 w-12 bg-zinc-800" />
               </div>
            </div>
            <div className="h-[432px] rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 flex flex-col gap-4">
               <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-zinc-800" />
                  <Skeleton className="h-3 w-48 bg-zinc-800" />
               </div>
               <div className="flex-1 flex items-end gap-2 px-2">
                  {[...Array(12)].map((_, i) => (
                    <Skeleton key={i} className="flex-1 bg-zinc-800" style={{ height: `${Math.random() * 60 + 20}%` }} />
                  ))}
               </div>
            </div>
          </div>
        </div>
      ) : records.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground px-4 lg:px-6">
          No data available for analytics. Please add some transactions first!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
          
          <Card className="rounded-2xl shadow-sm bg-zinc-950/40 backdrop-blur-md border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Top categories by amount</CardDescription>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="h-80 w-full flex flex-col items-center justify-center relative">
              {categoryData.length === 0 ? (
                <div className="text-muted-foreground">No data for this type</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      itemStyle={{ color: '#fff' }}
                      contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none', color: '#fff' }}
                      formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {categoryData.length > 0 && (
                <div className="mt-4 flex flex-wrap max-h-20 overflow-y-auto gap-2 justify-center w-full px-4 text-center">
                  {categoryData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground whitespace-nowrap">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      {d.name}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm bg-zinc-950/40 backdrop-blur-md border-zinc-800">
            <CardHeader>
              <CardTitle>Year Overview</CardTitle>
              <CardDescription>Income vs Expense over 12 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    cursor={{ fill: '#333', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none', color: '#fff' }}
                    formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  )
}