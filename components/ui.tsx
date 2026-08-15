import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={cn("inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50", variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary", variant === "secondary" && "border border-border bg-card text-foreground hover:bg-muted", variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground", variant === "danger" && "bg-destructive text-destructive-foreground hover:bg-destructive/90", className)} {...props} />;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} className={cn("min-h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20", className)} {...props} />);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => <textarea ref={ref} className={cn("min-h-32 w-full resize-y rounded-md border border-input bg-card px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20", className)} {...props} />);
Textarea.displayName = "Textarea";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("rounded-lg border border-border bg-card shadow-sm", className)} {...props} />; }
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />; }
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn("font-semibold tracking-tight", className)} {...props} />; }
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />; }
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-6 pt-0", className)} {...props} />; }
export function Badge({ className, children, variant = "secondary", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "secondary" | "success" | "warning" | "danger" }) { return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", variant === "secondary" && "bg-muted text-muted-foreground", variant === "success" && "bg-success/12 text-success", variant === "warning" && "bg-warning/15 text-warning", variant === "danger" && "bg-destructive/12 text-destructive", className)} {...props}>{children}</span>; }
