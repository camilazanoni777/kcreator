'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Lightbulb,
  ListTodo,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Video,
  WalletCards,
  Waves,
} from 'lucide-react'

import BentoCard from '@/components/shared/BentoCard'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

import {
  EmptyState,
  PriorityBadge,
  RowStat,
  SectionPill,
} from './DashboardShared'

function HeaderButtons({ actions }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {actions.map((action) => (
        <Button
          key={`${action.href}-${action.label}`}
          asChild
          size={action.size || 'default'}
          variant={action.variant || 'default'}
          className={cn(action.primary && 'min-w-[11.5rem]')}
        >
          <Link href={action.href}>
            {action.icon ? <action.icon className="h-4 w-4" /> : null}
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}

function NextBestActionCard({ action }) {
  const toneStyles = {
    accent: 'surface-accent',
    success: 'surface-success',
    warning: 'surface-warning',
    danger: 'surface-danger',
    studio: 'surface-studio',
  }

  const iconStyles = {
    accent: 'icon-shell icon-shell-primary',
    success: 'icon-shell icon-shell-success',
    warning: 'icon-shell icon-shell-warning',
    danger: 'icon-shell icon-shell-danger',
    studio: 'icon-shell icon-shell-studio',
  }

  const resolvedTone = action.tone || 'accent'
  const ActionIcon = action.icon || Sparkles

  return (
    <div
      className={cn(
        'rounded-[32px] border p-5 shadow-panel',
        toneStyles[resolvedTone] || toneStyles.accent
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] shadow-sm',
            iconStyles[resolvedTone] || iconStyles.accent
          )}
        >
          <ActionIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="kicker mb-2">Próxima melhor ação</p>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            {action.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground/72">
            {action.description}
          </p>

          {action.context ? (
            <div className="surface-glass mt-4 rounded-[22px] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Agora
              </p>
              <p className="mt-1 text-sm text-foreground/80">{action.context}</p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href={action.href}>
                {action.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            {action.secondaryHref && action.secondaryLabel ? (
              <Button asChild variant="ghost">
                <Link href={action.secondaryHref}>{action.secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function TodayCard({ today }) {
  return (
    <BentoCard
      title="Hoje"
      icon={HeartPulse}
      eyebrow="Leitura imediata"
      variant="accent"
      className="h-full"
      contentClassName="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SectionPill
          icon={HeartPulse}
          label="Check-in"
          value={today.checkinStatus}
          tone={today.checkinTone || 'default'}
        />
        <SectionPill
          icon={Waves}
          label="Energia"
          value={today.energyLabel}
          tone={today.energyTone || 'default'}
        />
      </div>

      <div className="surface-glass rounded-[24px] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Foco do dia
        </p>
        <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-foreground">
          {today.focusTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {today.focusDescription}
        </p>
      </div>

      <div className="rounded-[24px] border border-border/70 bg-secondary/35 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Próxima ação importante
        </p>
        <p className="mt-2 text-sm font-semibold text-foreground">{today.nextStepTitle}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {today.nextStepDescription}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={today.primaryHref}>{today.primaryLabel}</Link>
        </Button>
        {today.secondaryHref && today.secondaryLabel ? (
          <Button asChild size="sm" variant="outline">
            <Link href={today.secondaryHref}>{today.secondaryLabel}</Link>
          </Button>
        ) : null}
      </div>
    </BentoCard>
  )
}

function PrioritiesCard({ priorities, onCompleteTask }) {
  return (
    <BentoCard
      title="Prioridades"
      icon={Sparkles}
      eyebrow="O que move o dia"
      variant="default"
      className="h-full"
      action={
        <Button asChild size="sm" variant="ghost">
          <Link href={priorities.href}>
            <Plus className="h-4 w-4" />
            {priorities.actionLabel}
          </Link>
        </Button>
      }
    >
      {priorities.items.length === 0 ? (
        <EmptyState
          compact
          icon={ListTodo}
          title={priorities.emptyTitle}
          description={priorities.emptyDescription}
          ctaHref={priorities.href}
          ctaLabel={priorities.actionLabel}
          tone="accent"
        />
      ) : (
        <div className="space-y-3">
          {priorities.items.map((item) => (
            <div
              key={item.id}
              className="surface-glass rounded-[24px] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                </div>
                <PriorityBadge priority={item.priority} />
              </div>

              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {item.progressLabel}
                  </p>
                  <span className="text-xs font-semibold text-foreground">{item.progress}%</span>
                </div>
                <Progress value={item.progress} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => onCompleteTask(item.id)}
                  className="min-w-[7.5rem]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Concluir
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={priorities.href}>Editar</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </BentoCard>
  )
}

function FinanceSnapshotCard({ finance }) {
  return (
    <BentoCard
      title="Financeiro rápido"
      icon={WalletCards}
      eyebrow="Leitura do mês"
      variant={finance.variant || 'success'}
      className="h-full"
    >
      <div className="surface-glass rounded-[24px] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Saldo do mês
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">
          {finance.balance}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{finance.balanceNote}</p>
      </div>

      <div className="space-y-3">
        <RowStat label="Entradas" value={finance.income} helper={finance.incomeHelper} />
        <RowStat label="Saídas" value={finance.outcome} helper={finance.outcomeHelper} />
        <RowStat
          label="Pendências"
          value={finance.pending}
          helper={finance.pendingHelper}
          valueClassName={finance.pendingTone === 'warning' ? 'text-warning' : undefined}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={finance.primaryHref}>{finance.primaryLabel}</Link>
        </Button>
        {finance.secondaryHref && finance.secondaryLabel ? (
          <Button asChild size="sm" variant="outline">
            <Link href={finance.secondaryHref}>{finance.secondaryLabel}</Link>
          </Button>
        ) : null}
      </div>
    </BentoCard>
  )
}

function OnboardingChecklist({ steps }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step) => (
        <div
          key={step.title}
          className="surface-glass rounded-[22px] p-4"
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-iris-100 text-iris-700 shadow-sm">
            <step.icon className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-foreground">{step.title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href={step.href}>{step.ctaLabel}</Link>
          </Button>
        </div>
      ))}
    </div>
  )
}

function CycleProgressCard({ cycle }) {
  return (
    <BentoCard
      title="Progresso do ciclo"
      icon={TrendingUp}
      eyebrow="Síntese única"
      variant="default"
      className="mt-10"
      contentClassName="space-y-5"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="surface-glass rounded-[28px] p-5">
          <p className="text-sm font-semibold text-foreground">{cycle.headline}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{cycle.description}</p>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Evolução do mês
              </p>
              <span className="text-sm font-semibold text-foreground">{cycle.monthProgress}%</span>
            </div>
            <Progress value={cycle.monthProgress} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {cycle.heroStats.map((item) => (
            <SectionPill
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              tone={item.tone}
            />
          ))}
        </div>
      </div>

      {cycle.isOnboarding ? (
        <OnboardingChecklist steps={cycle.steps} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {cycle.stats.map((item) => (
            <div
              key={item.label}
              className="surface-glass rounded-[22px] p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.helper}</p>
            </div>
          ))}
        </div>
      )}
    </BentoCard>
  )
}

function QuickAgendaCard({ agenda }) {
  return (
    <BentoCard
      title="Agenda rápida"
      icon={CalendarDays}
      eyebrow="Seu dia em movimento"
      variant="default"
      className="h-full"
      action={
        <Button asChild size="sm" variant="ghost">
          <Link href={agenda.href}>Ver agenda</Link>
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SectionPill
          icon={Clock3}
          label="Hoje"
          value={agenda.todayCount}
          tone="accent"
        />
        <SectionPill
          icon={ListTodo}
          label="Atrasadas"
          value={agenda.overdueCount}
          tone={agenda.overdueTone}
        />
      </div>

      {agenda.items.length === 0 ? (
        <EmptyState
          compact
          icon={CalendarDays}
          title={agenda.emptyTitle}
          description={agenda.emptyDescription}
          ctaHref={agenda.href}
          ctaLabel="Planejar meu dia"
        />
      ) : (
        <div className="space-y-3">
          {agenda.items.map((item) => (
            <div
              key={item.id}
              className="surface-glass rounded-[22px] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-foreground/75">
                  {item.timeLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </BentoCard>
  )
}

function CreatorSnapshotCard({ creator }) {
  return (
    <BentoCard
      title="Creator Studio"
      icon={Video}
      eyebrow="Integrado à rotina"
      variant="studio"
      className="h-full"
      action={
        <Button asChild size="sm" variant="ghost">
          <Link href={creator.href}>Abrir studio</Link>
        </Button>
      }
    >
      {creator.isEmpty ? (
        <EmptyState
          compact
          icon={Lightbulb}
          title={creator.emptyTitle}
          description={creator.emptyDescription}
          ctaHref={creator.href}
          ctaLabel={creator.emptyCtaLabel}
          tone="studio"
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {creator.stats.map((item) => (
              <SectionPill
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
                tone={item.tone}
              />
            ))}
          </div>

          <div className="surface-glass rounded-[24px] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Contexto
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{creator.note}</p>
          </div>
        </>
      )}
    </BentoCard>
  )
}

function GoalsOverviewCard({ goals }) {
  return (
    <BentoCard
      title="Metas"
      icon={Target}
      eyebrow="Abaixo da dobra, ainda útil"
      variant="default"
      className="h-full"
      action={
        <Button asChild size="sm" variant="ghost">
          <Link href={goals.href}>Ver metas</Link>
        </Button>
      }
    >
      {goals.items.length === 0 ? (
        <EmptyState
          compact
          icon={Target}
          title={goals.emptyTitle}
          description={goals.emptyDescription}
          ctaHref={goals.href}
          ctaLabel={goals.emptyCtaLabel}
        />
      ) : (
        <div className="space-y-3">
          {goals.items.map((item) => (
            <div
              key={item.id}
              className="surface-glass rounded-[22px] p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                </div>
                <span className="rounded-full bg-iris-100 px-3 py-1 text-xs font-semibold text-iris-700">
                  {item.progress}%
                </span>
              </div>
              <Progress value={item.progress} />
            </div>
          ))}
        </div>
      )}
    </BentoCard>
  )
}

export default function DashboardOverview({
  greeting,
  name,
  dateLabel,
  summary,
  actions,
  nextAction,
  today,
  priorities,
  finance,
  cycle,
  agenda,
  creator,
  goals,
  onCompleteTask,
}) {
  return (
    <div className="min-h-screen px-4 pb-12 pt-7 sm:px-8">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="surface-hero rounded-[36px] p-6 sm:p-8">
          <p className="kicker mb-3">Painel de comando</p>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{dateLabel}</p>
              <h1 className="mt-2 font-cormorant text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                {greeting}
                {name ? `, ${name}` : ''}
              </h1>
            </div>

            <p className="max-w-3xl text-base leading-7 text-foreground/72">{summary}</p>
            <HeaderButtons actions={actions} />
          </div>
        </div>

        <NextBestActionCard action={nextAction} />
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <TodayCard today={today} />
        </div>
        <div className="xl:col-span-5">
          <PrioritiesCard priorities={priorities} onCompleteTask={onCompleteTask} />
        </div>
        <div className="xl:col-span-3">
          <FinanceSnapshotCard finance={finance} />
        </div>
      </section>

      <CycleProgressCard cycle={cycle} />

      <section className="mt-10 grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <QuickAgendaCard agenda={agenda} />
        </div>
        <div className="xl:col-span-4">
          <CreatorSnapshotCard creator={creator} />
        </div>
        <div className="xl:col-span-4">
          <GoalsOverviewCard goals={goals} />
        </div>
      </section>
    </div>
  )
}
