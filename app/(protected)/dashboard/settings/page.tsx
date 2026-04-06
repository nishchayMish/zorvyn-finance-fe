"use client";

import React, { useEffect, useState } from 'react';
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMeAction, updateUserCredentialsAction } from "@/lib/actions/user-actions";

export default function SettingsPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const getMe = async () => {
            try {
                const res = await getMeAction();
                if (res.success && res.user) {
                    setUserId(res.user._id || "");
                    setFullName(res.user.name || "");
                    setEmail(res.user.email || "");
                }
            } catch (error) {
                console.log("unable to get user", error);
            }
        }
        getMe();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const payload = { name: fullName, password: password || undefined };
            const res = await updateUserCredentialsAction(userId, payload);
            if (res.success) {
                toast.success("Profile updated successfully");
                // Update local storage if needed
                if (res.user) {
                    localStorage.setItem("user", JSON.stringify(res.user));
                }
            } else {
                toast.error(res.message || "Failed to update profile");
            }
        } catch (error) {
            console.log("unable to update user", error);
            toast.error("Failed to update profile");
        }
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
            </div>
        </div>
    );
}