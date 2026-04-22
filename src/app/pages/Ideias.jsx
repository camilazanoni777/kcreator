'use client'

import { Lightbulb, Plus, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import BentoCard from '@/components/shared/BentoCard';
import PageHeader from '@/components/shared/PageHeader';
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const TIPO_EMOJI = {
  video: '🎬', reels: '🎞️', stories: '📱', carrossel: '📚', live: '🔴', podcast: '🎙️', post: '📝', outro: '💡'
};

const STATUS_CONFIG = {
  rascunho: { label: 'Rascunho', color: 'text-muted-foreground', bg: 'bg-secondary/50' },
  aprovada: { label: 'Aprovada ✓', color: 'text-green-400', bg: 'bg-green-500/8 border border-green-500/15' },
  em_producao: { label: 'Em produção', color: 'text-blue-400', bg: 'bg-blue-500/8 border border-blue-500/15' },
  descartada: { label: 'Descartada', color: 'text-muted-foreground/40', bg: 'bg-muted/20' },
};

const CATEGORIAS = ['Lifestyle', 'Viagem', 'Moda', 'Beleza', 'Finanças', 'Relacionamento', 'Produtividade', 'Humor', 'Educação', 'Outro'];

export default function Ideias() {
  const { data: ideias } = useEntityList('Ideia');
  const { create, update, remove } = useEntityMutations('Ideia');
  const [showForm, setShowForm] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [form, setForm] = useState({ titulo: '', gancho: '', descricao: '', tipo: 'reels', categoria: 'Lifestyle', plataforma: 'Instagram', status: 'rascunho', urgencia: 'media' });

  const handleSubmit = (e) => {
    e.preventDefault();
    create.mutate(form);
    setForm({ titulo: '', gancho: '', descricao: '', tipo: 'reels', categoria: 'Lifestyle', plataforma: 'Instagram', status: 'rascunho', urgencia: 'media' });
    setShowForm(false);
  };

  const filtered = ideias.filter(i => {
    if (filtroStatus && filtroStatus !== 'all' && i.status !== filtroStatus) return false;
    if (filtroCategoria && filtroCategoria !== 'all' && i.categoria !== filtroCategoria) return false;
    return true;
  });

  const aprovadas = ideias.filter(i => i.status === 'aprovada').length;
  const emProducao = ideias.filter(i => i.status === 'em_producao').length;

  return (
    <div>
      <PageHeader
        title="Banco de Ideias"
        subtitle="Capture inspirações, ganchos e conceitos antes que passem"
        action={
          <Button size="sm" onClick={() => setShowForm(v => !v)} className="gap-2">
            <Plus className="w-3.5 h-3.5" /> Nova Ideia
          </Button>
        }
      />

      <div className="px-4 sm:px-8 pb-10 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border/60 bg-card p-4 text-center">
            <p className="text-2xl font-bold stat-number">{ideias.length}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-widest">Total</p>
          </div>
          <div className="rounded-2xl border border-green-500/15 bg-green-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-green-400 stat-number">{aprovadas}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-widest">Aprovadas</p>
          </div>
          <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-blue-400 stat-number">{emProducao}</p>
            <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-widest">Em produção</p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <BentoCard title="Nova Ideia" icon={Lightbulb} accent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Título *</Label>
                  <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="O que é essa ideia?" required />
                </div>
                <div>
                  <Label className="text-xs">Gancho / Headline</Label>
                  <Input value={form.gancho} onChange={e => setForm({ ...form, gancho: e.target.value })} placeholder="Como você abriria esse conteúdo?" />
                </div>
                <div>
                  <Label className="text-xs">Tipo</Label>
                  <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIPO_EMOJI).map(([k, emoji]) => <SelectItem key={k} value={k}>{emoji} {k.charAt(0).toUpperCase() + k.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Categoria</Label>
                  <Select value={form.categoria} onValueChange={v => setForm({ ...form, categoria: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Plataforma</Label>
                  <Select value={form.plataforma} onValueChange={v => setForm({ ...form, plataforma: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Instagram', 'TikTok', 'YouTube', 'Blog', 'Todos'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Urgência</Label>
                  <Select value={form.urgencia} onValueChange={v => setForm({ ...form, urgencia: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">🟢 Baixa</SelectItem>
                      <SelectItem value="media">🟡 Média</SelectItem>
                      <SelectItem value="alta">🔴 Alta — trend passando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Descrição / Notas</Label>
                <Input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Detalhes, referências, pontos do roteiro..." />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" size="sm">Salvar Ideia</Button>
              </div>
            </form>
          </BentoCard>
        )}

        {/* Filtros */}
        <div className="flex gap-3 flex-wrap">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Todos os status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Todas as categorias" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Grid de ideias */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">💡</p>
            <p className="text-sm font-medium text-foreground/70 mb-1">O banco de ideias está vazio</p>
            <p className="text-xs text-muted-foreground/50">Capture suas inspirações antes que elas escapem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(i => {
              const sc = STATUS_CONFIG[i.status] || STATUS_CONFIG.rascunho;
              return (
                <div key={i.id} className={cn('rounded-2xl bg-card border border-border/60 p-4 space-y-3 hover:border-border/80 transition-colors')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{TIPO_EMOJI[i.tipo] || '💡'}</span>
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', sc.bg, sc.color)}>
                          {sc.label}
                        </span>
                        {i.urgencia === 'alta' && <Zap className="w-3 h-3 text-yellow-400" />}
                      </div>
                      <p className="font-medium text-sm text-foreground/85 leading-snug">{i.titulo}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive/50 hover:text-destructive shrink-0" onClick={() => remove.mutate(i.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {i.gancho && (
                    <div className="p-2.5 rounded-xl bg-primary/6 border border-primary/8">
                      <p className="text-[10px] text-muted-foreground/50 mb-0.5">Gancho</p>
                      <p className="text-xs text-foreground/70 italic">"{i.gancho}"</p>
                    </div>
                  )}

                  {i.descricao && <p className="text-[10px] text-muted-foreground/50 leading-relaxed">{i.descricao}</p>}

                  <div className="flex items-center gap-2 flex-wrap">
                    {i.categoria && <span className="text-[9px] bg-secondary/60 text-muted-foreground/60 px-2 py-0.5 rounded-full">{i.categoria}</span>}
                    {i.plataforma && <span className="text-[9px] bg-secondary/60 text-muted-foreground/60 px-2 py-0.5 rounded-full">{i.plataforma}</span>}
                  </div>

                  <Select value={i.status} onValueChange={v => update.mutate({ id: i.id, data: { status: v } })}>
                    <SelectTrigger className="h-7 text-xs w-full">
                      <span className={cn('text-xs', sc.color)}>{sc.label}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
