import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "control-surface flex min-h-[96px] w-full rounded-2xl px-4 py-3 text-base placeholder:text-muted-foreground/85 focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
