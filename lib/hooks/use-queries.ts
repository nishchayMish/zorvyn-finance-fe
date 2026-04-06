/**
 * Centralized TanStack Query hooks for Zorvyn.
 * All data fetching goes through these hooks so pages benefit from
 * caching, background refresh, and deduplication automatically.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { recordService } from "@/lib/services/record-service"
import {
  getUsersAction,
  updateUserRoleAction,
  updateUserStatusAction,
  deleteUserAction,
} from "@/lib/actions/user-actions"
import { toast } from "sonner"

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const queryKeys = {
  summary: ["summary"] as const,
  records: (params?: Record<string, any>) => ["records", params ?? {}] as const,
  allRecords: ["records", "all"] as const,
  users: (params?: Record<string, any>) => ["users", params ?? {}] as const,
}

// ─── Record Hooks ─────────────────────────────────────────────────────────────

export function useSummary() {
  return useQuery({
    queryKey: queryKeys.summary,
    queryFn: () => recordService.getSummary(),
    staleTime: 2 * 60 * 1000,
  })
}

export function useRecords(params?: {
  page?: number
  limit?: number
  type?: string
  category?: string
  search?: string
}) {
  return useQuery({
    queryKey: queryKeys.records(params),
    queryFn: () => recordService.getRecords(params),
    staleTime: 60 * 1000, // 1 min — records change more often
    placeholderData: (prev) => prev, // Keep previous page data while fetching new page
  })
}

export function useAllRecords() {
  return useQuery({
    queryKey: queryKeys.allRecords,
    queryFn: () => recordService.getRecords(),
    staleTime: 2 * 60 * 1000,
  })
}

// ─── User Hooks ───────────────────────────────────────────────────────────────

export function useUsers(params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}) {
  return useQuery({
    queryKey: queryKeys.users(params),
    queryFn: async () => {
      const res = await getUsersAction(params)
      if (!res.success) throw new Error(res.message || "Failed to load users")
      return res
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRoleAction(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Role updated")
    },
    onError: () => toast.error("Failed to update role"),
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateUserStatusAction(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Status updated")
    },
    onError: () => toast.error("Failed to update status"),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => deleteUserAction(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User deleted")
    },
    onError: () => toast.error("Failed to delete user"),
  })
}
