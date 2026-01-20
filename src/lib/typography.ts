// Typography constants following Apple's SF Pro style using Inter
export const typography = {
    // Headings (Manrope)
    display: {
        fontFamily: "'Manrope', sans-serif",
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
    },

    // Body text (DM Sans)
    text: {
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.6,
        letterSpacing: 0,
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
