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
  isBefore,
  isToday,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  EmptyState,
  PriorityBadge,
  RowStat,
  SectionHeader,
  SectionPill,
  SoftAction,
} from './DashboardShared'
import { getUsagePercentage, greetingFor, PRIORITY_ORDER } from './helpers'

const HUMOR_META = {
  otimo: { emoji: '😄', label: 'Ótimo', tone: 'success' },
  bom: { emoji: '🙂', label: 'Bom', tone: 'accent' },
  neutro: { emoji: '😐', label: 'Neutro', tone: 'default' },
  cansado: { emoji: '😴', label: 'Cansado', tone: 'blush' },
  ruim: { emoji: '😔', label: 'Ruim', tone: 'danger' },
}

export default function DashboardIndividual() {
  const { nome } = usePlan()
  const { data: salarios } = useEntityList('Salario')
  const { data: gastos } = useEntityList('GastoVariavel')
  const { data: contas } = useEntityList('ContaFixa')
  const { data: tarefas } = useEntityList('Tarefa')
  const { data: metas } = useEntityList('Meta')
  const { data: habitos } = useEntityList('Habito')
  const { data: checkins } = useEntityList('CheckIn')
  const { data: conteudos } = useEntityList('Conteudo')
  const { data: ideias } = useEntityList('Ideia')
  const { data: publis } = useEntityList('Publi')

  const today = new Date()
  const greeting = greetingFor(today)
  const startWeek = startOfWeek(today, { weekStartsOn: 1 })

  const totalRenda = salarios.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalGastos = gastos.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalContas = contas.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalSaidas = totalGastos + totalContas
  const saldo = totalRenda - totalSaidas
  const percentRecursos = getUsagePercentage(totalRenda, totalSaidas)

  const tarefasHoje = tarefas.filter((item) => item.prazo && isToday(new Date(item.prazo)) && item.status !== 'concluida')
  const topPrioridades = tarefas
    .filter((item) => item.status !== 'concluida')
    .sort((a, b) => (PRIORITY_ORDER[a.prioridade] ?? 3) - (PRIORITY_ORDER[b.prioridade] ?? 3))
    .slice(0, 4)
  const atrasadas = tarefas.filter((item) => item.prazo && isBefore(new Date(item.prazo), startOfDay(today)) && item.status !== 'concluida')
  const concluidasSemana = tarefas.filter((item) => item.status === 'concluida' && item.updated_date && isAfter(new Date(item.updated_date), startWeek))

  const habitosAtivos = habitos.filter((item) => item.ativo !== false)
  const habitosComProgresso = habitosAtivos.filter((item) => (item.dias_feitos || 0) >= 1).length
  const percentHabitos = habitosAtivos.length ? Math.round((habitosComProgresso / habitosAtivos.length) * 100) : 0
  const streak = Math.max(...habitosAtivos.map((item) => item.dias_feitos || 0), 0)

  const ultimoCheckin = [...checkins].sort((a, b) => new Date(b.data) - new Date(a.data))[0]
  const moodMeta = ultimoCheckin ? HUMOR_META[ultimoCheckin.humor] || HUMOR_META.neutro : null

  const diasNoMes = getDaysInMonth(today)
  const diaAtual = getDate(today)
  const percentMes = Math.round((diaAtual / diasNoMes) * 100)

  const metasAtivas = metas.filter((item) => (item.valor_atual || 0) < (item.valor_total || 1))
  const contasPendentes = contas.filter((item) => item.status === 'pendente')
  const creatorReceita = conteudos
    .filter((item) => item.tipo === 'publi' && item.status_receita === 'confirmado')
    .reduce((sum, item) => sum + (item.receita || 0), 0)
  const creatorPipeline = conteudos.filter((item) => item.etapa && item.etapa !== 'postado').length
  const publisAtivas = publis.filter((item) => ['fechado', 'producao', 'entregue'].includes(item.status)).length

  return (
    <div className="dashboard-theme min-h-screen px-4 pb-12 pt-8 sm:px-8">
      <div className="surface-toolbar mb-6 px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="kicker mb-2">Dashboard principal</p>
            <h2 className="font-cormorant text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Visão geral do seu ciclo
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })} · prioridades, energia e caixa no mesmo ritmo visual das outras abas.
            </p>
          </div>
          <div className="header-actions xl:justify-end">
            <div className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface-elevated)/0.94)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-soft">
              {topPrioridades.length} prioridades abertas
            </div>
            <div className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface-elevated)/0.94)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-soft">
              {habitosAtivos.length} hábitos ativos
            </div>
          </div>
        </div>
        <div className="header-actions mt-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/tarefas">Organizar tarefas</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/agenda">Ver agenda</Link>
          </Button>
        </div>
      </div>

      <HeroCard
        className="dashboard-hero"
        eyebrow="Refined daily dashboard"
        title={`${greeting}${nome ? `, ${nome}` : ''}.`}
        subtitle={
          atrasadas.length > 0
            ? `Seu painel ficou mais sintético e direto: ${atrasadas.length} pendência${atrasadas.length > 1 ? 's' : ''} ainda pede${atrasadas.length > 1 ? 'm' : ''} atenção.`
            : 'Um painel mais enxuto, mais premium e mais fácil de ler, com foco no que realmente move sua vida.'
        }
        progressLabel="Evolução do mês"
        progressText={`${diaAtual} de ${diasNoMes} dias · ${percentHabitos}% de consistência nos hábitos`}
        progressValue={percentMes}
        streak={`${streak}d`}
        nivel={percentHabitos >= 75 ? 'Constância sólida' : percentHabitos >= 45 ? 'Ritmo em formação' : 'Base do ciclo'}
        rightNote={
          ultimoCheckin?.nota
            ? `"${ultimoCheckin.nota}"`
            : 'Menos blocos, mais leitura estratégica e mais presença visual nas informações principais.'
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/checkin">Registrar check-in</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/financeiro">Revisar financeiro</Link>
            </Button>
          </div>
        }
        stats={[
          { label: 'Semana', value: concluidasSemana.length },
          { label: 'Hoje', value: tarefasHoje.length },
          { label: 'Metas', value: metasAtivas.length },
          { label: 'Recursos', value: `${percentRecursos}%` },
        ]}
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Saldo do mês"
          value={formatBRL(saldo)}
          sub={saldo >= 0 ? 'Mês financeiramente equilibrado.' : 'Vale revisar saídas e contas fixas.'}
          variant={saldo >= 0 ? 'positive' : 'negative'}
          icon={CircleDollarSign}
          className="dashboard-card-deep"
        />
        <MetricCard
          label="Foco da semana"
          value={`${concluidasSemana.length} entregas`}
          sub={`${topPrioridades.length} prioridade${topPrioridades.length === 1 ? '' : 's'} abertas`}
          variant="primary"
          icon={Sparkles}
          className="dashboard-card-tinted"
        />
        <MetricCard
          label="Bem-estar"
          value={moodMeta ? `${moodMeta.emoji} ${moodMeta.label}` : 'Sem check-in'}
          sub={ultimoCheckin ? `Energia em ${ultimoCheckin.energia}/10` : 'Seu check-in de hoje ainda não foi feito.'}
          variant="accent"
          icon={HeartPulse}
          className="dashboard-card-tinted"
        />
        <MetricCard
          label="Creator"
          value={formatBRL(creatorReceita)}
          sub={`${creatorPipeline} em produção · ${publisAtivas} publis ativas`}
          variant="studio"
          icon={Video}
          className="dashboard-card-tinted"
        />
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Leitura rápida"
          title="Panorama essencial"
          description="A home agora concentra só o que precisa aparecer primeiro: prioridade, caixa e estado do seu dia."
        />

        <div className="grid gap-4 xl:grid-cols-3">
          <BentoCard title="Prioridades" icon={Sparkles} eyebrow="Hoje e próximos passos" variant="accent" className="dashboard-card-tinted">
            {topPrioridades.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Você ainda não criou prioridades para hoje."
                description="Comece pelo próximo passo mais importante e o restante do painel se organiza ao redor dele."
                ctaHref="/tarefas"
                ctaLabel="Criar tarefa"
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
                          {item.area || 'Geral'}
                        </p>
                      </div>
                      <PriorityBadge priority={item.prioridade} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          <BentoCard title="Financeiro" icon={WalletCards} eyebrow="Resumo do mês" variant={saldo >= 0 ? 'success' : 'danger'} className="dashboard-card-deep">
            <div className="space-y-3">
              <RowStat label="Saldo" value={formatBRL(saldo)} helper="resultado atual" />
              <RowStat label="Renda" value={formatBRL(totalRenda)} helper="entradas registradas" />
              <RowStat label="Saídas" value={formatBRL(totalSaidas)} helper="fixas + variáveis" />
              <RowStat label="Pendências" value={`${contasPendentes.length}`} helper="contas aguardando" />
            </div>
          </BentoCard>

          <BentoCard title="Estado do dia" icon={HeartPulse} eyebrow="Ritmo e energia" className="dashboard-card-deep">
            <div className="space-y-4">
              {ultimoCheckin ? (
                <div className="surface-tile dashboard-tile rounded-[24px] p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-iris-100 to-sand-100 text-3xl shadow-soft dark:from-[#402934] dark:to-[#2b1a24]">
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
                  title="Seu check-in ainda não foi registrado."
                  description="Esse espaço foi mantido mais leve, mas continua acolhedor e útil quando estiver vazio."
                  ctaHref="/checkin"
                  ctaLabel="Fazer check-in"
                />
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <SectionPill icon={Waves} label="Hábitos" value={`${percentHabitos}%`} tone="accent" />
                <SectionPill icon={Flame} label="Streak" value={`${streak} dias`} tone="blush" />
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Ciclo atual"
          title="Metas e creator"
          description="Dois blocos fortes para fechar a leitura da home sem deixá-la longa demais."
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <BentoCard title="Metas em andamento" icon={Target} eyebrow="Progressão do ciclo" className="dashboard-card-deep">
            {metasAtivas.length === 0 ? (
              <EmptyState
                icon={Target}
                title="Suas metas ainda não foram definidas."
                description="Quando houver metas ativas, este bloco vira um resumo direto da sua evolução."
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
                        <span className="rounded-full bg-iris-100 px-3 py-1 text-xs font-semibold text-iris-700 dark:bg-[#442938] dark:text-rose-100">
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

          <BentoCard title="Creator Studio" icon={Lightbulb} eyebrow="Snapshot rápido" variant="studio" className="dashboard-card-tinted">
            {conteudos.length === 0 && ideias.length === 0 && publis.length === 0 ? (
              <EmptyState
                icon={Video}
                title="Seu Creator Studio ainda está vazio."
                description="Aqui entram publis, pipeline, ideias e entregas em uma leitura compacta e mais premium."
                ctaHref="/estudio"
                ctaLabel="Começar no studio"
                tone="studio"
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                <SectionPill icon={Video} label="Pipeline" value={`${creatorPipeline} ativos`} tone="accent" />
                <SectionPill icon={CircleDollarSign} label="Receita" value={formatBRL(creatorReceita)} tone="success" />
                <SectionPill icon={Lightbulb} label="Ideias" value={`${ideias.length}`} tone="default" />
                <SectionPill icon={Sparkles} label="Publis" value={`${publisAtivas} ativas`} tone="blush" />
              </div>
            )}
            <div className="pt-1">
              <SoftAction href="/estudio">Abrir Creator Studio</SoftAction>
            </div>
          </BentoCard>
        </div>
      </section>
    </div>
  )
}
