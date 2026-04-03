"use client";

import React, { useEffect, useState } from 'react';
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setFullName(user.name || "");
        setEmail(user.email || "");
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Just mock success since the user doesn't want API calls
        toast.success("Profile updated successfully (Mock)");
        console.log({ fullName, email, password });
    };

    const handleDeleteAccount = () => {
        // Mock delete logic
        toast.success("Account deleted successfully (Mock)");
        setIsDeleteDialogOpen(false);
        // would normally redirect to login
    };

    return (
        <div className="px-4 lg:px-6 max-w-4xl relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Settings</h1>
                <p className="text-neutral-400 mt-2">Update your personal information and security settings.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Profile Information</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Change your name and communication preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingInput
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <FloatingInput
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <h3 className="text-md font-medium mb-4">Security</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <FloatingInput
                                            label="New Password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <FloatingInput
                                            label="Confirm New Password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    className="px-8 bg-white text-black hover:bg-neutral-200 transition-all font-medium"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-sm opacity-100">
                    <CardHeader>
                        <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Permanently delete your account and all associated data. This action is irreversible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                        >
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-semibold text-white mb-2">Delete Account?</h2>
                        <p className="text-neutral-400 mb-6">
                            Are you absolutely sure you want to delete your account? This will permanently remove all your data and cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="text-neutral-400 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                className="bg-red-600 hover:bg-red-700 text-white px-6"
                            >
                                Delete Permanently
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}