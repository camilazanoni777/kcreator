'use client'

import { Smile, Trash2 } from 'lucide-react';
import { useState } from 'react';
import BentoCard from '@/components/shared/BentoCard';
import PageHeader from '@/components/shared/PageHeader';
import { useEntityList, useEntityMutations } from '@/lib/hooks/useEntities';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const HUMORES = [
  { value: 'otimo', label: 'Ótimo', emoji: '😄', color: 'border-green-400/40 bg-green-400/8 text-green-400' },
  { value: 'bom', label: 'Bom', emoji: '🙂', color: 'border-primary/40 bg-primary/8 text-primary' },
  { value: 'neutro', label: 'Neutro', emoji: '😐', color: 'border-muted-foreground/30 bg-secondary text-muted-foreground' },
  { value: 'cansado', label: 'Cansado', emoji: '😴', color: 'border-accent/40 bg-accent/8 text-accent' },
  { value: 'ruim', label: 'Ruim', emoji: '😔', color: 'border-destructive/40 bg-destructive/8 text-destructive' },
];

const ENERGIA_LABELS = { 1: '😩', 2: '😩', 3: '😔', 4: '😕', 5: '😐', 6: '🙂', 7: '😊', 8: '😄', 9: '🤩', 10: '⚡' };

export default function CheckIn() {
  const { data: checkins } = useEntityList('CheckIn');
  const { create, remove } = useEntityMutations('CheckIn');
  const [humor, setHumor] = useState('');
  const [energia, setEnergia] = useState(7);
  const [nota, setNota] = useState('');

  const hoje = new Date().toISOString().split('T')[0];
  const checkinHoje = checkins.find(c => c.data === hoje);

  const handleSubmit = () => {
    if (!humor) return;
    create.mutate({ data: hoje, humor, energia, nota, modo: 'individual' });
    setHumor('');
    setNota('');
    setEnergia(7);
  };

  const checkinsOrdenados = [...checkins].sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <div>
      <PageHeader title="Check-in Emocional" subtitle="Como você está? Registre seu estado com honestidade" italic />
      <div className="px-4 sm:px-8 pb-8 space-y-5">

        {/* Form de hoje */}
        {!checkinHoje ? (
          <BentoCard title="Check-in de Hoje" icon={Smile}>
            <div className="space-y-5">
              {/* Humor */}
              <div>
                <Label className="text-xs mb-3 block">Como você está se sentindo hoje?</Label>
                <div className="flex gap-2 flex-wrap">
                  {HUMORES.map(h => (
                    <button
                      key={h.value}
                      onClick={() => setHumor(h.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-4 py-3 rounded-xl border text-xs font-medium transition-all",
                        humor === h.value ? h.color : "border-border/60 bg-card hover:bg-secondary/50 text-muted-foreground"
                      )}
                    >
                      <span className="text-xl">{h.emoji}</span>
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energia */}
              <div>
                <Label className="text-xs mb-3 block">Nível de energia (1-10)</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min="1" max="10" value={energia}
                    onChange={e => setEnergia(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <div className="w-12 text-center">
                    <span className="text-xl">{ENERGIA_LABELS[energia]}</span>
                    <p className="text-xs font-semibold text-primary">{energia}/10</p>
                  </div>
                </div>
              </div>

              {/* Nota */}
              <div>
                <Label className="text-xs mb-1.5 block">Anotação livre (opcional)</Label>
                <Textarea
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                  placeholder="Como foi o dia? O que está pesando? O que alegrou você?"
                  className="resize-none h-24 text-sm"
                />
              </div>

              <Button onClick={handleSubmit} disabled={!humor} className="w-full h-11 font-medium">
                Registrar Check-in
              </Button>
            </div>
          </BentoCard>
        ) : (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{HUMORES.find(h => h.value === checkinHoje.humor)?.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">Check-in feito hoje ✅</p>
                  <p className="text-xs text-muted-foreground">Humor: {HUMORES.find(h => h.value === checkinHoje.humor)?.label} · Energia: {checkinHoje.energia}/10</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove.mutate(checkinHoje.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            {checkinHoje.nota && (
              <p className="text-xs text-foreground/70 italic mt-3 border-t border-border/30 pt-3">"{checkinHoje.nota}"</p>
            )}
          </div>
        )}

        {/* Histórico */}
        <BentoCard title="Histórico Emocional" icon={Smile}>
          {checkinsOrdenados.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-3xl mb-2">🌿</p>
              <p className="text-sm text-muted-foreground">Nenhum check-in registrado ainda.</p>
              <p className="text-xs text-muted-foreground mt-1">Comece hoje — consciência é o primeiro passo.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {checkinsOrdenados.slice(0, 20).map(c => {
                const h = HUMORES.find(hm => hm.value === c.humor);
                return (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <span className="text-lg">{h?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium capitalize">{format(new Date(c.data + 'T12:00:00'), "EEE, d 'de' MMM", { locale: ptBR })}</p>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", h?.color || '')}>{h?.label}</span>
                      </div>
                      {c.nota && <p className="text-[10px] text-muted-foreground truncate mt-0.5">"{c.nota}"</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono text-muted-foreground">{c.energia}/10</p>
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
