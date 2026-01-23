'use client';

import { useEffect } from 'react';
import { initConsoleWelcome } from '@/lib/console-welcome';

/**
 * ConsoleWelcome Component
 * 
 * Initializes the custom console welcome message
 * Runs only once when the app loads
 */
export function ConsoleWelcome() {
    useEffect(() => {
        initConsoleWelcome();
    }, []); // Run only once on mount

    return null; // This component doesn't render anything
}
