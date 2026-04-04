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
import { ChevronDown, Loader2, User as UserIcon, Search, Filter, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from '@/components/ui/button'

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive?: boolean;
    createdAt: string;
}

const ROLES = ["viewer", "analyst", "admin"]

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users")
                setUsers(res.data.users)
            } catch (error) {
                console.error("Failed to fetch users", error)
                toast.error("Failed to load users")
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId)
        try {
            await api.patch(`/users/${userId}`, { role: newRole })
            setUsers(prev =>
                prev.map(u => u._id === userId ? { ...u, role: newRole } : u)
            )
            toast.success("Role updated successfully")
        } catch (error) {
            console.error("Failed to update role", error)
            toast.error("Failed to update role")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        setUpdatingId(userId)
        try {
            await api.patch(`/users/${userId}`, { isActive: !currentStatus })
            setUsers(prev =>
                prev.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u)
            )
            toast.success(`User ${!currentStatus ? "activated" : "deactivated"}`)
        } catch (error) {
            console.error("Failed to update status", error)
            toast.error("Failed to update status")
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

    return (
        <div className="flex flex-col gap-6 pb-32">
            {/* Header */}
            <div className="flex flex-col gap-1 px-4 lg:px-6 mt-4">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground mt-1">
                    Manage roles and access for platform users.
                </p>
            </div>

            {/* Stats strip */}
            <div className="px-4 lg:px-6 flex gap-3 flex-wrap">
                {[
                    { label: "Total Users", value: users.length, color: "text-white" },
                    { label: "Active", value: users.filter(u => u.isActive !== false).length, color: "text-green-400" },
                    { label: "Inactive", value: users.filter(u => u.isActive === false).length, color: "text-red-400" },
                    { label: "Admins", value: users.filter(u => u.role === "admin").length, color: "text-purple-400" },
                ].map(stat => (
                    <div
                        key={stat.label}
                        className="flex flex-col gap-0.5 rounded-lg border border-white/10 bg-white/5 px-4 py-3 min-w-[100px]"
                    >
                        <span className={cn("text-xl font-bold tabular-nums", stat.color)}>
                            {stat.value}
                        </span>
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="px-4 lg:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">

                {/* Search */}
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-zinc-900/40 border-white/10 text-white"
                    />
                </div>

                {/* Filters (UI ONLY) */}
                <div className="flex items-center gap-2">

                    {/* Status Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-white/10 rounded-md bg-zinc-900/40 hover:bg-white/5">
                                <Filter className="h-4 w-4 opacity-70" />
                                Status
                                <ChevronDown className="h-3 w-3 opacity-60" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-white/10">
                            <DropdownMenuItem className="cursor-pointer">All</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-green-400">Active</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-400">Inactive</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Role Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-white/10 rounded-md bg-zinc-900/40 hover:bg-white/5">
                                <UserIcon className="h-4 w-4 opacity-70" />
                                Role
                                <ChevronDown className="h-3 w-3 opacity-60" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-900 border-white/10">
                            <DropdownMenuItem className="cursor-pointer">All</DropdownMenuItem>
                            {ROLES.map(role => (
                                <DropdownMenuItem key={role} className="capitalize cursor-pointer">
                                    {role}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            {/* Table */}
            <div className="px-4 lg:px-6">
                <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900/20 backdrop-blur-sm">
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading users...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex items-center justify-center py-20 text-muted-foreground">
                            No users registered yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-center">Created At</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {users.map((user) => {
                                    const isUpdating = updatingId === user._id
                                    const isActive = user.isActive !== false

                                    return (
                                        <TableRow key={user._id} className="border-white/5 hover:bg-white/5">
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>

                                            <TableCell>
                                                <span className="capitalize">{user.role}</span>
                                            </TableCell>

                                            <TableCell className="text-center text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString("en-IN")}
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={isActive ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                                                        {isActive ? "Active" : "Inactive"}
                                                    </span>
                                                    <Switch checked={isActive} />
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Button
                                                    className='text-red-400 cursor-pointer'
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setUserToDelete(user)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            This action cannot be undone. This will permanently delete the user
                            account for <span className="font-medium text-white">{userToDelete?.name}</span> and remove their
                            data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                if (userToDelete) handleDelete(userToDelete._id);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white border-0"
                        >
                            {updatingId === userToDelete?._id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default UsersPage