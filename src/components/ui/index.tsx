// Loading Skeleton Components
export function CardSkeleton() {
    return (
        <div className="rounded-2xl bg-gray-800 border border-gray-700 p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-700 rounded mb-4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="rounded-2xl bg-gray-800 border border-gray-700 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-700 rounded"></div>
            </div>
            <div className="h-12 bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-32"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="rounded-2xl bg-gray-800 border border-gray-700 p-6">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 mb-4 animate-pulse">
                    <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Empty State Components
interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="rounded-2xl bg-gray-800 border border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4 animate-bounce">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 rounded-lg bg-primary hover:bg-cyan-500 text-white font-semibold transition-all transform hover:scale-105"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

// Error State Component
interface ErrorStateProps {
    title?: string;
    message: string;
    retry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    message,
    retry,
}: ErrorStateProps) {
    return (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-300 mb-2">{title}</h3>
            <p className="text-red-400 mb-6 max-w-md mx-auto">{message}</p>
            {retry && (
                <button
                    onClick={retry}
                    className="px-6 py-3 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 font-semibold transition-all"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

// Loading Spinner
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div className="flex items-center justify-center p-8">
            <div
                className={`${sizeClasses[size]} border-4 border-gray-700 border-t-primary rounded-full animate-spin`}
            ></div>
        </div>
    );
}

// Progress Bar
interface ProgressBarProps {
    value: number;
    max?: number;
    color?: "primary" | "blue" | "green" | "red";
    showLabel?: boolean;
}

export function ProgressBar({
    value,
    max = 100,
    color = "primary",
    showLabel = true,
}: ProgressBarProps) {
    const percentage = (value / max) * 100;
    const colorClasses = {
        primary: "bg-primary",
        blue: "bg-blue-500",
        green: "bg-green-500",
        red: "bg-red-500",
    };

    return (
        <div className="w-full">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {showLabel && (
                <p className="text-sm text-gray-400 mt-1">{percentage.toFixed(0)}%</p>
            )}
        </div>
    );
}

// Badge Component
interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "info";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
    const variantClasses = {
        default: "bg-gray-700 text-gray-300",
        success: "bg-green-500/20 border border-green-500/30 text-green-300",
        warning: "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300",
        error: "bg-red-500/20 border border-red-500/30 text-red-300",
        info: "bg-blue-500/20 border border-blue-500/30 text-blue-300",
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}
        >
            {children}
        </span>
    );
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const variantClasses = {
        primary: "bg-primary hover:bg-cyan-500 text-white",
        secondary: "bg-gray-700 border border-gray-600 hover:border-primary text-white",
        ghost: "hover:bg-gray-800 text-white",
        danger: "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300",
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={`rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
}

// Card Component
interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
    return (
        <div
            className={`rounded-2xl bg-gray-800 border border-gray-700 p-6 transition-all ${hover ? "hover:border-primary hover:shadow-lg cursor-pointer" : ""
                } ${className}`}
        >
            {children}
        </div>
    );
}
