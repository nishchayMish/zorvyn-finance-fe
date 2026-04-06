"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailAction } from "@/lib/actions/auth-actions";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Missing verification token.");
                return;
            }

            try {
                const res = await verifyEmailAction(token);
                if (res.success) {
                    setStatus("success");
                    setMessage(res.message || "Email verified successfully!");
                    toast.success("Email verified! You can now login.");
                    // Auto redirect after 3 seconds
                    setTimeout(() => {
                        router.push("/login?verified=true");
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(res.message || "Verification failed.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            }
        };

        verify();
    }, [token, router]);

    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
            {/* Glow */}
            <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] bottom-[-100px] right-[-100px]" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 text-center">
                {/* Branding */}
                <div className="mb-8">
                    <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-white bg-clip-text text-transparent">
                        Zorvyn
                    </h1>
                </div>

                <div className="space-y-6">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                            <h2 className="text-2xl font-semibold">Verifying Email</h2>
                            <p className="text-neutral-400">{message}</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                            <h2 className="text-2xl font-semibold text-white">Verification Successful</h2>
                            <p className="text-neutral-400">{message}</p>
                            <p className="text-xs text-neutral-500 italic">Redirecting to login...</p>
                            <Button asChild className="w-full bg-white text-black hover:bg-neutral-200 mt-4">
                                <Link href="/login">Login Now</Link>
                            </Button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4">
                            <XCircle className="h-12 w-12 text-red-500" />
                            <h2 className="text-2xl font-semibold text-white">Verification Failed</h2>
                            <p className="text-neutral-400">{message}</p>
                            <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white mt-4">
                                <Link href="/signup">Back to Signup</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
