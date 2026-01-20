"use client";

import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";

        const initialTheme = savedTheme || systemTheme;
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <div className="theme-wrapper">
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-dark-700 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
                aria-label="Toggle theme"
            >
                {theme === "light" ? "🌙" : "☀️"}
            </button>
            {children}
        </div>
    );
}
