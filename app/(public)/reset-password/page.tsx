"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api-client";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isReset, setIsReset] = useState(false);

    useEffect(() => {
        if (token === null) {
            // Waiting for hydration
            return;
        }
        if (!token) {
            toast.error("Invalid or missing reset token.");
            router.push("/login");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post(`/users/reset-password?token=${token}`, { newPassword });

            if (res.status === 200) {
                toast.success("Password reset successful!");
                setIsReset(true);
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!token && token !== null) return null;

    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
            {/* Glow */}
            <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] bottom-[-100px] right-[-100px]" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8">
                {/* Branding */}
                <div className="mb-6">
                    <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-white bg-clip-text text-transparent">
                        Zorvyn
                    </h1>
                </div>

                {!isReset ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-2">Create new password</h2>
                        <p className="text-sm text-neutral-400 mb-8">
                            Join the futuristics with your new credentials.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <FloatingInput
                                    label="New Password"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <FloatingInput
                                label="Confirm New Password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <Button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-white text-black hover:bg-neutral-200"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Resetting..." : "Reset password"}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400">
                           <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Password reset successful</h2>
                        <p className="text-sm text-neutral-400 mb-8">
                            Your password has been successfully updated. You can now use your new password to log in.
                        </p>
                        <Button 
                            asChild
                            className="w-full bg-white text-black hover:bg-neutral-200"
                        >
                            <Link href="/login">Back to login</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
