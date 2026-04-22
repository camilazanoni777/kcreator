'use client'

import { useState } from 'react'
import { CheckCircle, Plus, Search, Sparkles, X } from 'lucide-react'

import BentoCard from '@/components/shared/BentoCard'
import PageHeader from '@/components/shared/PageHeader'
import TarefaKanban from '@/components/tarefas/TarefaKanban'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities'

const PRIORIDADES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
]

const AREAS = ['Geral', 'Casa', 'Finan\u00e7as', 'Trabalho', 'Sa\u00fade']
const RESPONSAVEIS = ['Victor', 'Camila', 'Ambos']

const EMPTY_FORM = {
  descricao: '',
  responsavel: 'Victor',
  prioridade: 'media',
  area: 'Geral',
  prazo: '',
  hora: '',
  rotina: 'unica',
}

export default function Tarefas() {
  const { data: tarefas } = useEntityList('Tarefa')
  const { create } = useEntityMutations('Tarefa')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [filtroResp, setFiltroResp] = useState('')
  const [filtroPrio, setFiltroPrio] = useState('')
  const [filtroArea, setFiltroArea] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    create.mutate({ ...form, status: 'pendente' })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const filtered = tarefas.filter((t) => {
    if (search && !t.descricao?.toLowerCase().includes(search.toLowerCase())) return false
    if (filtroResp && filtroResp !== 'all_people' && t.responsavel !== filtroResp) return false
    if (filtroPrio && filtroPrio !== 'all_priorities' && t.prioridade !== filtroPrio) return false
    if (filtroArea && filtroArea !== 'all_areas' && t.area !== filtroArea) return false
    return true
  })

  const pendentes = tarefas.filter((t) => t.status === 'pendente').length
  const andamento = tarefas.filter((t) => t.status === 'andamento').length
  const concluidas = tarefas.filter((t) => t.status === 'concluida').length

  return (
    <div>
      <PageHeader
        title="Tarefas"
        subtitle="Gerencie suas tarefas em quadro Kanban"
        action={
          <Button size="sm" onClick={() => setShowForm((current) => !current)} className="gap-2">
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? 'Fechar' : 'Adicionar'}
          </Button>
        }
      />

      <div className="space-y-4 px-4 pb-8 sm:px-8">
        <div className="surface-tile rounded-[24px] p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar tarefa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select value={filtroResp} onValueChange={setFiltroResp}>
              <SelectTrigger>
                <SelectValue placeholder="Pessoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_people">Todos</SelectItem>
                {RESPONSAVEIS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroPrio} onValueChange={setFiltroPrio}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_priorities">Todas</SelectItem>
                {PRIORIDADES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroArea} onValueChange={setFiltroArea}>
              <SelectTrigger>
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_areas">Todas</SelectItem>
                {AREAS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {showForm ? (
          <BentoCard
            title="Nova tarefa"
            icon={CheckCircle}
            eyebrow="Ritmo do dia"
            variant="accent"
            action={
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-[hsl(var(--surface-elevated)/0.94)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/80 shadow-soft">
                <Sparkles className="h-3.5 w-3.5 text-blush-600" />
                Planeje com clareza
              </div>
            }
            contentClassName="space-y-5"
          >
            <div className="rounded-[24px] border border-primary/20 bg-[linear-gradient(145deg,hsl(var(--surface-elevated)/0.98),hsl(var(--accent-soft)/0.72))] p-4 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Novo bloco de foco
                  </p>
                  <div>
                    <h3 className="font-cormorant text-3xl font-semibold tracking-[-0.03em] text-foreground">
                      Capture a proxima prioridade
                    </h3>
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                      Abra a ideia, defina responsavel e deixe o quadro pronto para andar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Pendentes', value: pendentes },
                    { label: 'Em andamento', value: andamento },
                    { label: 'Concluidas', value: concluidas },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="surface-tile rounded-2xl px-4 py-3 text-center backdrop-blur"
                    >
                      <p className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Descricao
                  </Label>
                  <Input
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    placeholder="Ex.: revisar campanhas, alinhar a casa ou resolver algo importante"
                    className="h-12 rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Prazo
                  </Label>
                  <Input
                    type="date"
                    value={form.prazo}
                    onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Responsavel
                  </Label>
                  <Select
                    value={form.responsavel}
                    onValueChange={(value) => setForm({ ...form, responsavel: value })}
                  >
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSAVEIS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Prioridade
                  </Label>
                  <Select
                    value={form.prioridade}
                    onValueChange={(value) => setForm({ ...form, prioridade: value })}
                  >
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORIDADES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Area
                  </Label>
                  <Select value={form.area} onValueChange={(value) => setForm({ ...form, area: value })}>
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Hora
                  </Label>
                  <Input
                    type="time"
                    value={form.hora}
                    onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    className="h-11 rounded-2xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar tarefa
                </Button>
              </div>
            </form>
          </BentoCard>
        ) : null}

        <TarefaKanban tarefas={filtered} />
      </div>
    </div>
  )
}
