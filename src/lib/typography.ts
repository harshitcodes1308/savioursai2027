// Typography constants — SF Pro Display system
export const typography = {
    // Headings — SF Pro Display Bold
    display: {
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif",
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        fontWeight: 700,
    },

    // Body text — SF Pro Text / Inter fallback
    text: {
        fontFamily: "'SF Pro Text', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'DM Sans', 'Helvetica Neue', sans-serif",
        lineHeight: 1.6,
        letterSpacing: 0,
        fontWeight: 400,
    },

    // Weight shortcuts
    weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
} as const;

// Helper function to create heading styles
export const heading = (size: number, weight: 600 | 700 = 600) => ({
    ...typography.display,
    fontSize: `${size}px`,
    fontWeight: weight,
});

// Helper function to create body text styles
export const bodyText = (size: number, weight: 400 | 500 = 400) => ({
    ...typography.text,
    fontSize: `${size}px`,
    fontWeight: weight,
});
