'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AlertCircle,
  Calendar,
  CalendarCheck2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Layers3,
  ListTodo,
  Plus,
  Sparkles,
} from 'lucide-react'

import BentoCard from '@/components/shared/BentoCard'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const VISIBLE_TASKS_PER_DAY = 4
const DAY_CELL_MIN_HEIGHT = 208

const _PRIORITIES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
]

const _CATEGORIES = ['Pessoal', 'Trabalho', 'Casa', 'Saúde', 'Financeiro', 'Creator']

const DEFAULT_FORM = {
  descricao: '',
  hora: '',
  area: '',
  prioridade: '',
}

function getTaskHour(task) {
  if (task.hora) return task.hora

  if (typeof task.prazo === 'string' && task.prazo.includes('T')) {
    const scheduledDate = new Date(task.prazo)
    if (!Number.isNaN(scheduledDate.getTime())) {
      return format(scheduledDate, 'HH:mm')
    }
  }

  return ''
}

function buildScheduledDate(day, task) {
  const nextDate = new Date(day)
  const resolvedHour = getTaskHour(task) || '09:00'
  const [hours, minutes] = resolvedHour.split(':')

  nextDate.setHours(Number(hours) || 9, Number(minutes) || 0, 0, 0)

  return {
    prazo: nextDate.toISOString(),
    hora: resolvedHour,
  }
}

function sortTasksByTime(tasks) {
  return [...tasks].sort((a, b) => {
    const hourA = getTaskHour(a) || '99:99'
    const hourB = getTaskHour(b) || '99:99'
    return hourA.localeCompare(hourB)
  })
}

