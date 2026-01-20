import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes with proper override handling
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(d);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(d);
}

/**
 * Calculate days between two dates
 */
export function daysBetween(start: Date | string, end: Date | string): number {
    const startDate = typeof start === "string" ? new Date(start) : start;
    const endDate = typeof end === "string" ? new Date(end) : end;
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}
