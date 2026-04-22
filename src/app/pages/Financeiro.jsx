'use client'

import { useState } from 'react';
import { Scale, ShoppingCart, CalendarDays, DollarSign, List, Check, TrendingUp, Trash2 } from 'lucide-react';
import BentoCard from '@/components/shared/BentoCard';
import PageHeader from '@/components/shared/PageHeader';
import { formatBRL } from '@/lib/formatCurrency';
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isBefore, startOfDay } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CATEGORIAS = [
  'Alimentação', 'Salão de Beleza', 'Farmácia/Saúde', 'Moradia', 'Gasolina',
  'Maconha', 'Unha', 'Cílios', 'Investimento', 'Lazer/Roles',
  'Espiritualidade', 'Tabacaria', 'Débito', 'Assinaturas Digitais', 'Outros'
];
const CATEGORIAS_ENTRADA = [
  'Freelance', 'Plataformas', 'TiktokShop', 'Plano de Saúde', 'Papelito',
  'Emprestado', 'Bônus', 'Venda', 'Bonificação', 'Presente', 'Outros'
];
const RESPONSAVEIS = ['Victor', 'Camila', 'Ambos'];
const COLORS = ['hsl(217,91%,60%)', 'hsl(330,80%,65%)', 'hsl(160,60%,45%)', 'hsl(43,96%,58%)', 'hsl(280,65%,60%)'];

