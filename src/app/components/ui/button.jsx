import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-iris-500 via-iris-500 to-blush-400 text-primary-foreground shadow-lg shadow-iris-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-iris-500/25",
        destructive:
          "bg-rouge-500 text-destructive-foreground shadow-md shadow-rouge-500/15 hover:-translate-y-0.5 hover:bg-rouge-600",
        outline:
          "control-surface hover:-translate-y-0.5 hover:border-primary/35",
        secondary:
          "border border-border/70 bg-[hsl(var(--surface-soft)/0.85)] text-secondary-foreground shadow-soft hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[hsl(var(--card-hover)/0.9)]",
        ghost: "text-muted-foreground hover:bg-[hsl(var(--surface-soft)/0.82)] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const buttonProps = !asChild && props.type == null ? { type: "button" } : {}

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...buttonProps}
      {...props} />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
