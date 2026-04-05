"use client"

import api from '@/lib/api-client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
    User as UserIcon,
    Search,
    Filter,
    Trash2,
    ShieldCheck,
    Eye,
    BarChart2,
    Users,
    CircleDot,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from '@/components/ui/button'

type UserRecord = {
    _id: string
    name: string
    email: string
    role: "admin" | "analyst" | "viewer"
    isActive: boolean
    isVerified: boolean
    createdAt: string
    updatedAt: string
}

type UserCounts = {
    totalUsers: number
    totalAdmins: number
    totalAnalysts: number
    totalViewers: number
    totalActive: number
    totalInactive: number
}

type PaginationMeta = {
    currentPage: number
    totalPages: number
    limit: number
}

export interface GetAllUsersResponse {
    data: UserRecord[]
    counts: UserCounts
    pagination: PaginationMeta
}

const ROLES = ["viewer", "analyst", "admin"] as const
const LIMIT_OPTIONS = [5, 10, 20, 50] as const

const roleConfig: Record<string, {
    label: string
    icon: React.ReactNode
    color: string
    bg: string
    border: string
}> = {
    admin: {
        label: "Admin",
        icon: <ShieldCheck className="h-3 w-3" />,
        color: "text-violet-300",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
    },
    analyst: {
        label: "Analyst",
        icon: <BarChart2 className="h-3 w-3" />,
        color: "text-sky-300",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
    },
    viewer: {
        label: "Viewer",
        icon: <Eye className="h-3 w-3" />,
        color: "text-zinc-400",
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20",
    },
    user: {
        label: "Viewer",
        icon: <Eye className="h-3 w-3" />,
        color: "text-zinc-400",
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20",
    },
}

const StatCard = ({
    label,
    value,
    icon,
    borderColor,
}: {
    label: string
    value: number | string
    icon: React.ReactNode
    borderColor: string
}) => (
    <div className={cn(
        "relative flex-1 min-w-[130px] rounded-xl border p-4 overflow-hidden",
        "bg-zinc-900/60 backdrop-blur-sm transition-colors duration-200 hover:bg-zinc-900/80",
        borderColor,
    )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-end justify-between gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
            <span className="text-zinc-600 mb-0.5">{icon}</span>
        </div>
    </div>
)

const AvatarInitial = ({ name }: { name: string }) => {
    const gradients = [
        "from-violet-500 to-purple-700",
        "from-sky-500 to-blue-700",
        "from-emerald-500 to-teal-700",
        "from-rose-500 to-pink-700",
        "from-amber-500 to-orange-700",
    ]
    const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"
    const gradient = gradients[(name?.charCodeAt(0) ?? 0) % gradients.length]
    return (
        <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center",
            "text-[11px] font-bold text-white shrink-0 bg-gradient-to-br",
            gradient,
        )}>
            {initials}
        </div>
    )
}

