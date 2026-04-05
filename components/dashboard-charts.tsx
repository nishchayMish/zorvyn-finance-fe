"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis, PieChart, Pie, Cell } from "recharts"
import { RecordData } from "@/lib/services/record-service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function DashboardCharts({ records, loading }: { records: RecordData[], loading: boolean }) {
  const [monthlyData, setMonthlyData] = React.useState<any[]>([])
  const [incomeExpenseData, setIncomeExpenseData] = React.useState<any[]>([])

  React.useEffect(() => {
    if (!records || records.length === 0) return

    // Calculate Income vs Expense
    let totalIncome = 0
    let totalExpense = 0
    records.forEach(r => {
      if (r.type === "income") totalIncome += r.amount
      else if (r.type === "expense") totalExpense += r.amount
    })

    setIncomeExpenseData([
      { name: "Income", value: totalIncome, color: "#22c55e" }, // green-500
      { name: "Expense", value: totalExpense, color: "#ef4444" }, // red-500
    ])

    // Calculate Monthly Trends (Last 6 months)
    const monthMap: Record<string, { income: number; expense: number }> = {}

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
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

    setMonthlyData(Object.entries(monthMap).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    })))

  }, [records])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
        <div className="h-72 rounded-2xl bg-zinc-900/10 animate-pulse" />
        <div className="h-72 rounded-2xl bg-zinc-900/10 animate-pulse" />
      </div>
    )
  }

  if (records.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">

      {/* Monthly Trends Bar Chart */}
      <Card className="rounded-2xl shadow-sm bg-zinc-950/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Income and Expenses over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
              <Tooltip
                cursor={{ fill: '#333', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none', color: '#fff' }}
              />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income vs Expense Pie Chart */}
      <Card className="rounded-2xl shadow-sm bg-zinc-950/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Income vs Expense</CardTitle>
          <CardDescription>Overall distribution</CardDescription>
        </CardHeader>
        <CardContent className="h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeExpenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {incomeExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                itemStyle={{ color: '#fff' }}
                contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none', color: '#fff' }}
                formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
}
