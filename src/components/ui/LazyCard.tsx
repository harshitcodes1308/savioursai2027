'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyCardProps {
    children: React.ReactNode;
    className?: string;
    fallbackHeight?: string;
}

/**
 * LazyCard - Lazy loads content when scrolled into viewport
 * 
 * OPTIMIZATION: Improves initial page load by only rendering
 * cards when they're about to be visible
 * 
 * @param children - Content to lazy load
 * @param className - Optional className for styling
 * @param fallbackHeight - Height of skeleton loader (default: 200px)
 */
export function LazyCard({ children, className = '', fallbackHeight = '200px' }: LazyCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    console.log('💫 LazyCard: Rendering card in viewport');
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once loaded
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before entering viewport
                threshold: 0.01
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={cardRef} className={className}>
            {isVisible ? (
                children
            ) : (
                // Skeleton loader
                <div
                    className="dashboard-card animate-pulse"
                    style={{ height: fallbackHeight }}
                >
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
            )}
        </div>
    );
}