function SummaryPill({ icon: Icon, label, value, tone = 'default' }) {
  const tones = {
    default: 'border-border/80 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.96),hsl(var(--surface-soft)/0.9))]',
    accent: 'border-primary/20 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.72))]',
    alert: 'border-rouge-200/70 bg-gradient-to-br from-white via-rouge-50/80 to-[#fff9f9] dark:border-rouge-500/15 dark:from-[#261619] dark:via-[#1d1113] dark:to-[#180d10]',
    success: 'border-moss-200/70 bg-gradient-to-br from-white via-moss-50/80 to-[#fbfffc] dark:border-moss-500/15 dark:from-[#1b241f] dark:via-[#16201a] dark:to-[#121915]',
  }

  return (
    <div className={cn('rounded-[20px] border px-4 py-3 shadow-soft', tones[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {value}
          </p>
        </div>
        <div className="rounded-2xl bg-[hsl(var(--surface-elevated)/0.94)] p-2 text-iris-600 shadow-soft">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

function MiniBadge({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]',
        className
      )}
    >
      {children}
    </span>
  )
}

function CalendarTaskCard({ task, isDragging, onDragStart, onDragEnd }) {
  const hour = getTaskHour(task)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      title={task.descricao}
      className={cn(
        'cursor-grab rounded-[10px] px-2.5 py-1.5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel active:cursor-grabbing',
        task.prioridade === 'urgente'
          ? 'bg-rouge-500'
          : task.prioridade === 'alta'
            ? 'bg-[#c96f35]'
            : task.prioridade === 'baixa'
              ? 'bg-moss-600'
              : 'bg-iris-600',
        isDragging && 'opacity-60 shadow-none'
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <GripVertical className="h-3 w-3 shrink-0 text-white/80" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold leading-none">
            {hour ? `${hour} · ${task.descricao}` : task.descricao}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Agenda() {
  const { data: tarefas } = useEntityList('Tarefa')
  const { create, update } = useEntityMutations('Tarefa')

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const [recentDropDay, setRecentDropDay] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const unscheduled = useMemo(
    () => sortTasksByTime(tarefas.filter((task) => !task.prazo && task.status !== 'concluida')),
    [tarefas]
  )

  const monthTasks = useMemo(
    () =>
      sortTasksByTime(
        tarefas.filter((task) => {
          if (!task.prazo) return false
          const dueDate = new Date(task.prazo)
          return !Number.isNaN(dueDate.getTime()) && isSameMonth(dueDate, currentMonth)
        })
      ),
    [currentMonth, tarefas]
  )

  const selectedDayTasks = useMemo(
    () =>
      sortTasksByTime(
        tarefas.filter(
          (task) =>
            task.prazo &&
            task.status !== 'concluida' &&
            isSameDay(new Date(task.prazo), selectedDay)
        )
      ),
    [selectedDay, tarefas]
  )

  const scheduledCount = monthTasks.filter((task) => task.status !== 'concluida').length
  const completedCount = monthTasks.filter((task) => task.status === 'concluida').length
  const overdueCount = monthTasks.filter(
    (task) =>
      task.status !== 'concluida' &&
      task.prazo &&
      isBefore(new Date(task.prazo), startOfDay(new Date()))
  ).length

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const weekTasks = monthTasks.filter((task) => {
    if (!task.prazo || task.status === 'concluida') return false
    const dueDate = new Date(task.prazo)
    return dueDate >= weekStart && dueDate <= weekEnd
  })

  useEffect(() => {
    if (!recentDropDay) return undefined
    const timeout = window.setTimeout(() => setRecentDropDay(null), 850)
    return () => window.clearTimeout(timeout)
  }, [recentDropDay])

  const summary = [
    {
      icon: Calendar,
      label: 'No mês',
      value: monthTasks.length,
      tone: 'accent',
    },
    {
      icon: CalendarCheck2,
      label: 'Agendadas',
      value: scheduledCount,
      tone: 'default',
    },
    {
      icon: Sparkles,
      label: 'Concluídas',
      value: completedCount,
      tone: 'success',
    },
    {
      icon: AlertCircle,
      label: 'Atrasadas',
      value: overdueCount,
      tone: overdueCount > 0 ? 'alert' : 'default',
    },
    {
      icon: Layers3,
      label: 'Nesta semana',
      value: weekTasks.length,
      tone: 'default',
    },
  ]

  const handleCreateTask = (event) => {
    event.preventDefault()
    if (!form.descricao.trim()) return

    create.mutate({
      descricao: form.descricao.trim(),
      responsavel: 'Camila',
      status: 'pendente',
      ...(form.hora ? { hora: form.hora } : {}),
      ...(form.area ? { area: form.area } : {}),
      ...(form.prioridade ? { prioridade: form.prioridade } : {}),
    })

    setForm(DEFAULT_FORM)
  }

  const handleDragStart = (event, taskId) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDropTarget(null)
  }

  const scheduleTaskOnDay = (taskId, day) => {
    const task = tarefas.find((item) => item.id === taskId)
    if (!task) return

    update.mutate({
      id: task.id,
      data: buildScheduledDate(day, task),
    })

    setSelectedDay(day)
    setRecentDropDay(format(day, 'yyyy-MM-dd'))
    setDraggedTaskId(null)
    setDropTarget(null)
  }

  const handleDropTask = (event, day) => {
    event.preventDefault()
    const transferredId = event.dataTransfer.getData('text/plain')
    const taskId = transferredId || draggedTaskId
    if (!taskId) return
    scheduleTaskOnDay(taskId, day)
  }

  const getTasksForDay = (day) =>
    sortTasksByTime(
      tarefas.filter(
        (task) =>
          task.prazo &&
          task.status !== 'concluida' &&
          isSameDay(new Date(task.prazo), day)
      )
    )

  return (
    <div>
      <PageHeader
        title="Calendário"
        subtitle="Organize o mês com uma visão clara, compacta e pronta para encaixar tarefas com rapidez."
      />

      <div className="px-4 pb-8 sm:px-8">
        <div className="space-y-4">
          <BentoCard
            title="Calendário mensal"
            icon={CalendarDays}
            eyebrow="Agenda visual"
            action={
              <MiniBadge className="border-iris-100 bg-iris-50 text-iris-700">
                {scheduledCount} ativas
              </MiniBadge>
            }
          >
            <div className="space-y-4">
              <div className="rounded-[26px] border border-border/80 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--surface-soft)/0.88))] p-5 shadow-soft lg:flex lg:items-center lg:justify-between lg:gap-4">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Mês atual
                  </p>
                  <h2 className="font-cormorant text-4xl font-semibold capitalize tracking-[-0.04em] text-foreground">
                    {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Arraste tarefas para as datas ou selecione um dia para agendar abaixo.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMonth(new Date())
                      setSelectedDay(new Date())
                    }}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Mês anterior"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Próximo mês"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {summary.map((item) => (
                  <SummaryPill key={item.label} {...item} />
                ))}
              </div>

              <div className="grid gap-3 xl:grid-cols-[1.3fr_1fr_1fr]">
                <div className="surface-tile rounded-[24px] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-2xl bg-iris-100 p-2 text-iris-600">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Criação rápida
                      </p>
                      <p className="text-sm font-semibold text-foreground">Nova tarefa</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateTask} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px_130px]">
                    <Input
                      value={form.descricao}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, descricao: event.target.value }))
                      }
                      placeholder="O que entra na agenda?"
                      required
                    />
                    <Input
                      type="time"
                      value={form.hora}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, hora: event.target.value }))
                      }
                    />
                    <Button type="submit">Criar</Button>
                  </form>
                </div>

                <div className="surface-tile rounded-[24px] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-2xl bg-blush-100 p-2 text-blush-700">
                        <ListTodo className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Fila
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {unscheduled.length} disponíveis
                        </p>
                      </div>
                    </div>
                    <MiniBadge className="border-iris-100 bg-iris-50 text-iris-700">
                      Arraste
                    </MiniBadge>
                  </div>

                  <div className="space-y-2">
                    {unscheduled.length === 0 ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        Nenhuma tarefa pendente para encaixar.
                      </p>
                    ) : (
                      unscheduled.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(event) => handleDragStart(event, task.id)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            'cursor-grab rounded-[18px] border border-border/70 bg-[hsl(var(--surface-soft)/0.86)] px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-iris-200 hover:bg-[hsl(var(--surface-elevated)/0.94)] hover:shadow-soft active:cursor-grabbing',
                            draggedTaskId === task.id && 'opacity-60 shadow-none'
                          )}
                        >
                          <p className="truncate text-sm font-semibold text-foreground">
                            {task.descricao}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {getTaskHour(task) || 'Sem horário'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="surface-tile rounded-[24px] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-2xl bg-secondary p-2 text-iris-600">
                      <CalendarCheck2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Dia selecionado
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {format(selectedDay, "d 'de' MMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                    {selectedDayTasks.length === 0 ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        Dia livre por enquanto.
                      </p>
                    ) : (
                      selectedDayTasks.map((task) => (
                        <div key={task.id} className="rounded-[18px] border border-border/70 bg-[hsl(var(--surface-soft)/0.86)] px-3 py-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {task.descricao}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {getTaskHour(task) || 'Sem horário'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[30px] border border-border/80 bg-[hsl(var(--surface-soft)/0.9)] shadow-soft">
                <div className="grid grid-cols-7 gap-px bg-border/70">
                  {WEEKDAYS.map((weekday) => (
                    <div
                      key={weekday}
                      className="bg-[hsl(var(--surface-elevated)/0.98)] px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/72"
                    >
                      {weekday}
                    </div>
                  ))}

                  {calendarDays.map((day) => {
                        const isInCurrentMonth = isSameMonth(day, currentMonth)
                        const dayKey = format(day, 'yyyy-MM-dd')
                        const dayTasks = getTasksForDay(day)
                        const isSelected = isSameDay(day, selectedDay)
                        const isCurrentDay = isToday(day)
                        const isDropActive = dropTarget === dayKey
                        const wasRecentlyDropped = recentDropDay === dayKey

                        return (
                          <div
                            key={day.toISOString()}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedDay(day)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                setSelectedDay(day)
                              }
                            }}
                            onDragOver={(event) => {
                              event.preventDefault()
                              setDropTarget(dayKey)
                            }}
                            onDragEnter={() => setDropTarget(dayKey)}
                            onDragLeave={() => {
                              if (dropTarget === dayKey) setDropTarget(null)
                            }}
                            onDrop={(event) => handleDropTask(event, day)}
                            style={{ minHeight: `${DAY_CELL_MIN_HEIGHT}px` }}
                            className={cn(
                              'group flex flex-col bg-[hsl(var(--surface-elevated)/0.96)] px-2.5 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-iris-200/40',
                              !isInCurrentMonth && 'bg-[hsl(var(--surface-soft)/0.8)]',
                              isCurrentDay && 'bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.72))]',
                              isSelected && 'ring-1 ring-foreground/15 ring-inset',
                              isDropActive && 'bg-iris-50 ring-1 ring-iris-300 ring-inset',
                              wasRecentlyDropped && 'bg-gradient-to-br from-white via-moss-50/70 to-[#fafffb]'
                            )}
                          >
                            <div className="mb-2.5 flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <span
                                  className={cn(
                                    'inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-semibold',
                                    isCurrentDay
                                      ? 'bg-iris-600 text-white'
                                      : isSelected
                                        ? 'bg-secondary text-foreground'
                                        : isInCurrentMonth
                                          ? 'text-foreground'
                                          : 'text-muted-foreground'
                                  )}
                                >
                                  {format(day, 'd')}
                                </span>
                                {isSelected ? (
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    Selecionado
                                  </p>
                                ) : null}
                              </div>

                              {dayTasks.length > 0 ? (
                                <MiniBadge className="border-iris-100 bg-iris-50 text-iris-700">
                                  {dayTasks.length}
                                </MiniBadge>
                              ) : (
                                <span className="mt-1 h-2 w-2 rounded-full bg-border/90 transition-colors duration-200 group-hover:bg-iris-300" />
                              )}
                            </div>

                            <div className="space-y-2">
                              {dayTasks.slice(0, VISIBLE_TASKS_PER_DAY).map((task) => (
                                <CalendarTaskCard
                                  key={task.id}
                                  task={task}
                                  isDragging={draggedTaskId === task.id}
                                  onDragStart={(event) => {
                                    event.stopPropagation()
                                    handleDragStart(event, task.id)
                                  }}
                                  onDragEnd={handleDragEnd}
                                />
                              ))}

                              {dayTasks.length > VISIBLE_TASKS_PER_DAY ? (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setSelectedDay(day)
                                  }}
                                  className="inline-flex items-center rounded-full bg-[hsl(var(--surface-soft)/0.9)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:bg-[hsl(var(--surface-elevated)/0.94)]"
                                >
                                  +{dayTasks.length - VISIBLE_TASKS_PER_DAY} mais
                                </button>
                              ) : null}
                            </div>

                            {dayTasks.length === 0 ? (
                              <div className="mt-auto flex items-center justify-between pt-4">
                                <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                                  {isDropActive ? 'Solte aqui' : isSelected ? 'Dia livre' : ''}
                                </span>
                                <span
                                  className={cn(
                                    'rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all',
                                    isDropActive
                                      ? 'bg-[hsl(var(--surface-elevated)/0.98)] text-iris-700 shadow-soft'
                                      : isSelected
                                        ? 'bg-[hsl(var(--surface-soft)/0.9)] text-muted-foreground'
                                        : 'opacity-0 group-hover:bg-[hsl(var(--surface-soft)/0.92)] group-hover:text-muted-foreground group-hover:opacity-100'
                                  )}
                                >
                                  Disponível
                                </span>
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                </div>
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </div>
  )
}
