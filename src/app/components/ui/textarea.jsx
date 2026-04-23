import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-2xl border border-input bg-card/88 px-4 py-3 text-base text-foreground shadow-soft placeholder:text-muted-foreground/80 focus-visible:border-primary/32 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
