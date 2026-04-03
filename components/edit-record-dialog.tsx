"use client"

import * as React from "react"
import { Loader2Icon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { recordService, RecordData } from "@/lib/services/record-service"

interface EditRecordDialogProps {
  record: RecordData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRecordUpdated?: () => void
  onRecordDeleted?: () => void
}

export function EditRecordDialog({ 
  record, 
  open, 
  onOpenChange, 
  onRecordUpdated,
  onRecordDeleted 
}: EditRecordDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<RecordData>({
    amount: 0,
    type: "expense",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    note: "",
  })

  // Update form data when record changes
  React.useEffect(() => {
    if (record) {
      setFormData({
        ...record,
        date: record.date ? new Date(record.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
      })
    }
  }, [record])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setLoading(true)
    try {
      // Mocking API call for now as requested
      // await recordService.updateRecord(record?._id!, formData)
      console.log("Updating record:", record?._id, formData)
      toast.success("Record updated successfully (Mock)")
      onOpenChange(false)
      if (onRecordUpdated) onRecordUpdated()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update record")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!record?._id) return
    
    if (!confirm("Are you sure you want to delete this record?")) return

    setDeleteLoading(true)
    try {
      // Mocking API call for now as requested
      // await recordService.deleteRecord(record._id)
      console.log("Deleting record:", record._id)
      toast.success("Record deleted successfully (Mock)")
      onOpenChange(false)
      if (onRecordDeleted) onRecordDeleted()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete record")
    } finally {
      setDeleteLoading(false)
    }
  }

  const categories = formData.type === "income" 
    ? ["Salary", "Freelance", "Investment", "Gift", "Other"]
    : ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Shopping", "Health", "Other"]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md border-white/5 bg-zinc-950">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">Edit Record</SheetTitle>
            <SheetDescription>
              Update your transaction details or remove it entirely.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 space-y-6 px-4 py-6">
            <div className="space-y-3">
              <Label>Type</Label>
              <ToggleGroup 
                type="single" 
                value={formData.type} 
                onValueChange={(value) => value && setFormData(prev => ({ ...prev, type: value as "income" | "expense", category: value === "income" ? "Salary" : "Food" }))}
                className="grid grid-cols-2 gap-2"
              >
                <ToggleGroupItem value="expense" className="data-[state=on]:bg-red-500/10 data-[state=on]:text-red-500 data-[state=on]:border-red-500/50">
                  Expense
                </ToggleGroupItem>
                <ToggleGroupItem value="income" className="data-[state=on]:bg-green-500/10 data-[state=on]:text-green-500 data-[state=on]:border-green-500/50">
                  Income
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="edit-amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7 text-lg font-medium bg-white/5 border-white/10"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="edit-category" className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                className="bg-white/5 border-white/10"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note">Note</Label>
              <Input
                id="edit-note"
                placeholder="Add a remark..."
                className="bg-white/5 border-white/10"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              />
            </div>
          </div>

          <SheetFooter className="p-4 pt-0 flex-col gap-3 sm:flex-col">
            <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200" disabled={loading || deleteLoading}>
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : "Update Transaction"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              onClick={handleDelete}
              disabled={loading || deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2Icon className="mr-2 size-4" />
                  Delete Record
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
