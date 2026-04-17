import React from 'react'
import { cn } from '@/lib/utils'

export default function PageHeader({ title, subtitle, italic, action }) {
  return (
    <div className="px-4 sm:px-8 pt-8 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="space-y-2">
        <p className="kicker">Workspace</p>
        <h1
          className={cn(
            'font-cormorant text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground',
            italic && 'italic'
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action ? <div className="shrink-0 pt-2 sm:pt-0">{action}</div> : null}
    </div>
  )
}
