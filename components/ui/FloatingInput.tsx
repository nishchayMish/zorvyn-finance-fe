"use client";

import { useState } from "react";

export function FloatingInput({
    label,
    type = "text",
    value,
    onChange,
    required = false,
}: {
    label: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}) {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required={required}
                className="w-full h-11 px-3 pt-4 bg-white/5 border border-white/10 rounded-lg text-sm outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition text-white"
            />
            <label
                className={`absolute left-3 text-xs transition-all pointer-events-none ${focused || value
                    ? "top-1 text-neutral-400"
                    : "top-3 text-neutral-500"
                    }`}
            >
                {label}
            </label>
        </div>
    );
}