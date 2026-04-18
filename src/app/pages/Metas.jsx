'use client'

import { useState } from 'react'
import {
  Plus,
  Sparkles,
  Target,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react'

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

import BentoCard from '@/components/shared/BentoCard'
import PageHeader from '@/components/shared/PageHeader'
import { formatBRL } from '@/lib/formatCurrency'
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities'
import { usePlan } from '@/lib/PlanContext'

const EMPTY_FORM = {
  titulo: '',
  valor_total: '',
  responsavel: 'Victor',
  prazo: '',
}

function parseCurrencyInput(value) {
  if (!value) return 0

  const normalized = value
    .replace(/[^\d.,-]/g, '')
    .trim()

  if (!normalized) return 0

  if (normalized.includes(',') && normalized.includes('.')) {
    return Number(normalized.replace(/\./g, '').replace(',', '.'))
  }

  if (normalized.includes(',')) {
    return Number(normalized.replace(',', '.'))
  }

  return Number(normalized)
}

function GoalMetric({ label, value, tone = 'default' }) {
  const tones = {
    default: 'border-border/60 bg-card',
    success: 'border-green-500/20 bg-green-500/5',
    accent: 'border-accent/20 bg-accent/5',
  }

  return (
    <div className={`rounded-2xl border p-4 text-center ${tones[tone]}`}>
      <p className={`text-2xl font-bold ${tone === 'success' ? 'text-green-400' : tone === 'accent' ? 'text-accent' : 'text-primary'}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export default function Metas() {
  const { isIndividual } = usePlan()
  const { data: metas } = useEntityList('Meta')
  const metaMut = useEntityMutations('Meta')

  const [form, setForm] = useState(EMPTY_FORM)
  const [activeMetaId, setActiveMetaId] = useState('')
  const [aporteValor, setAporteValor] = useState('')

  const responsaveis = isIndividual ? ['Victor', 'Camila'] : ['Victor', 'Camila', 'Ambos']

  const handleSubmit = (e) => {
    e.preventDefault()
    metaMut.create.mutate({
      ...form,
      valor_total: Number(form.valor_total),
      valor_atual: 0,
    })
    setForm(EMPTY_FORM)
  }

  const openAporteCard = (meta) => {
    setActiveMetaId(meta.id)
    setAporteValor('')
  }

  const closeAporteCard = () => {
    setActiveMetaId('')
    setAporteValor('')
  }

  const handleAddValor = (meta) => {
    const valor = parseCurrencyInput(aporteValor)
    if (!valor || Number.isNaN(valor) || valor <= 0) return

    metaMut.update.mutate({
      id: meta.id,
      data: { valor_atual: (meta.valor_atual || 0) + valor },
    })

    closeAporteCard()
  }

  const metasAtivas = metas.filter((m) => (m.valor_atual || 0) < (m.valor_total || 1))
  const metasConcluidas = metas.filter((m) => (m.valor_atual || 0) >= (m.valor_total || 1))
  const totalMetaizado = metas.reduce((sum, m) => sum + (m.valor_atual || 0), 0)
  const totalMetaAlvo = metas.reduce((sum, m) => sum + (m.valor_total || 0), 0)

  return (
    <div>
      <PageHeader
        title={isIndividual ? 'Minhas Metas' : 'Metas do Casal'}
        subtitle={
          isIndividual
            ? 'Defina o que voce quer conquistar e acompanhe o progresso'
            : 'Construam juntos. Cada meta aproxima voces mais.'
        }
        italic
      />

      <div className="space-y-5 px-4 pb-8 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <GoalMetric label="Em andamento" value={metasAtivas.length} />
          <GoalMetric label="Concluidas" value={metasConcluidas.length} tone="success" />
          <GoalMetric
            label={`de ${formatBRL(totalMetaAlvo)}`}
            value={formatBRL(totalMetaizado)}
            tone="accent"
          />
        </div>

        <BentoCard title="Nova Meta" icon={Target} accent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label className="text-xs">Titulo</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Viagem"
                required
              />
            </div>
            <div>
              <Label className="text-xs">Valor Alvo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.valor_total}
                onChange={(e) => setForm({ ...form, valor_total: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="text-xs">Responsavel</Label>
              <Select
                value={form.responsavel}
                onValueChange={(value) => setForm({ ...form, responsavel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {responsaveis.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Adicionar
              </Button>
            </div>
          </form>
        </BentoCard>

        {metas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-3 text-4xl">Meta</p>
            <p className="mb-1 text-sm font-medium">Nenhuma meta ainda</p>
            <p className="text-xs text-muted-foreground">
              Defina o que voce quer conquistar e comece a guardar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {metas.map((m) => {
              const percent = Math.min(((m.valor_atual || 0) / (m.valor_total || 1)) * 100, 100)
              const concluida = percent >= 100
              const isEditing = activeMetaId === m.id
              const aporteAtual = isEditing ? parseCurrencyInput(aporteValor) : 0
              const totalComAporte = (m.valor_atual || 0) + (aporteAtual || 0)
              const faltaComAporte = Math.max((m.valor_total || 0) - totalComAporte, 0)

              return (
                <div
                  key={m.id}
                  className={`space-y-3 rounded-2xl border bg-card p-4 ${
                    concluida ? 'border-green-500/30' : 'border-border/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {m.titulo} {concluida ? 'Concluida' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.responsavel} - {formatBRL(m.valor_atual || 0)} / {formatBRL(m.valor_total)}
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      {!concluida ? (
                        <Button
                          size="sm"
                          variant={isEditing ? 'secondary' : 'outline'}
                          className="h-8 text-xs"
                          onClick={() => (isEditing ? closeAporteCard() : openAporteCard(m))}
                        >
                          {isEditing ? (
                            <>
                              <X className="mr-1 h-3 w-3" /> Fechar
                            </>
                          ) : (
                            <>
                              <Plus className="mr-1 h-3 w-3" /> Adicionar
                            </>
                          )}
                        </Button>
                      ) : null}

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => metaMut.remove.mutate(m.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                      <div
                        className={`h-full rounded-full transition-all ${
                          concluida ? 'bg-green-400' : 'bg-gradient-to-r from-primary to-accent'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-mono">{Math.round(percent)}%</span>
                  </div>

                  {isEditing ? (
                    <div className="overflow-hidden rounded-[24px] border border-blush-200/70 bg-gradient-to-r from-white via-blush-50/70 to-iris-50/60 p-3 shadow-soft">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/70 shadow-sm">
                              <Sparkles className="h-3.5 w-3.5 text-blush-600" />
                              Aporte rapido
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Some um valor e veja o novo total na hora.
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 lg:min-w-[360px]">
                            <div className="rounded-2xl border border-border/60 bg-white/85 px-3 py-2 text-center shadow-sm">
                              <p className="text-sm font-semibold text-foreground">
                                {formatBRL(m.valor_atual || 0)}
                              </p>
                              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Atual
                              </p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-white/85 px-3 py-2 text-center shadow-sm">
                              <p className="text-sm font-semibold text-foreground">
                                {formatBRL(totalComAporte)}
                              </p>
                              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Depois
                              </p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-white/85 px-3 py-2 text-center shadow-sm">
                              <p className="text-sm font-semibold text-foreground">
                                {formatBRL(faltaComAporte)}
                              </p>
                              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Falta
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                              Valor adicionado
                            </Label>
                            <div className="rounded-[20px] border border-white/80 bg-white/90 p-1 shadow-sm">
                              <div className="flex items-center gap-3 rounded-[16px] px-4 py-2">
                                <WalletCards className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-muted-foreground">R$</span>
                                <Input
                                  value={aporteValor}
                                  onChange={(e) => setAporteValor(e.target.value)}
                                  placeholder="0,00"
                                  inputMode="decimal"
                                  className="h-auto border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Button type="button" variant="ghost" onClick={closeAporteCard}>
                              Cancelar
                            </Button>
                            <Button
                              type="button"
                              className="gap-2"
                              onClick={() => handleAddValor(m)}
                              disabled={!aporteAtual || Number.isNaN(aporteAtual) || aporteAtual <= 0}
                            >
                              <Plus className="h-4 w-4" />
                              Confirmar aporte
                            </Button>
                          </div>
                        </div>

                        <div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/75">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-blush-400 transition-all"
                              style={{ width: `${Math.max(Math.min((totalComAporte / (m.valor_total || 1)) * 100, 100), 0)}%` }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{m.titulo}</span>
                            <span>
                              {formatBRL(totalComAporte)} acumulado · {Math.round(Math.max(Math.min((totalComAporte / (m.valor_total || 1)) * 100, 100), 0))}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
