"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/api-client";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            email,
            password,
        }
        try {
            setLoading(true);
            const res = await api.post("/users/login", payload);

            if (res.status === 200) {
                toast.success("Welcome back!");
                localStorage.setItem("user", JSON.stringify(res.data.user));
                router.push("/dashboard");
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || "Invalid credentials. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">

            {/* Glow */}
            <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[120px] top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-indigo-600/30 blur-[120px] bottom-[-100px] right-[-100px]" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

                {/* Branding */}
                <div className="mb-6">
                    <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-white bg-clip-text text-transparent">
                        Zorvyn
                    </h1>
                </div>

                <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
                <p className="text-sm text-neutral-400 mb-6">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FloatingInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="relative">
                        <FloatingInput
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    {/* Forgot password */}
                    <div className="flex justify-end -mt-2">
                        <Link
                            href="/forgot-password"
                            className="text-xs text-neutral-400 hover:text-white transition"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-neutral-200">
                        {loading ? "Signing in..." : "Login"}
                    </Button>
                </form>

                <p className="text-sm text-neutral-500 mt-6 text-center">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}