/**
 * Input Sanitization Utilities
 * WAF-like protection against SQL injection patterns and XSS
 */

// Dangerous SQL injection patterns
const SQL_INJECTION_PATTERNS = [
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|EXECUTE)\s)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,    // OR 1=1, AND 1=1
    /(--|;--|\/\*|\*\/)/g,                  // SQL comments
    /(\bDROP\s+TABLE\b)/gi,
    /(\bUNION\s+SELECT\b)/gi,
    /(\bINTO\s+OUTFILE\b)/gi,
    /(\bLOAD_FILE\b)/gi,
    /(\\x27|\\x22)/g,                      // Hex encoded quotes
    /(\b(CHAR|NCHAR|VARCHAR|NVARCHAR)\s*\()/gi,
];

// Dangerous XSS patterns
const XSS_PATTERNS = [
    /<script[\s>]/gi,
    /javascript\s*:/gi,
    /on\w+\s*=/gi,                          // onclick=, onerror=, etc.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
];

/**
 * Check if a string contains SQL injection patterns
 */
export function containsSQLInjection(input: string): boolean {
    return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Check if a string contains XSS patterns
 */
export function containsXSS(input: string): boolean {
    return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Check if input is dangerous (SQL injection or XSS)
 */
export function isDangerousInput(input: string): boolean {
    if (typeof input !== "string") return false;
    // Reset regex lastIndex for global patterns
    SQL_INJECTION_PATTERNS.forEach((p) => (p.lastIndex = 0));
    XSS_PATTERNS.forEach((p) => (p.lastIndex = 0));
    return containsSQLInjection(input) || containsXSS(input);
}

/**
 * Recursively scan all string values in an object for dangerous patterns
 * Returns the first dangerous value found, or null if clean
 */
export function findDangerousInput(obj: unknown): string | null {
    if (typeof obj === "string") {
        return isDangerousInput(obj) ? obj : null;
    }
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const result = findDangerousInput(item);
            if (result) return result;
        }
    }
    if (obj !== null && typeof obj === "object") {
        for (const value of Object.values(obj)) {
            const result = findDangerousInput(value);
            if (result) return result;
        }
    }
    return null;
}

/**
 * Sanitize a string by escaping HTML entities
 */
export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
