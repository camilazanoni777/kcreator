import React from 'react'
import { cn } from '@/lib/utils'

export default function PageHeader({ title, subtitle, italic, action }) {
  return (
    <div className="px-4 pb-6 pt-8 sm:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="kicker">Workspace</p>
          <h1
            className={cn(
              'font-cormorant text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl',
              italic && 'italic'
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="header-actions pt-1 xl:max-w-[48%] xl:justify-end">{action}</div> : null}
      </div>
    </div>
  )
}
