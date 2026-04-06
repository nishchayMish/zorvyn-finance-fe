"use client"

import * as React from "react"
import { PlusIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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

interface AddRecordDialogProps {
  onRecordAdded?: () => void
  triggerBtn?: React.ReactNode
}

export function AddRecordDialog({ onRecordAdded, triggerBtn }: AddRecordDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState<RecordData>({
    amount: 0,
    type: "expense",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    note: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setLoading(true)
    try {
      const res = await recordService.createRecord(formData)
      if (res.success) {
        toast.success("Record added successfully")
        setOpen(false)
        setFormData({
          amount: 0,
          type: "expense",
          category: "Food",
          date: new Date().toISOString().split("T")[0],
          note: "",
        })
        if (onRecordAdded) onRecordAdded()
      } else {
        toast.error(res.message || "Failed to add record")
      }
    } catch (error: any) {
      toast.error("Failed to add record")
    } finally {
      setLoading(false)
    }
  }

  const categories = formData.type === "income" 
    ? ["Salary", "Freelance", "Investment", "Gift", "Other"]
    : ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Shopping", "Health", "Other"]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerBtn ? (
          triggerBtn
        ) : (
          <Button className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95" size="icon">
            <PlusIcon className="size-6" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">Add New Record</SheetTitle>
            <SheetDescription>
              Keep track of your finances by adding a new income or expense.
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
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7 text-lg font-medium"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                placeholder="Add a remark..."
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              />
            </div>
          </div>

          <SheetFooter className="p-4 pt-0">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Transaction"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