const PaginationControls = ({
    page,
    pagination,
    limit,
    onPageChange,
    onLimitChange,
}: {
    page: number
    pagination: PaginationMeta | null
    limit: number
    onPageChange: (p: number) => void
    onLimitChange: (l: number) => void
}) => {
    const [jumpValue, setJumpValue] = useState("")

    if (!pagination || pagination.totalPages <= 1) return null

    const { totalPages, currentPage } = pagination

    // Build page number list with ellipsis markers
    const getPageItems = (): (number | "ellipsis-l" | "ellipsis-r")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        const items: (number | "ellipsis-l" | "ellipsis-r")[] = [1]
        if (currentPage > 3) items.push("ellipsis-l")
        const rangeStart = Math.max(2, currentPage - 1)
        const rangeEnd = Math.min(totalPages - 1, currentPage + 1)
        for (let i = rangeStart; i <= rangeEnd; i++) items.push(i)
        if (currentPage < totalPages - 2) items.push("ellipsis-r")
        items.push(totalPages)
        return items
    }

    const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        const p = parseInt(jumpValue, 10)
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
            onPageChange(p)
        }
        setJumpValue("")
    }

    const pageItems = getPageItems()

    return (
        <div className="px-4 lg:px-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* ── Left: rows per page ── */}
            <div className="flex items-center gap-2.5">
                <span className="text-xs text-zinc-500 whitespace-nowrap">Rows per page</span>
                <div className="flex items-center gap-1">
                    {LIMIT_OPTIONS.map(l => (
                        <button
                            key={l}
                            onClick={() => { onLimitChange(l); onPageChange(1) }}
                            className={cn(
                                "h-7 w-9 rounded-md border text-xs font-medium transition-all duration-150",
                                l === limit
                                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                            )}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Right: page navigation ── */}
            <div className="flex items-center gap-1.5">

                {/* First page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={page === 1}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="First page"
                >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                </button>

                {/* Previous */}
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Previous page"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pageItems.map((item, idx) => {
                        if (item === "ellipsis-l" || item === "ellipsis-r") {
                            return (
                                <span key={`${item}-${idx}`} className="h-7 w-7 flex items-center justify-center text-zinc-600 text-xs select-none">
                                    ···
                                </span>
                            )
                        }
                        return (
                            <button
                                key={item}
                                onClick={() => onPageChange(item)}
                                className={cn(
                                    "h-7 w-7 flex items-center justify-center rounded-md border text-xs font-medium transition-all duration-150",
                                    item === page
                                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                                )}
                            >
                                {item}
                            </button>
                        )
                    })}
                </div>

                {/* Next */}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Next page"
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>

                {/* Last page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={page === totalPages}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Last page"
                >
                    <ChevronsRight className="h-3.5 w-3.5" />
                </button>

                {/* Divider */}
                <div className="h-4 w-px bg-zinc-800 mx-1" />

                {/* Jump to page */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-500 whitespace-nowrap">Go to</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={jumpValue}
                        onChange={e => setJumpValue(e.target.value)}
                        onKeyDown={handleJump}
                        placeholder={String(page)}
                        className={cn(
                            "h-7 w-12 rounded-md border border-zinc-800 bg-zinc-900 px-2",
                            "text-xs text-zinc-200 placeholder:text-zinc-600",
                            "focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20",
                            "transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        )}
                    />
                </div>

                {/* Page count label */}
                <span className="text-xs text-zinc-600 whitespace-nowrap ml-1">
                    of {totalPages}
                </span>
            </div>

        </div>
    )
}

const UsersPage = () => {
    const [users, setUsers] = useState<UserRecord[]>([])
    const [counts, setCounts] = useState<UserCounts | null>(null)
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [pagination, setPagination] = useState<PaginationMeta | null>(null)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/users?page=${page}&limit=${limit}`)
            if (res.data.data) setUsers(res.data.data)
            if (res.data?.counts) setCounts(res.data.counts)
            if (res.data.pagination) setPagination(res.data.pagination)
        } catch (error) {
            console.error("Failed to fetch users", error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page, limit])

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId)
        try {
            await api.put(`/users/update/role/${userId}`, { role: newRole })
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole as UserRecord["role"] } : u))
            toast.success("Role updated successfully")
        } catch (error) {
            console.error("Failed to update role", error)
            toast.error("Failed to update role")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleDelete = async (userId: string) => {
        setUpdatingId(userId)
        try {
            await api.delete(`/users/${userId}`)
            setUsers(prev => prev.filter(u => u._id !== userId))
            toast.success("User deleted successfully")
            setUserToDelete(null)
        } catch (error) {
            console.error("Failed to delete user", error)
            toast.error("Failed to delete user")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleStatusChange = async (userId: string, newStatus: boolean) => {
        setUpdatingId(userId)
        try {
            await api.put(`/users/update/status/${userId}`, { isActive: newStatus })
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: newStatus } : u))
            toast.success("Status updated successfully")
        } catch (error) {
            console.error("Failed to update status", error)
            toast.error("Failed to update status")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
    }

    return (
        <div className="flex flex-col gap-6 min-h-screen bg-zinc-950 text-white">

            {/* ── Header ── */}
            <div className="px-4 lg:px-8 pt-8 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight leading-none">Users</h1>
                        <p className="text-zinc-500 text-sm mt-0.5">Manage roles and access for platform users.</p>
                    </div>
                </div>
            </div>

            {/* ── Stats strip ── */}
            <div className="px-4 lg:px-8">
                {loading ? (
                    <div className="flex items-center gap-2 text-zinc-600 text-sm py-6">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading stats…
                    </div>
                ) : counts ? (
                    <div className="flex gap-3 flex-wrap">
                        <StatCard label="Total Users" value={counts.totalUsers} icon={<Users className="h-5 w-5" />} borderColor="border-zinc-800" />
                        <StatCard label="Admins" value={counts.totalAdmins} icon={<ShieldCheck className="h-5 w-5" />} borderColor="border-violet-500/20" />
                        <StatCard label="Analysts" value={counts.totalAnalysts} icon={<BarChart2 className="h-5 w-5" />} borderColor="border-sky-500/20" />
                        <StatCard label="Viewers" value={counts.totalViewers} icon={<Eye className="h-5 w-5" />} borderColor="border-zinc-700" />
                        <StatCard label="Active" value={counts.totalActive} icon={<CircleDot className="h-5 w-5 text-emerald-400" />} borderColor="border-emerald-500/20" />
                        <StatCard label="Inactive" value={counts.totalInactive} icon={<CircleDot className="h-5 w-5 text-red-400" />} borderColor="border-red-500/20" />
                    </div>
                ) : null}
            </div>

            {/* ── Toolbar ── */}
            <div className="px-4 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <Input
                        placeholder="Search users…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-violet-500/40 focus-visible:border-zinc-600"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 h-9 text-sm border rounded-lg bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors">
                                <Filter className="h-3.5 w-3.5 opacity-70" />
                                Status
                                <ChevronDown className="h-3 w-3 opacity-50 ml-0.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800">All</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 text-emerald-400">Active</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 text-red-400">Inactive</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 h-9 text-sm border rounded-lg bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors">
                                <UserIcon className="h-3.5 w-3.5 opacity-70" />
                                Role
                                <ChevronDown className="h-3 w-3 opacity-50 ml-0.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800">All</DropdownMenuItem>
                            {ROLES.map(role => (
                                <DropdownMenuItem key={role} className="capitalize cursor-pointer focus:bg-zinc-800">
                                    {role}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="px-4 lg:px-8">
                <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-24 text-zinc-500 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading users…
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-2 text-zinc-500">
                            <Users className="h-8 w-8 opacity-30" />
                            <p className="text-sm">No users registered yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-800">
                                    <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider pl-5">User</TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Role</TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider text-center">Joined</TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider text-center">Status</TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-semibold uppercase tracking-wider text-right pr-5">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {users.map((user) => {
                                    const isUpdating = updatingId === user._id
                                    const isActive = user.isActive !== false
                                    const role = roleConfig[user.role] ?? roleConfig.viewer

                                    return (
                                        <TableRow
                                            key={user._id}
                                            className={cn(
                                                "border-zinc-800/60 transition-colors",
                                                isUpdating ? "opacity-50 pointer-events-none" : "hover:bg-white/[0.02]",
                                            )}
                                        >
                                            <TableCell className="pl-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <AvatarInitial name={user.name} />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-medium text-zinc-100 truncate">{user.name}</span>
                                                        <span className="text-xs text-zinc-500 truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-3.5">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className={cn(
                                                            "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-md transition-colors hover:brightness-110",
                                                            role.color, role.bg, role.border,
                                                        )}>
                                                            {role.icon}
                                                            {role.label}
                                                            <ChevronDown className="h-3 w-3 opacity-50 ml-0.5" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                                        {ROLES.map(r => (
                                                            <DropdownMenuItem
                                                                key={r}
                                                                className="capitalize cursor-pointer focus:bg-zinc-800"
                                                                onClick={() => handleRoleChange(user._id, r)}
                                                            >
                                                                {r}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>

                                            <TableCell className="text-center text-xs text-zinc-500 py-3.5">
                                                {new Date(user.createdAt).toLocaleDateString("en-IN")}
                                            </TableCell>

                                            <TableCell className="text-center py-3.5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={cn(
                                                        "text-xs font-medium",
                                                        isActive ? "text-emerald-400" : "text-red-400"
                                                    )}>
                                                        {isActive ? "Active" : "Inactive"}
                                                    </span>
                                                    <Switch
                                                        checked={isActive}
                                                        onCheckedChange={(checked) => handleStatusChange(user._id, checked)}
                                                    />
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right pr-5 py-3.5">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 border-zinc-800 bg-transparent text-zinc-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-colors cursor-pointer"
                                                    onClick={() => setUserToDelete(user)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            <PaginationControls
                page={page}
                pagination={pagination}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
            />

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete user?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            This action cannot be undone. The account for{" "}
                            <span className="font-medium text-white">{userToDelete?.name}</span>{" "}
                            will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                if (userToDelete) handleDelete(userToDelete._id)
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white border-0"
                        >
                            {updatingId === userToDelete?._id
                                ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                : null}
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default UsersPage