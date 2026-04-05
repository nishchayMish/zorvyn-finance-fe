"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RecordData } from "@/lib/services/record-service"
import { cn } from "@/lib/utils"
import { PencilIcon, Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "./ui/button"
import { EditRecordDialog } from "./edit-record-dialog"

interface RecordsTableProps {
  records: RecordData[]
  loading?: boolean
  onRefresh?: () => void
  hideActions?: boolean
}

export function RecordsTable({ records, loading, onRefresh, hideActions = false }: RecordsTableProps) {
  const [editingRecord, setEditingRecord] = React.useState<RecordData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [userRole, setUserRole] = React.useState<string>("viewer")

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

  const handleEditClick = (record: RecordData) => {
    setEditingRecord(record)
    setIsEditDialogOpen(true)
  }

  const showActions = !hideActions && userRole === "admin"

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-zinc-500 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading records…
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2 text-zinc-500">
          <ArrowUpRight className="h-8 w-8 opacity-30" />
          <p className="text-sm">No records found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider pl-5">Type</TableHead>
              <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Category</TableHead>
              <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Note</TableHead>
              <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider text-center">Date</TableHead>
              <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider text-right">Amount</TableHead>
              {showActions && <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider text-right pr-5">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => {
              const isIncome = record.type === "income"
              return (
                <TableRow key={record._id} className="border-zinc-800/60 transition-colors hover:bg-white/[0.02]">
                  <TableCell className="pl-5 py-3.5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-md",
                      isIncome 
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                        : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    )}>
                      {isIncome ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                      {record.type}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-sm font-medium text-zinc-100 capitalize">{record.category}</span>
                  </TableCell>
                  <TableCell className="py-3.5 max-w-[200px]">
                    <p className="text-sm text-zinc-500 truncate" title={record.note}>
                      {record.note || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-center text-xs text-zinc-500 py-3.5">
                    {new Intl.DateTimeFormat("en-IN", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(record.date))}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-bold tabular-nums py-3.5",
                    isIncome ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {isIncome ? "+" : "-"}₹{record.amount.toLocaleString()}
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right pr-5 py-3.5">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(record)}
                        className="h-8 w-8 border-zinc-800 bg-transparent text-zinc-500 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      <EditRecordDialog
        record={editingRecord}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onRecordUpdated={onRefresh}
        onRecordDeleted={onRefresh}
      />
    </div>
  )
}
