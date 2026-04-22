'use client'

import Link from 'next/link'
import BentoCard from '@/components/shared/BentoCard'
import HeroCard from '@/components/shared/HeroCard'
import MetricCard from '@/components/shared/MetricCard'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatBRL } from '@/lib/formatCurrency'
import { useEntityList } from '@/lib/hooks/useEntities'
import { usePlan } from '@/lib/PlanContext'
import {
  CircleDollarSign,
  Flame,
  HeartPulse,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Video,
  WalletCards,
  Waves,
} from 'lucide-react'
import {
  format,
  getDate,
  getDaysInMonth,
  isAfter,
  isToday,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  EmptyState,
  PriorityBadge,
  RowStat,
  SectionHeader,
  SectionPill,
} from './DashboardShared'
import { getUsagePercentage, greetingFor, PRIORITY_ORDER } from './helpers'

const HUMOR_META = {
  otimo: { emoji: '😄', label: 'Ótimo', tone: 'success' },
  bom: { emoji: '🙂', label: 'Bom', tone: 'accent' },
  neutro: { emoji: '😐', label: 'Neutro', tone: 'default' },
  cansado: { emoji: '😴', label: 'Cansado', tone: 'blush' },
  ruim: { emoji: '😔', label: 'Ruim', tone: 'danger' },
}

