import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    labelPosition?: 'left' | 'right';
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, labelPosition, icon, ...props }, ref) => {
        return (
            <div className="flex items-center space-x-2 w-full">
                <div className="relative flex items-center w-full">
                    {icon && (
                        <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    {label && labelPosition === 'left' && (
                        <span className="absolute left-3 top-2 text-sm font-medium text-slate-500">{label}</span>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            icon ? "pl-9" : "",
                            label && labelPosition === 'left' ? "pl-8" : "",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
