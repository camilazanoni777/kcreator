'use client'

import {
  CircleDollarSign,
  Flame,
  HeartPulse,
  ListTodo,
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
      ? `${prioritiesCount} prioridade${prioritiesCount > 1 ? 's' : ''}`
      : 'nenhuma prioridade definida'

  const financeText =
    pendingFinanceCount > 0
      ? `${pendingFinanceCount} pendência${pendingFinanceCount > 1 ? 's' : ''} financeira${pendingFinanceCount > 1 ? 's' : ''}`
      : 'caixa sem pendências críticas'

  return `Seu foco hoje: ${focusText}, ${financeText} e ${needsCheckin ? 'check-in não feito' : 'check-in em dia'}.`
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
  const { update } = useEntityMutations('Tarefa')

  const today = new Date()
  const greeting = greetingFor(today)
  const startWeek = startOfWeek(today, { weekStartsOn: 1 })
  const todayKey = format(today, 'yyyy-MM-dd')

  const totalRenda = salarios.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalGastos = gastos.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalContas = contas.reduce((sum, item) => sum + (item.valor || 0), 0)
  const totalSaidas = totalGastos + totalContas
  const saldo = totalRenda - totalSaidas

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

  const diasNoMes = getDaysInMonth(today)
  const diaAtual = getDate(today)
  const percentMes = Math.round((diaAtual / diasNoMes) * 100)

  const metasAtivas = metas.filter(
    (item) => (item.valor_atual || 0) < (item.valor_total || 1)
  )
  const contasPendentes = contas.filter((item) => item.status === 'pendente')
  const creatorReceita = conteudos
    .filter((item) => item.tipo === 'publi' && item.status_receita === 'confirmado')
    .reduce((sum, item) => sum + (item.receita || 0), 0)
  const creatorPipeline = conteudos.filter(
    (item) => item.etapa && item.etapa !== 'postado'
  ).length
  const publisAtivas = publis.filter((item) =>
    ['fechado', 'producao', 'entregue'].includes(item.status)
  ).length
  const creatorIsEmpty =
    conteudos.length === 0 && ideias.length === 0 && publis.length === 0

  const isOnboarding =
    tarefas.length === 0 &&
    metas.length === 0 &&
    checkins.length === 0 &&
    habitos.length === 0 &&
    salarios.length === 0 &&
    gastos.length === 0 &&
    contas.length === 0 &&
    conteudos.length === 0 &&
    ideias.length === 0 &&
    publis.length === 0

  const nextAction = (() => {
    if (!checkinHoje) {
      return {
        title: 'Fazer check-in do dia',
        description: 'Registre humor, energia e foco antes de decidir o resto.',
        context: 'Sem check-in hoje. Esse passo deixa a home mais útil e mais contextual.',
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
        title: 'Definir 3 prioridades',
        description: 'Seu painel já está pronto para orientar o dia, mas ainda falta a decisão central.',
        context: 'Sem prioridades, tudo parece ter o mesmo peso.',
        href: '/tarefas',
        ctaLabel: 'Definir prioridades',
        tone: 'warning',
        icon: Sparkles,
      }
    }

    if (contasPendentes.length > 0 || saldo < 0) {
      return {
        title: 'Revisar pendências financeiras',
        description: 'Feche o que está em aberto para evitar que o restante da rotina fique carregado.',
        context:
          contasPendentes.length > 0
            ? `${contasPendentes.length} conta${contasPendentes.length > 1 ? 's' : ''} aguardando revisão.`
            : 'Seu saldo do mês já pede ajuste.',
        href: '/financeiro',
        ctaLabel: 'Abrir financeiro',
        tone: saldo >= 0 ? 'warning' : 'danger',
        icon: CircleDollarSign,
      }
    }

    if (metasAtivas.length === 0) {
      return {
        title: 'Criar meta do ciclo',
        description: 'Defina um alvo claro para que seu progresso tenha direção, não só movimento.',
        context: 'Sem metas ativas, a evolução do mês perde referência.',
        href: '/metas',
        ctaLabel: 'Criar meta',
        tone: 'accent',
        icon: Target,
      }
    }

    if (creatorIsEmpty) {
      return {
        title: 'Ativar seu Creator Studio',
        description: 'Adicione a primeira publi, ideia ou conteúdo para conectar rotina e creator economy.',
        context: 'Esse módulo fica mais útil quando entra no fluxo real do seu dia.',
        href: '/estudio',
        ctaLabel: 'Começar no studio',
        tone: 'studio',
        icon: Video,
      }
    }

    return {
      title: 'Executar sua prioridade principal',
      description: `Comece por "${topPrioridades[0]?.descricao || 'sua prioridade de hoje'}" e reduza ruído logo cedo.`,
      context: tarefasHoje.length > 0 ? `${tarefasHoje.length} tarefa${tarefasHoje.length > 1 ? 's' : ''} agendada${tarefasHoje.length > 1 ? 's' : ''} para hoje.` : 'Seu dia já tem um foco definido.',
      href: '/hoje',
      ctaLabel: 'Ver meu dia',
      secondaryHref: '/tarefas',
      secondaryLabel: 'Abrir tarefas',
      tone: 'success',
      icon: Sparkles,
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
      name={nome}
      dateLabel={format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
      summary={buildSummary({
        prioritiesCount: topPrioridades.length,
        pendingFinanceCount: contasPendentes.length,
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
          topPrioridades[0]?.descricao || 'Defina a prioridade central do dia',
        focusDescription: topPrioridades[0]
          ? `${topPrioridades[0].area || 'Geral'} · ${dueLabel(topPrioridades[0].prazo)}`
          : 'Escolha uma tarefa principal para o painel parar de competir por atenção.',
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
        emptyDescription: 'Escolha até 3 tarefas centrais para o dia parar de parecer genérico.',
        items: topPrioridades.map((item) => ({
          id: item.id,
          title: item.descricao,
          meta: `${item.area || 'Geral'} · ${dueLabel(item.prazo)}`,
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
            ? 'Seu caixa está saudável, mas continue protegendo margem.'
            : 'Seu mês pede revisão de saídas antes de ganhar mais volume.',
        income: formatBRL(totalRenda),
        incomeHelper: 'Entradas registradas',
        outcome: formatBRL(totalSaidas),
        outcomeHelper: 'Fixas + variáveis',
        pending: `${contasPendentes.length}`,
        pendingHelper:
          contasPendentes.length > 0
            ? 'Contas aguardando ação'
            : 'Nenhuma conta pendente',
        pendingTone: contasPendentes.length > 0 ? 'warning' : 'default',
        primaryHref: '/financeiro',
        primaryLabel: 'Abrir financeiro',
        secondaryHref: '/dividas',
        secondaryLabel: 'Ver dívidas',
      }}
      cycle={{
        headline: isOnboarding
          ? 'Comece pelo básico. O painel vai ganhar inteligência conforme sua rotina entra.'
          : `${percentHabitos}% de consistência nos hábitos e ${concluidasSemana.length} entrega${concluidasSemana.length === 1 ? '' : 's'} concluída${concluidasSemana.length === 1 ? '' : 's'} nesta semana.`,
        description: isOnboarding
          ? 'Primeiro organize os sinais centrais: humor, tarefa, dinheiro e meta.'
          : `Você está no dia ${diaAtual} de ${diasNoMes}, com streak de ${streak} ${streak === 1 ? 'dia' : 'dias'} e ${metasAtivas.length} meta${metasAtivas.length === 1 ? '' : 's'} ativa${metasAtivas.length === 1 ? '' : 's'}.`,
        monthProgress: percentMes,
        heroStats: [
          {
            label: 'Streak',
            value: `${streak} dia${streak === 1 ? '' : 's'}`,
            icon: Flame,
            tone: 'blush',
          },
          {
            label: 'Metas ativas',
            value: `${metasAtivas.length}`,
            icon: Target,
            tone: 'accent',
          },
        ],
        isOnboarding,
        steps: [
          {
            title: 'Fazer primeiro check-in',
            description: 'Comece pelo seu estado do dia.',
            href: '/checkin',
            ctaLabel: 'Fazer check-in',
            icon: HeartPulse,
          },
          {
            title: 'Criar primeira tarefa',
            description: 'Defina o que importa agora.',
            href: '/tarefas',
            ctaLabel: 'Criar tarefa',
            icon: ListTodo,
          },
          {
            title: 'Registrar primeira entrada',
            description: 'Dê contexto ao seu caixa.',
            href: '/financeiro',
            ctaLabel: 'Abrir financeiro',
            icon: WalletCards,
          },
          {
            title: 'Definir primeira meta',
            description: 'Crie direção para o ciclo.',
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
            label: 'Streak',
            value: `${streak}`,
            helper: 'Dias de constância',
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
        emptyDescription: 'Use a agenda para dar hora e contexto ao que já é prioridade.',
        items: agendaItems.map((item) => ({
          id: item.id,
          title: item.descricao,
          meta: item.area || 'Geral',
          timeLabel: dueLabel(item.prazo),
        })),
      }}
      creator={{
        href: '/estudio',
        isEmpty: creatorIsEmpty,
        emptyTitle: 'Creator Studio vazio',
        emptyDescription: 'Publis, pipeline e entregas aparecem aqui quando entram na sua rotina real.',
        emptyCtaLabel: 'Começar agora',
        stats: [
          {
            label: 'Receita',
            value: formatBRL(creatorReceita),
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
            ? `Você tem ${creatorPipeline} conteúdo${creatorPipeline === 1 ? '' : 's'} em andamento e ${publisAtivas} publi${publisAtivas === 1 ? '' : 's'} ativa${publisAtivas === 1 ? '' : 's'}.`
            : `A receita creator confirmada do mês está em ${formatBRL(creatorReceita)}.`,
      }}
      goals={{
        href: '/metas',
        emptyTitle: 'Nenhuma meta ativa',
        emptyDescription: 'Sem meta do ciclo, os números perdem direção.',
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