export default function DashboardCasal() {
  const { nome, partnerName } = usePlan()
  const { data: salarios } = useEntityList('Salario')
  const { data: gastos } = useEntityList('GastoVariavel')
  const { data: contas } = useEntityList('ContaFixa')
  const { data: tarefas } = useEntityList('Tarefa')
  const { data: metas } = useEntityList('Meta')
  const { data: conteudos } = useEntityList('Conteudo')
  const { data: dividas } = useEntityList('Divida')
  const { data: entradas } = useEntityList('EntradaExtra')
  const { data: publis } = useEntityList('Publi')
  const { data: ideias } = useEntityList('Ideia')
  const { data: checkins } = useEntityList('CheckIn')
  const { data: habitos } = useEntityList('Habito')

  const today = new Date()
  const greeting = greetingFor(today)
  const startWeek = startOfWeek(today, { weekStartsOn: 1 })

  const primaryName = nome || 'Victor'
  const secondaryName = partnerName || 'Camila'

  const rendaPrincipal = salarios.find((item) => item.pessoa === 'Victor')?.valor || 0
  const rendaParceiro = salarios.find((item) => item.pessoa === 'Camila')?.valor || 0
  const entradasExtras = entradas.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalCasa = rendaPrincipal + rendaParceiro + entradasExtras
  const totalGastos = gastos.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalContas = contas.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalSaidas = totalGastos + totalContas
  const saldo = totalCasa - totalSaidas
  const percentualOrcamento = getUsagePercentage(totalCasa, totalSaidas)
  const totalDividas = dividas.reduce((sum, item) => {
    const pago = ((item.valor_total || 0) / (item.parcelas_total || 1)) * (item.parcelas_pagas || 0)
    return sum + ((item.valor_total || 0) - pago)
  }, 0)

  const tarefasHoje = tarefas.filter((item) => item.prazo && isToday(new Date(item.prazo)) && item.status !== 'concluida')
  const topPrioridades = tarefas
    .filter((item) => item.status !== 'concluida')
    .sort((a, b) => (PRIORITY_ORDER[a.prioridade] ?? 3) - (PRIORITY_ORDER[b.prioridade] ?? 3))
    .slice(0, 4)
  const concluidasSemana = tarefas.filter((item) => item.status === 'concluida' && item.updated_date && isAfter(new Date(item.updated_date), startWeek))

  const diasNoMes = getDaysInMonth(today)
  const diaAtual = getDate(today)

  const metasAtivas = metas.filter((item) => (item.valor_atual || 0) < (item.valor_total || 1))
  const publisReceita = conteudos
    .filter((item) => item.tipo === 'publi' && item.etapa === 'postado')
    .reduce((sum, item) => sum + (item.receita || 0), 0)
  const creatorPipeline = conteudos.filter((item) => item.etapa && !['postado', 'ideia'].includes(item.etapa)).length
  const publisAtivas = publis.filter((item) => ['fechado', 'producao', 'entregue'].includes(item.status)).length

  const habitosAtivos = habitos.filter((item) => item.ativo !== false)
  const percentHabitos = habitosAtivos.length
    ? Math.round((habitosAtivos.filter((item) => (item.dias_feitos || 0) >= 1).length / habitosAtivos.length) * 100)
    : 0
  const ultimoCheckin = [...checkins].sort((a, b) => new Date(b.data) - new Date(a.data))[0]
  const moodMeta = ultimoCheckin ? HUMOR_META[ultimoCheckin.humor] || HUMOR_META.neutro : null

  const alignmentScore = (() => {
    const taskFactor = tarefas.length ? (concluidasSemana.length / tarefas.length) * 100 : 40
    const goalFactor = metas.length ? (metas.filter((item) => (item.valor_atual || 0) >= (item.valor_total || 1)).length / metas.length) * 100 : 40
    const financeFactor = saldo >= 0 ? 80 : 48
    return Math.round(taskFactor * 0.35 + goalFactor * 0.25 + financeFactor * 0.25 + percentHabitos * 0.15)
  })()

  return (
    <div className="dashboard-theme min-h-screen px-4 pb-12 pt-8 sm:px-8">
      <div className="surface-toolbar mb-6 px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="kicker mb-2">Dashboard principal</p>
            <h2 className="font-cormorant text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Visão geral da casa
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })} · rotina, financeiro e creator studio com o mesmo contraste e profundidade das outras abas.
            </p>
          </div>
          <div className="header-actions xl:justify-end">
            <div className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface-elevated)/0.94)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-soft">
              {topPrioridades.length} prioridades da casa
            </div>
            <div className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface-elevated)/0.94)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-soft">
              {Math.round(percentualOrcamento)}% do orçamento usado
            </div>
          </div>
        </div>
        <div className="header-actions mt-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/tarefas">Revisar prioridades</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/estudio">Abrir studio</Link>
          </Button>
        </div>
      </div>

      <HeroCard
        className="dashboard-hero"
        eyebrow="Premium shared dashboard"
        title={`${greeting}, ${primaryName} & ${secondaryName}.`}
        subtitle="A home ficou mais sintetizada para mostrar rotina, caixa da casa e creator studio de um jeito mais direto e premium."
        progressLabel="Alinhamento do ciclo"
        progressText={`${diaAtual} de ${diasNoMes} dias · ${percentualOrcamento}% do orçamento já utilizado`}
        progressValue={alignmentScore}
        streak={`${concluidasSemana.length}x`}
        nivel={alignmentScore >= 75 ? 'Sincronia forte' : alignmentScore >= 55 ? 'Fluxo em construção' : 'Base do sistema'}
        rightNote={
          ultimoCheckin?.nota
            ? `"${ultimoCheckin.nota}"`
            : 'Menos blocos, mais clareza visual e mais protagonismo para os dados que importam primeiro.'
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/financeiro">Ver financeiro</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/agenda">Abrir agenda</Link>
            </Button>
          </div>
        }
        stats={[
          { label: 'Semana', value: concluidasSemana.length },
          { label: 'Hoje', value: tarefasHoje.length },
          { label: 'Metas', value: metasAtivas.length },
          { label: 'Studio', value: creatorPipeline },
        ]}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Renda da casa"
          value={formatBRL(totalCasa)}
          sub={`${primaryName}: ${formatBRL(rendaPrincipal)} · ${secondaryName}: ${formatBRL(rendaParceiro)}`}
          variant="positive"
          icon={CircleDollarSign}
          className="dashboard-card-deep"
        />
        <MetricCard
          label="Saldo do mês"
          value={formatBRL(saldo)}
          sub={saldo >= 0 ? 'Estrutura saudável neste mês.' : 'As saídas já pedem ajuste.'}
          variant={saldo >= 0 ? 'primary' : 'negative'}
          icon={WalletCards}
          className="dashboard-card-tinted"
        />
        <MetricCard
          label="Creator"
          value={formatBRL(publisReceita)}
          sub={`${creatorPipeline} ativos · ${publisAtivas} publis em andamento`}
          variant="studio"
          icon={Video}
          className="dashboard-card-tinted"
        />
        <MetricCard
          label="Clima do momento"
          value={moodMeta ? `${moodMeta.emoji} ${moodMeta.label}` : 'Sem check-in'}
          sub={ultimoCheckin ? `Energia em ${ultimoCheckin.energia}/10` : 'Ainda sem registro emocional.'}
          variant="accent"
          icon={HeartPulse}
          className="dashboard-card-tinted"
        />
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Leitura rápida"
          title="Panorama compartilhado"
          description="A versão inicial agora cabe em poucos blocos mais fortes: prioridades, finanças e studio."
        />

        <div className="grid gap-4 xl:grid-cols-3">
          <BentoCard title="Prioridades" icon={Sparkles} eyebrow="Rotina da semana" variant="accent" className="dashboard-card-tinted">
            {topPrioridades.length === 0 ? (
              <EmptyState
                icon={ShieldCheck}
                title="Nenhuma prioridade crítica por agora."
                description="Quando a operação da casa está em ordem, o painel comunica calma em vez de vazio."
                ctaHref="/tarefas"
                ctaLabel="Adicionar tarefa"
                tone="accent"
              />
            ) : (
              <div className="space-y-3">
                {topPrioridades.map((item) => (
                  <div key={item.id} className="surface-tile dashboard-tile rounded-[22px] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{item.descricao}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {item.responsavel || 'Ambos'} · {item.area || 'Geral'}
                        </p>
                      </div>
                      <PriorityBadge priority={item.prioridade} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          <BentoCard title="Financeiro" icon={WalletCards} eyebrow="Resumo da casa" variant={saldo >= 0 ? 'success' : 'danger'} className="dashboard-card-deep">
            <div className="space-y-3">
              <RowStat label="Saldo" value={formatBRL(saldo)} helper="resultado atual" />
              <RowStat label="Saídas" value={formatBRL(totalSaidas)} helper="fixas + variáveis" />
              <RowStat label="Dívidas" value={formatBRL(totalDividas)} helper="compromissos ativos" />
              <RowStat label="Orçamento" value={`${percentualOrcamento}%`} helper="nível de uso do mês" />
            </div>
          </BentoCard>

          <BentoCard title="Creator Studio" icon={Video} eyebrow="Visão compacta" variant="studio" className="dashboard-card-tinted">
            {conteudos.length === 0 && publis.length === 0 && ideias.length === 0 ? (
              <EmptyState
                icon={Video}
                title="O Creator Studio ainda está vazio."
                description="Esse bloco foi condensado para mostrar o essencial da operação criativa logo na home."
                ctaHref="/estudio"
                ctaLabel="Começar no studio"
                tone="studio"
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                <SectionPill icon={Video} label="Pipeline" value={`${creatorPipeline} ativos`} tone="accent" />
                <SectionPill icon={CircleDollarSign} label="Receita" value={formatBRL(publisReceita)} tone="success" />
                <SectionPill icon={Lightbulb} label="Ideias" value={`${ideias.length}`} tone="default" />
                <SectionPill icon={Sparkles} label="Publis" value={`${publisAtivas} ativas`} tone="blush" />
              </div>
            )}
          </BentoCard>
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Ciclo atual"
          title="Metas e bem-estar"
          description="Um fechamento mais limpo para a home: progresso do ciclo e estado emocional do momento."
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <BentoCard title="Metas compartilhadas" icon={Target} eyebrow="Progressão do ciclo" className="dashboard-card-deep">
            {metasAtivas.length === 0 ? (
              <EmptyState
                icon={Target}
                title="As metas do ciclo ainda não foram definidas."
                description="Quando existirem metas ativas, este bloco vai resumir a evolução da casa sem alongar a home."
                ctaHref="/metas"
                ctaLabel="Criar meta"
              />
            ) : (
              <div className="space-y-3">
                {metasAtivas.slice(0, 3).map((item) => {
                  const progress = Math.min(Math.round(((item.valor_atual || 0) / (item.valor_total || 1)) * 100), 100)
                  return (
                    <div key={item.id} className="surface-tile dashboard-tile rounded-[22px] p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{item.titulo}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatBRL(item.valor_atual || 0)} de {formatBRL(item.valor_total || 0)}
                          </p>
                        </div>
                        <span className="rounded-full bg-iris-100 px-3 py-1 text-xs font-semibold text-iris-700 dark:bg-[hsl(var(--surface-soft)/0.96)] dark:text-[hsl(var(--text-primary))]">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )
                })}
              </div>
            )}
          </BentoCard>

          <BentoCard title="Estado do sistema" icon={HeartPulse} eyebrow="Ritmo da casa" className="dashboard-card-deep">
            <div className="space-y-4">
              {ultimoCheckin ? (
                <div className="surface-tile dashboard-tile rounded-[24px] p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-iris-100 to-sand-100 text-3xl shadow-soft dark:from-[#28314a] dark:to-[#1d2436]">
                      <span>{moodMeta?.emoji}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{moodMeta?.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Energia em {ultimoCheckin.energia}/10</p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={HeartPulse}
                  title="Ainda não existe check-in registrado."
                  description="O bloco ficou mais objetivo, mas continua humano e acolhedor quando estiver vazio."
                  ctaHref="/checkin"
                  ctaLabel="Registrar check-in"
                />
              )}

              <div className="grid gap-3 md:grid-cols-3">
                <SectionPill icon={Waves} label="Hábitos" value={`${percentHabitos}%`} tone="accent" />
                <SectionPill icon={Flame} label="Semana" value={`${concluidasSemana.length} entregas`} tone="blush" />
                <SectionPill icon={ShieldCheck} label="Hoje" value={`${tarefasHoje.length} tarefas`} tone="default" />
              </div>
            </div>
          </BentoCard>
        </div>
      </section>
    </div>
  )
}
