import { cn } from "@/lib/utils"

const Button = ({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-black",
        {
          "bg-white border border-gray-200 shadow hover:bg-gray-50": variant === "default",
          "bg-red-500 text-white shadow-sm hover:bg-red-600": variant === "destructive",
          "border border-input bg-background shadow-sm hover:bg-gray-50": variant === "outline",
          "hover:bg-gray-100": variant === "ghost",
          "h-9 px-4 py-2": size === "default",
          "h-8 rounded-md px-3 text-xs": size === "sm",
          "h-11 rounded-md px-8": size === "lg"
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
