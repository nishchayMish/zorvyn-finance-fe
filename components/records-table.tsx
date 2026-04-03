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
import { Badge } from "@/components/ui/badge"
import { RecordData } from "@/lib/services/record-service"
import { cn } from "@/lib/utils"
import { PencilIcon } from "lucide-react"
import { Button } from "./ui/button"
import { EditRecordDialog } from "./edit-record-dialog"


interface RecordsTableProps {
  records: RecordData[]
  loading?: boolean
  onRefresh?: () => void
}


export function RecordsTable({ records, loading, onRefresh }: RecordsTableProps) {
  const [editingRecord, setEditingRecord] = React.useState<RecordData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const handleEditClick = (record: RecordData) => {
    setEditingRecord(record)
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading records...
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        No transactions found. Add some to get started!
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-zinc-900/10 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record._id} className="hover:bg-zinc-900/40">
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    record.type === "income"
                      ? "border-green-500/50 bg-green-500/10 text-green-500"
                      : "border-red-500/50 bg-red-500/10 text-red-500"
                  )}
                >
                  {record.type}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{record.category}</TableCell>
              <TableCell className="text-muted-foreground">{record.note || "-"}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(record.date))}
              </TableCell>
              <TableCell className={cn(
                "text-right font-semibold",
                record.type === "income" ? "text-green-500" : "text-red-500"
              )}>
                {record.type === "income" ? "+" : "-"}${record.amount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(record)}
                  className="text-gray-500 hover:text-gray-200 hover:bg-gray-500/10"
                >
                  <PencilIcon className="size-4" />
                </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
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
