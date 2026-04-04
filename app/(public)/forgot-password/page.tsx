"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { toast } from "sonner";
import api from "@/lib/api-client";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post("/users/forgot-password", { email });

            if (res.status === 200) {
                toast.success("Reset link sent!");
                setIsSubmitted(true);
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
            {/* Glow */}
            <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] bottom-[-100px] right-[-100px]" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8">
                {/* Branding */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-white bg-clip-text text-transparent">
                        Zorvyn
                    </h1>
                    <Link 
                        href="/login" 
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition"
                    >
                        <ArrowLeft size={14} /> Back to login
                    </Link>
                </div>

                {!isSubmitted ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-2">Forgot password?</h2>
                        <p className="text-sm text-neutral-400 mb-8">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FloatingInput
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-white text-black hover:bg-neutral-200"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Sending link..." : "Send reset link"}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
                        <p className="text-sm text-neutral-400 mb-6">
                            We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Please check your inbox.
                        </p>
                        <Button 
                            asChild
                            variant="outline"
                            className="w-full border-white/10 hover:bg-white/5 text-white"
                        >
                            <Link href="/login">Return to login</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
