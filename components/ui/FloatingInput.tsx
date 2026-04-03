"use client";

import { useState } from "react";

export function FloatingInput({
    label,
    type = "text",
}: {
    label: string;
    type?: string;
}) {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState("");

    return (
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full h-11 px-3 pt-4 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition"
            />
            <label
                className={`absolute left-3 text-xs transition-all ${focused || value
                        ? "top-1 text-neutral-400"
                        : "top-3 text-neutral-500"
                    }`}
            >
                {label}
            </label>
        </div>
    );
}