export default function Financeiro() {
  const { data: salarios } = useEntityList('Salario');
  const { data: gastos } = useEntityList('GastoVariavel');
  const { data: contas } = useEntityList('ContaFixa');
  const { data: entradas } = useEntityList('EntradaExtra');
  const salMut = useEntityMutations('Salario');
  const gastoMut = useEntityMutations('GastoVariavel');
  const contaMut = useEntityMutations('ContaFixa');
  const entradaMut = useEntityMutations('EntradaExtra');

  const [gastoForm, setGastoForm] = useState({ descricao: '', valor: '', categoria: 'Alimentação', responsavel: 'Victor' });
  const [contaForm, setContaForm] = useState({ nome: '', valor: '', vencimento: '', status: 'pendente' });
  const [entradaForm, setEntradaForm] = useState({ descricao: '', valor: '', categoria: 'Outros', responsavel: 'Victor' });
  const [salVictor, setSalVictor] = useState('');
  const [salCamila, setSalCamila] = useState('');

  const totalVictor = salarios.find(s => s.pessoa === 'Victor')?.valor || 0;
  const totalCamila = salarios.find(s => s.pessoa === 'Camila')?.valor || 0;
  const totalSalarios = totalVictor + totalCamila;
  const totalEntradasExtra = entradas.reduce((s, e) => s + (e.valor || 0), 0);
  const totalCasa = totalSalarios + totalEntradasExtra;
  const totalGastos = gastos.reduce((s, g) => s + (g.valor || 0), 0);
  const totalContas = contas.reduce((s, c) => s + (c.valor || 0), 0);
  const saldo = totalCasa - totalGastos - totalContas;

  const chartData = CATEGORIAS.map(cat => ({
    name: cat,
    value: gastos.filter(g => g.categoria === cat).reduce((s, g) => s + (g.valor || 0), 0),
  })).filter(d => d.value > 0);

  const handleEntrada = (e) => {
    e.preventDefault();
    entradaMut.create.mutate({ ...entradaForm, valor: Number(entradaForm.valor), data: new Date().toISOString().split('T')[0] });
    setEntradaForm({ descricao: '', valor: '', categoria: 'Outros', responsavel: 'Victor' });
  };

  const handleGasto = (e) => {
    e.preventDefault();
    gastoMut.create.mutate({ ...gastoForm, valor: Number(gastoForm.valor), data: new Date().toISOString().split('T')[0] });
    setGastoForm({ descricao: '', valor: '', categoria: 'Alimentação', responsavel: 'Victor' });
  };

  const handleConta = (e) => {
    e.preventDefault();
    contaMut.create.mutate({ ...contaForm, valor: Number(contaForm.valor) });
    setContaForm({ nome: '', valor: '', vencimento: '', status: 'pendente' });
  };

  const handleSalarios = () => {
    const existV = salarios.find(s => s.pessoa === 'Victor');
    const existC = salarios.find(s => s.pessoa === 'Camila');
    if (salVictor) {
      if (existV) salMut.update.mutate({ id: existV.id, data: { valor: Number(salVictor) } });
      else salMut.create.mutate({ pessoa: 'Victor', valor: Number(salVictor) });
    }
    if (salCamila) {
      if (existC) salMut.update.mutate({ id: existC.id, data: { valor: Number(salCamila) } });
      else salMut.create.mutate({ pessoa: 'Camila', valor: Number(salCamila) });
    }
    setSalVictor('');
    setSalCamila('');
  };

  const getContaStatus = (conta) => {
    if (conta.status === 'pago') return 'pago';
    if (!conta.vencimento) return 'pendente';
    const venc = new Date(conta.vencimento);
    if (isToday(venc)) return 'hoje';
    if (isBefore(venc, startOfDay(new Date()))) return 'atrasado';
    return 'pendente';
  };

  const statusStyles = {
    pago: 'bg-green-500/20 text-green-400 border-green-500/30',
    hoje: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    atrasado: 'bg-red-500/20 text-red-400 border-red-500/30',
    pendente: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div>
      <PageHeader title="Financeiro" subtitle="Controle de entradas e saídas" />
      <div className="px-4 sm:px-8 pb-8 space-y-6">

        {/* Balanço + Gráfico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BentoCard title="Balanço do Mês" icon={Scale}>
            <div className="text-center space-y-3">
              <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-green-400' : 'text-destructive'}`}>{formatBRL(saldo)}</p>
              <div className="flex justify-around text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Entradas</span>
                  <span className="text-green-400 font-semibold">+{formatBRL(totalCasa)}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Saídas</span>
                  <span className="text-destructive font-semibold">-{formatBRL(totalGastos + totalContas)}</span>
                </div>
              </div>
              {totalEntradasExtra > 0 && (
                <p className="text-xs text-muted-foreground">Inclui {formatBRL(totalEntradasExtra)} em entradas extras</p>
              )}
            </div>
          </BentoCard>

          <BentoCard title="Distribuição de Despesas" icon={List}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val) => formatBRL(val)} contentStyle={{ background: 'hsl(230,15%,11%)', border: '1px solid hsl(230,15%,18%)', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">Nenhum gasto registrado</p>
            )}
          </BentoCard>
        </div>

        {/* Entradas Extras + Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BentoCard title="Nova Entrada Extra" icon={TrendingUp}>
            <form onSubmit={handleEntrada} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Descrição</Label>
                  <Input value={entradaForm.descricao} onChange={e => setEntradaForm({ ...entradaForm, descricao: e.target.value })} placeholder="Ex: Freela de design" required />
                </div>
                <div>
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input type="number" step="0.01" value={entradaForm.valor} onChange={e => setEntradaForm({ ...entradaForm, valor: e.target.value })} placeholder="0,00" required />
                </div>
                <div>
                  <Label className="text-xs">Categoria</Label>
                  <Select value={entradaForm.categoria} onValueChange={v => setEntradaForm({ ...entradaForm, categoria: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIAS_ENTRADA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Responsável</Label>
                  <Select value={entradaForm.responsavel} onValueChange={v => setEntradaForm({ ...entradaForm, responsavel: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{RESPONSAVEIS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">Registrar Entrada</Button>
            </form>
          </BentoCard>

          {/* Lista de Entradas Extras */}
          <BentoCard title="Entradas Extras do Mês" icon={TrendingUp}>
            {entradas.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Nenhuma entrada extra registrada</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium px-1">
                  <span>Total extras:</span>
                  <span className="text-green-400 font-bold">{formatBRL(totalEntradasExtra)}</span>
                </div>
                {entradas.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-2.5 rounded-lg border border-green-500/20 bg-green-500/5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{e.descricao}</p>
                      <p className="text-[10px] text-muted-foreground">{e.responsavel} · {e.categoria}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold text-green-400">+{formatBRL(e.valor)}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => entradaMut.remove.mutate(e.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>

        {/* Forms de Gastos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gasto Variável */}
          <BentoCard title="Novo Gasto Variável" icon={ShoppingCart}>
            <form onSubmit={handleGasto} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Descrição</Label>
                  <Input value={gastoForm.descricao} onChange={e => setGastoForm({ ...gastoForm, descricao: e.target.value })} placeholder="Ex: Mercado" required />
                </div>
                <div>
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input type="number" step="0.01" value={gastoForm.valor} onChange={e => setGastoForm({ ...gastoForm, valor: e.target.value })} placeholder="0,00" required />
                </div>
                <div>
                  <Label className="text-xs">Categoria</Label>
                  <Select value={gastoForm.categoria} onValueChange={v => setGastoForm({ ...gastoForm, categoria: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Responsável</Label>
                  <Select value={gastoForm.responsavel} onValueChange={v => setGastoForm({ ...gastoForm, responsavel: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{RESPONSAVEIS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" variant="destructive" className="w-full">Registrar Gasto</Button>
            </form>
          </BentoCard>

          {/* Conta Fixa */}
          <BentoCard title="Nova Conta Fixa" icon={CalendarDays}>
            <form onSubmit={handleConta} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Nome da Conta</Label>
                  <Input value={contaForm.nome} onChange={e => setContaForm({ ...contaForm, nome: e.target.value })} placeholder="Ex: Aluguel" required />
                </div>
                <div>
                  <Label className="text-xs">Valor (R$)</Label>
                  <Input type="number" step="0.01" value={contaForm.valor} onChange={e => setContaForm({ ...contaForm, valor: e.target.value })} placeholder="0,00" required />
                </div>
                <div>
                  <Label className="text-xs">Vencimento</Label>
                  <Input type="date" value={contaForm.vencimento} onChange={e => setContaForm({ ...contaForm, vencimento: e.target.value })} required />
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={contaForm.status} onValueChange={v => setContaForm({ ...contaForm, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Registrar Conta</Button>
            </form>
          </BentoCard>
        </div>

        {/* Salários */}
        <BentoCard title="Salários Base" icon={DollarSign}>
          <p className="text-xs text-muted-foreground mb-3">Victor: {formatBRL(totalVictor)} | Camila: {formatBRL(totalCamila)}</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <Label className="text-xs">Salário Victor</Label>
              <Input type="number" step="0.01" value={salVictor} onChange={e => setSalVictor(e.target.value)} placeholder={String(totalVictor || '0,00')} />
            </div>
            <div className="flex-1 min-w-[140px]">
              <Label className="text-xs">Salário Camila</Label>
              <Input type="number" step="0.01" value={salCamila} onChange={e => setSalCamila(e.target.value)} placeholder={String(totalCamila || '0,00')} />
            </div>
            <Button onClick={handleSalarios} className="shrink-0">Atualizar</Button>
          </div>
        </BentoCard>

        {/* Lista de Contas */}
        <BentoCard title="Contas a Pagar" icon={List}>
          <div className="flex gap-2 mb-3 flex-wrap">
            {['pago', 'hoje', 'atrasado', 'pendente'].map(s => (
              <Badge key={s} variant="outline" className={statusStyles[s]}>{s === 'hoje' ? 'Vence Hoje' : s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
            ))}
          </div>
          {contas.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma conta cadastrada</p>
          ) : (
            <div className="space-y-2">
              {contas.map(c => {
                const st = getContaStatus(c);
                return (
                  <div key={c.id} className={`flex items-center justify-between p-3 rounded-lg border ${statusStyles[st]}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.nome}</p>
                      <p className="text-xs opacity-70">{c.vencimento ? format(new Date(c.vencimento), 'dd/MM/yyyy') : 'Sem data'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatBRL(c.valor)}</span>
                      {c.status !== 'pago' && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-green-400" onClick={() => contaMut.update.mutate({ id: c.id, data: { status: 'pago' } })}>
                          <Check className="w-3 h-3 mr-1" /> Pagar
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => contaMut.remove.mutate(c.id)}>✕</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </BentoCard>

      </div>
    </div>
  );
}
