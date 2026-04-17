'use client'

import React, { useState } from 'react';
import PageHeader from '../components/shared/PageHeader';
import { usePlan } from '../lib/PlanContext';
import { Heart, User, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export default function Configuracoes() {
  const { profile, nome, partnerName, plano: _plano, updateProfile, setPlano, isIndividual, isCasal } = usePlan();
  const { toast } = useToast();

  const [editNome, setEditNome] = useState(nome || '');
  const [editPartner, setEditPartner] = useState(partnerName || '');
  const [editPartnerEmail, setEditPartnerEmail] = useState(profile?.partner_email || '');
  const [confirmando, setConfirmando] = useState(null);

  const handleSave = () => {
    updateProfile({ nome: editNome, partner_name: editPartner, partner_email: editPartnerEmail });
    toast({ title: 'Salvo!', description: 'Suas informações foram atualizadas.' });
  };

  const handleChangePlan = (novoPlan) => {
    setPlano(novoPlan);
    setConfirmando(null);
    toast({
      title: novoPlan === 'casal' ? 'Bem-vindos, casal! 🤍' : 'Modo Individual ativado ✨',
      description: novoPlan === 'casal'
        ? 'Seu espaço a dois está ativo. Adicione o nome do parceiro abaixo.'
        : 'Seu planner pessoal está ativo.',
    });
  };

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Personalize sua experiência na plataforma" />
      <div className="px-4 sm:px-8 pb-8 space-y-5 max-w-2xl">

        {/* Plano atual */}
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Plano Atual</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Individual */}
            <button
              onClick={() => isIndividual ? null : setConfirmando('individual')}
              className={cn(
                "relative text-left rounded-xl border p-4 transition-all",
                isIndividual
                  ? "border-primary/40 bg-primary/8"
                  : "border-border/40 hover:border-primary/20 hover:bg-primary/4"
              )}
            >
              {isIndividual && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
                <User className="w-4.5 h-4.5 text-primary" />
              </div>
              <p className="text-sm font-semibold mb-1">Meu Planner</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Rotina, hábitos, finanças e evolução pessoal.</p>
            </button>

            {/* Casal */}
            <button
              onClick={() => isCasal ? null : setConfirmando('casal')}
              className={cn(
                "relative text-left rounded-xl border p-4 transition-all",
                isCasal
                  ? "border-accent/40 bg-accent/8"
                  : "border-border/40 hover:border-accent/20 hover:bg-accent/4"
              )}
            >
              <div className="absolute top-3 right-3 bg-accent/15 text-accent text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2 h-2" /> Popular
              </div>
              {isCasal && (
                <div className="absolute top-3 right-14 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-3 h-3 text-accent-foreground" />
                </div>
              )}
              <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center mb-3">
                <Heart className="w-4.5 h-4.5 text-accent fill-accent/40" />
              </div>
              <p className="text-sm font-semibold mb-1">Nosso Planner</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Rotina a dois, financeiro e metas juntos.</p>
            </button>
          </div>

          {/* Confirmação de troca de plano */}
          {confirmando && (
            <div className="mt-4 p-3.5 rounded-xl bg-secondary/50 border border-border/40">
              <p className="text-xs font-medium mb-2.5">
                Trocar para o plano <strong>{confirmando === 'casal' ? 'Nosso Planner' : 'Meu Planner'}</strong>?
                <br />
                <span className="text-muted-foreground font-normal">Seus dados são preservados. Você pode trocar quando quiser.</span>
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleChangePlan(confirmando)} className="h-8 text-xs">
                  Confirmar troca <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmando(null)} className="h-8 text-xs">Cancelar</Button>
              </div>
            </div>
          )}
        </div>

        {/* Dados pessoais */}
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Seus Dados</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Seu nome</Label>
              <Input value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Como você quer ser chamado(a)?" className="mt-1.5" />
            </div>

            {isCasal && (
              <>
                <div>
                  <Label className="text-xs">Nome do(a) parceiro(a)</Label>
                  <Input value={editPartner} onChange={e => setEditPartner(e.target.value)} placeholder="Nome do seu parceiro(a)" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs">Email do(a) parceiro(a) <span className="text-muted-foreground">(opcional)</span></Label>
                  <Input value={editPartnerEmail} onChange={e => setEditPartnerEmail(e.target.value)} placeholder="email@exemplo.com" type="email" className="mt-1.5" />
                </div>
              </>
            )}

            <Button onClick={handleSave} className="w-full">Salvar alterações</Button>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-border/30 bg-secondary/20 p-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isIndividual
              ? '🌱 Você está no Meu Planner. Quando quiser evoluir para o Nosso Planner e compartilhar com seu parceiro(a), basta trocar o plano acima — seus dados são mantidos.'
              : '🤍 Você está no Nosso Planner. Se quiser ter um espaço individual separado no futuro, troque o plano acima. Seus dados são sempre preservados.'}
          </p>
        </div>

      </div>
    </div>
  );
}
