'use client'

import {
  CircleDollarSign,
  Flame,
  HeartPulse,
  ListTodo,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Video,
  WalletCards,
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

import { formatBRL } from '@/lib/formatCurrency'
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities'
import { usePlan } from '@/lib/PlanContext'

import DashboardOverview from './DashboardOverview'
import { greetingFor, PRIORITY_ORDER } from './helpers'

const HUMOR_META = {
  otimo: { label: 'Ótimo', tone: 'success' },
  bom: { label: 'Bom', tone: 'accent' },
  neutro: { label: 'Neutro', tone: 'default' },
  cansado: { label: 'Cansado', tone: 'blush' },
  ruim: { label: 'Ruim', tone: 'danger' },
}

function taskProgress(status) {
  if (status === 'concluida') return 100
  if (status === 'andamento') return 64
  return 24
}

function dueLabel(value) {
  if (!value) return 'Sem prazo'

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Sem prazo'
  if (isToday(parsed)) return 'Hoje'

  return format(parsed, "d 'de' MMM", { locale: ptBR })
}

function buildSummary({ prioritiesCount, pendingFinanceCount, needsCheckin }) {
  const focusText =
    prioritiesCount > 0
      ? `${prioritiesCount} prioridade${prioritiesCount > 1 ? 's' : ''} do casal`
      : 'nenhuma prioridade definida'

  const financeText =
    pendingFinanceCount > 0
      ? `${pendingFinanceCount} pendência${pendingFinanceCount > 1 ? 's' : ''} financeira${pendingFinanceCount > 1 ? 's' : ''}`
      : 'caixa da casa sob controle'

  return `Seu foco hoje: ${focusText}, ${financeText} e ${needsCheckin ? 'check-in não feito' : 'check-in em dia'}.`
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
  const { update } = useEntityMutations('Tarefa')

  const today = new Date()
  const greeting = greetingFor(today)
  const startWeek = startOfWeek(today, { weekStartsOn: 1 })
  const todayKey = format(today, 'yyyy-MM-dd')

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
  const contasPendentes = contas.filter((item) => item.status === 'pendente')
  const totalDividas = dividas.reduce((sum, item) => {
    const pago =
      ((item.valor_total || 0) / (item.parcelas_total || 1)) * (item.parcelas_pagas || 0)
    return sum + ((item.valor_total || 0) - pago)
  }, 0)

  const tarefasAbertas = tarefas.filter((item) => item.status !== 'concluida')
  const tarefasHoje = tarefasAbertas.filter(
    (item) => item.prazo && isToday(new Date(item.prazo))
  )
  const topPrioridades = [...tarefasAbertas]
    .sort(
      (a, b) =>
        (PRIORITY_ORDER[a.prioridade] ?? 3) - (PRIORITY_ORDER[b.prioridade] ?? 3)
    )
    .slice(0, 3)
  const atrasadas = tarefasAbertas.filter(
    (item) => item.prazo && isBefore(new Date(item.prazo), startOfDay(today))
  )
  const concluidasSemana = tarefas.filter(
    (item) =>
      item.status === 'concluida' &&
      item.updated_date &&
      isAfter(new Date(item.updated_date), startWeek)
  )

  const diasNoMes = getDaysInMonth(today)
  const diaAtual = getDate(today)
  const percentMes = Math.round((diaAtual / diasNoMes) * 100)

  const metasAtivas = metas.filter(
    (item) => (item.valor_atual || 0) < (item.valor_total || 1)
  )
  const publisReceita = conteudos
    .filter((item) => item.tipo === 'publi' && item.status_receita === 'confirmado')
    .reduce((sum, item) => sum + (item.receita || 0), 0)
  const creatorPipeline = conteudos.filter(
    (item) => item.etapa && !['postado', 'ideia'].includes(item.etapa)
  ).length
  const publisAtivas = publis.filter((item) =>
    ['fechado', 'producao', 'entregue'].includes(item.status)
  ).length
  const creatorIsEmpty =
    conteudos.length === 0 && publis.length === 0 && ideias.length === 0

  const habitosAtivos = habitos.filter((item) => item.ativo !== false)
  const habitosComProgresso = habitosAtivos.filter(
    (item) => (item.dias_feitos || 0) >= 1
  ).length
  const percentHabitos = habitosAtivos.length
    ? Math.round((habitosComProgresso / habitosAtivos.length) * 100)
    : 0
  const streak = Math.max(...habitosAtivos.map((item) => item.dias_feitos || 0), 0)

  const checkinsOrdenados = [...checkins].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  )
  const checkinHoje = checkins.find((item) => item.data === todayKey)
  const ultimoCheckin = checkinHoje || checkinsOrdenados[0]
  const moodMeta = ultimoCheckin
    ? HUMOR_META[ultimoCheckin.humor] || HUMOR_META.neutro
    : null

  const alignmentScore = (() => {
    const taskFactor = tarefas.length ? (concluidasSemana.length / tarefas.length) * 100 : 35
    const goalFactor = metas.length
      ? (metas.filter((item) => (item.valor_atual || 0) >= (item.valor_total || 1)).length / metas.length) * 100
      : 35
    const financeFactor = saldo >= 0 ? 80 : 45
    return Math.round(taskFactor * 0.35 + goalFactor * 0.2 + financeFactor * 0.25 + percentHabitos * 0.2)
  })()

  const isOnboarding =
    tarefas.length === 0 &&
    metas.length === 0 &&
    checkins.length === 0 &&
    habitos.length === 0 &&
    salarios.length === 0 &&
    gastos.length === 0 &&
    contas.length === 0 &&
    entradas.length === 0 &&
    dividas.length === 0 &&
    conteudos.length === 0 &&
    ideias.length === 0 &&
    publis.length === 0

  const nextAction = (() => {
    if (!checkinHoje) {
      return {
        title: 'Fazer check-in do dia',
        description: 'Comecem pelo estado do dia antes de abrir agenda, dinheiro e entregas.',
        context: 'Sem check-in hoje. Isso deixa a leitura do sistema menos contextual.',
        href: '/checkin',
        ctaLabel: 'Fazer check-in',
        secondaryHref: '/hoje',
        secondaryLabel: 'Ver meu dia',
        tone: 'accent',
        icon: HeartPulse,
      }
    }

    if (topPrioridades.length === 0) {
      return {
        title: 'Definir prioridades da casa',
        description: 'Sem uma decisão principal, rotina, financeiro e creator passam a competir entre si.',
        context: 'Escolham até 3 prioridades para reduzir dispersão.',
        href: '/tarefas',
        ctaLabel: 'Definir prioridades',
        tone: 'warning',
        icon: Sparkles,
      }
    }

    if (contasPendentes.length > 0 || totalDividas > 0 || saldo < 0) {
      return {
        title: 'Revisar caixa da casa',
        description: 'Fechem o que está em aberto para que o resto da semana não carregue ruído.',
        context:
          totalDividas > 0
            ? `${formatBRL(totalDividas)} ainda comprometidos em dívidas ativas.`
            : `${contasPendentes.length} conta${contasPendentes.length > 1 ? 's' : ''} pendente${contasPendentes.length > 1 ? 's' : ''}.`,
        href: '/financeiro',
        ctaLabel: 'Abrir financeiro',
        tone: saldo >= 0 ? 'warning' : 'danger',
        icon: CircleDollarSign,
      }
    }

    if (metasAtivas.length === 0) {
      return {
        title: 'Definir meta do ciclo',
        description: 'Criem um alvo comum para transformar movimento em progresso compartilhado.',
        context: 'Sem meta ativa, o mês perde direção estratégica.',
        href: '/metas',
        ctaLabel: 'Criar meta',
        tone: 'accent',
        icon: Target,
      }
    }

    if (creatorIsEmpty) {
      return {
        title: 'Ativar o Creator Studio',
        description: 'Adicionem a primeira publi ou entrega para conectar creator economy com a rotina real.',
        context: 'Esse é um diferencial do produto e deve aparecer no fluxo de vocês.',
        href: '/estudio',
        ctaLabel: 'Começar no studio',
        tone: 'studio',
        icon: Video,
      }
    }

    return {
      title: 'Executar a prioridade principal do casal',
      description: `Comecem por "${topPrioridades[0]?.descricao || 'sua prioridade de hoje'}" para dar direção ao restante do dia.`,
      context:
        tarefasHoje.length > 0
          ? `${tarefasHoje.length} tarefa${tarefasHoje.length > 1 ? 's' : ''} agendada${tarefasHoje.length > 1 ? 's' : ''} para hoje.`
          : 'A casa já tem foco suficiente para avançar.',
      href: '/hoje',
      ctaLabel: 'Ver meu dia',
      secondaryHref: '/tarefas',
      secondaryLabel: 'Abrir tarefas',
      tone: 'success',
      icon: ShieldCheck,
    }
  })()

  const cycleGoalAverage = metasAtivas.length
    ? Math.round(
        metasAtivas.reduce((sum, item) => {
          const progress = ((item.valor_atual || 0) / (item.valor_total || 1)) * 100
          return sum + Math.min(progress, 100)
        }, 0) / metasAtivas.length
      )
    : 0

  const agendaItems = [...tarefasHoje, ...atrasadas]
    .filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index)
    .slice(0, 3)

  return (
    <DashboardOverview
      greeting={greeting}
      name={`${primaryName} & ${secondaryName}`}
      dateLabel={format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
      summary={buildSummary({
        prioritiesCount: topPrioridades.length,
        pendingFinanceCount: contasPendentes.length + (totalDividas > 0 ? 1 : 0),
        needsCheckin: !checkinHoje,
      })}
      actions={[
        {
          href: '/checkin',
          label: 'Fazer check-in',
          primary: true,
          icon: HeartPulse,
        },
        {
          href: '/hoje',
          label: 'Ver meu dia',
          variant: 'outline',
        },
        {
          href: '/tarefas',
          label: 'Adicionar tarefa',
          variant: 'ghost',
          icon: ListTodo,
        },
      ]}
      nextAction={nextAction}
      today={{
        checkinStatus: checkinHoje ? 'Feito' : 'Pendente',
        checkinTone: checkinHoje ? 'success' : 'default',
        energyLabel: moodMeta
          ? `${moodMeta.label} · ${ultimoCheckin.energia}/10`
          : 'Sem registro',
        energyTone: moodMeta?.tone || 'default',
        focusTitle:
          topPrioridades[0]?.descricao || 'Definam a prioridade central do dia',
        focusDescription: topPrioridades[0]
          ? `${topPrioridades[0].responsavel || 'Ambos'} · ${topPrioridades[0].area || 'Geral'} · ${dueLabel(topPrioridades[0].prazo)}`
          : 'Escolham uma tarefa principal para a home deixar de parecer uma vitrine de módulos.',
        nextStepTitle: nextAction.title,
        nextStepDescription: nextAction.description,
        primaryHref: nextAction.href,
        primaryLabel: nextAction.ctaLabel,
        secondaryHref: '/tarefas',
        secondaryLabel: 'Abrir tarefas',
      }}
      priorities={{
        href: '/tarefas',
        actionLabel: 'Nova tarefa',
        emptyTitle: 'Nenhuma prioridade definida',
        emptyDescription: 'Escolham até 3 prioridades para o dia ganhar direção compartilhada.',
        items: topPrioridades.map((item) => ({
          id: item.id,
          title: item.descricao,
          meta: `${item.responsavel || 'Ambos'} · ${item.area || 'Geral'} · ${dueLabel(item.prazo)}`,
          priority: item.prioridade,
          progress: taskProgress(item.status),
          progressLabel:
            item.status === 'andamento' ? 'Em andamento' : 'Pronta para começar',
        })),
      }}
      finance={{
        variant: saldo >= 0 ? 'success' : 'danger',
        balance: formatBRL(saldo),
        balanceNote:
          saldo >= 0
            ? 'O caixa da casa está equilibrado, mas ainda merece visão de conjunto.'
            : 'A casa já pede ajuste de saídas e revisão de compromissos.',
        income: formatBRL(totalCasa),
        incomeHelper: `Renda + extras (${formatBRL(entradasExtras)})`,
        outcome: formatBRL(totalSaidas),
        outcomeHelper: 'Fixas + variáveis',
        pending: contasPendentes.length > 0 ? `${contasPendentes.length}` : formatBRL(totalDividas),
        pendingHelper:
          contasPendentes.length > 0
            ? 'Contas aguardando ação'
            : totalDividas > 0
              ? 'Dívidas ainda ativas'
              : 'Nenhuma pendência crítica',
        pendingTone:
          contasPendentes.length > 0 || totalDividas > 0 ? 'warning' : 'default',
        primaryHref: '/financeiro',
        primaryLabel: 'Abrir financeiro',
        secondaryHref: '/dividas',
        secondaryLabel: 'Ver dívidas',
      }}
      cycle={{
        headline: isOnboarding
          ? 'Comecem pelo básico. Quando rotina, dinheiro e foco entram, a home fica realmente inteligente.'
          : `${alignmentScore}% de alinhamento do ciclo, com ${percentHabitos}% de consistência nos hábitos e ${concluidasSemana.length} entrega${concluidasSemana.length === 1 ? '' : 's'} na semana.`,
        description: isOnboarding
          ? 'O primeiro passo aqui é organizar sinais centrais do sistema da casa.'
          : `Vocês estão no dia ${diaAtual} de ${diasNoMes}, com streak de ${streak} ${streak === 1 ? 'dia' : 'dias'} e ${metasAtivas.length} meta${metasAtivas.length === 1 ? '' : 's'} ativa${metasAtivas.length === 1 ? '' : 's'}.`,
        monthProgress: percentMes,
        heroStats: [
          {
            label: 'Alinhamento',
            value: `${alignmentScore}%`,
            icon: ShieldCheck,
            tone: 'accent',
          },
          {
            label: 'Streak',
            value: `${streak} dia${streak === 1 ? '' : 's'}`,
            icon: Flame,
            tone: 'blush',
          },
        ],
        isOnboarding,
        steps: [
          {
            title: 'Fazer primeiro check-in',
            description: 'Leiam o estado do dia antes do resto.',
            href: '/checkin',
            ctaLabel: 'Fazer check-in',
            icon: HeartPulse,
          },
          {
            title: 'Criar primeira tarefa',
            description: 'Definam a prioridade central.',
            href: '/tarefas',
            ctaLabel: 'Criar tarefa',
            icon: ListTodo,
          },
          {
            title: 'Registrar primeira entrada',
            description: 'Dêem contexto ao caixa da casa.',
            href: '/financeiro',
            ctaLabel: 'Abrir financeiro',
            icon: WalletCards,
          },
          {
            title: 'Definir primeira meta',
            description: 'Criem direção para o ciclo.',
            href: '/metas',
            ctaLabel: 'Criar meta',
            icon: Target,
          },
        ],
        stats: [
          {
            label: 'Hábitos',
            value: `${habitosComProgresso}/${habitosAtivos.length || 0}`,
            helper: 'Com progresso no ciclo',
          },
          {
            label: 'Metas',
            value: `${metasAtivas.length}`,
            helper:
              metasAtivas.length > 0
                ? `${cycleGoalAverage}% de avanço médio`
                : 'Nenhuma meta ativa',
          },
          {
            label: 'Semana',
            value: `${concluidasSemana.length}`,
            helper: 'Tarefas concluídas',
          },
          {
            label: 'Caixa',
            value: saldo >= 0 ? 'Saudável' : 'Em ajuste',
            helper: saldo >= 0 ? 'Sem pressão imediata' : 'Precisa de revisão',
          },
          {
            label: 'Mês',
            value: `${percentMes}%`,
            helper: 'Ciclo já percorrido',
          },
        ],
      }}
      agenda={{
        href: '/agenda',
        todayCount: `${tarefasHoje.length}`,
        overdueCount: `${atrasadas.length}`,
        overdueTone: atrasadas.length > 0 ? 'danger' : 'default',
        emptyTitle: 'Nada agendado para hoje',
        emptyDescription: 'Agendem tarefas-chave para a rotina não depender só de memória.',
        items: agendaItems.map((item) => ({
          id: item.id,
          title: item.descricao,
          meta: `${item.responsavel || 'Ambos'} · ${item.area || 'Geral'}`,
          timeLabel: dueLabel(item.prazo),
        })),
      }}
      creator={{
        href: '/estudio',
        isEmpty: creatorIsEmpty,
        emptyTitle: 'Creator Studio vazio',
        emptyDescription: 'Publis, ideias e entregas passam a aparecer aqui quando entram no fluxo da casa.',
        emptyCtaLabel: 'Começar agora',
        stats: [
          {
            label: 'Receita',
            value: formatBRL(publisReceita),
            icon: CircleDollarSign,
            tone: 'success',
          },
          {
            label: 'Pipeline',
            value: `${creatorPipeline}`,
            icon: Video,
            tone: 'accent',
          },
          {
            label: 'Publis',
            value: `${publisAtivas}`,
            icon: Sparkles,
            tone: 'blush',
          },
          {
            label: 'Ideias',
            value: `${ideias.length}`,
            icon: TrendingUp,
            tone: 'default',
          },
        ],
        note:
          creatorPipeline > 0
            ? `Vocês têm ${creatorPipeline} entrega${creatorPipeline === 1 ? '' : 's'} creator em andamento e ${publisAtivas} publi${publisAtivas === 1 ? '' : 's'} ativa${publisAtivas === 1 ? '' : 's'}.`
            : `A receita creator confirmada do mês está em ${formatBRL(publisReceita)}.`,
      }}
      goals={{
        href: '/metas',
        emptyTitle: 'Nenhuma meta ativa',
        emptyDescription: 'Sem meta do ciclo, o progresso perde referência compartilhada.',
        emptyCtaLabel: 'Criar meta',
        items: metasAtivas.slice(0, 3).map((item) => {
          const progress = Math.min(
            Math.round(((item.valor_atual || 0) / (item.valor_total || 1)) * 100),
            100
          )

          return {
            id: item.id,
            title: item.titulo,
            meta: `${formatBRL(item.valor_atual || 0)} de ${formatBRL(item.valor_total || 0)}`,
            progress,
          }
        }),
      }}
      onCompleteTask={(taskId) =>
        update.mutate({
          id: taskId,
          data: { status: 'concluida' },
        })
      }
    />
  )
}
