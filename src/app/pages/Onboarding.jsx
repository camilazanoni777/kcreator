'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, ArrowRight, Sparkles, Users, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlan } from '@/lib/PlanContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

const STEP_PLAN = 0;
const STEP_NAME = 1;
const STEP_PARTNER = 2;
const STEP_DONE = 3;

export default function Onboarding() {
  const { completeOnboarding } = usePlan();
  const [step, setStep] = useState(STEP_PLAN);
  const [plano, setPlano] = useState(null);
  const [nome, setNome] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');

  const handleSelectPlan = (p) => {
    setPlano(p);
    setStep(STEP_NAME);
  };

  const handleNameNext = () => {
    if (!nome.trim()) return;
    if (plano === 'casal') setStep(STEP_PARTNER);
    else setStep(STEP_DONE);
  };

  const handleFinish = () => {
    completeOnboarding({
      plano,
      nome,
      partner_name: partnerName || undefined,
      partner_email: partnerEmail || undefined,
    });
  };

  const fade = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.35 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="fixed right-4 top-4 z-40">
        <ThemeToggle compact />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
          <Heart className="w-4.5 h-4.5 text-primary fill-primary/50" />
        </div>
        <div>
          <p className="font-cormorant text-base font-semibold leading-none">Duetto</p>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">planner de vida</p>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 0 — Escolha do plano */}
        {step === STEP_PLAN && (
          <motion.div key="step-plan" {...fade} className="w-full max-w-xl">
            <h1 className="font-cormorant text-3xl font-semibold text-center mb-2">
              Como você quer usar?
            </h1>
            <p className="text-muted-foreground text-center text-sm mb-10">
              Você pode organizar sua vida sozinho(a) ou junto de quem você ama. Escolha agora — e mude depois, quando quiser.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Individual */}
              <button
                onClick={() => handleSelectPlan('individual')}
                className="group text-left rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 p-6 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-semibold text-base mb-1">Meu Planner</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Organize sua rotina, tarefas, hábitos, finanças e evolução pessoal. Só seu, no seu ritmo.
                </p>
                <ul className="space-y-1.5">
                  {['Rotina e tarefas', 'Hábitos e metas', 'Finanças pessoais', 'Check-in emocional', 'Evolução pessoal'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-primary">
                  Começar sozinho(a) <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Casal */}
              <button
                onClick={() => handleSelectPlan('casal')}
                className="group text-left rounded-2xl border border-border/60 bg-card hover:border-accent/40 hover:bg-accent/5 p-6 transition-all duration-200 relative"
              >
                <div className="absolute top-4 right-4 bg-accent/15 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Popular
                </div>
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Heart className="w-5 h-5 text-accent fill-accent/40" />
                </div>
                <h2 className="font-semibold text-base mb-1">Nosso Planner</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Um espaço a dois para rotina, metas, financeiro e conexão. Construção conjunta com afeto.
                </p>
                <ul className="space-y-1.5">
                  {['Tarefas compartilhadas', 'Metas do casal', 'Financeiro conjunto', 'Agenda a dois', 'Alinhamento do casal'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-accent">
                  Começar em casal <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground/50 mt-8">
              Você pode mudar seu plano a qualquer momento nas configurações.
            </p>
          </motion.div>
        )}

        {/* STEP 1 — Nome */}
        {step === STEP_NAME && (
          <motion.div key="step-name" {...fade} className="w-full max-w-sm text-center">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6",
              plano === 'casal' ? 'bg-accent/15' : 'bg-primary/15'
            )}>
              {plano === 'casal'
                ? <Heart className="w-6 h-6 text-accent" />
                : <User className="w-6 h-6 text-primary" />
              }
            </div>
            <h1 className="font-cormorant text-2xl font-semibold mb-2">Como você se chama?</h1>
            <p className="text-muted-foreground text-sm mb-8">
              {plano === 'casal'
                ? 'Vamos personalizar o espaço com o seu nome.'
                : 'Vamos tornar esse planner seu de verdade.'}
            </p>
            <Input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              className="text-center text-base h-12 mb-4"
              onKeyDown={e => e.key === 'Enter' && handleNameNext()}
              autoFocus
            />
            <Button
              onClick={handleNameNext}
              disabled={!nome.trim()}
              className={cn("w-full h-11", plano === 'casal' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : '')}
            >
              Continuar <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <button onClick={() => setStep(STEP_PLAN)} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Voltar
            </button>
          </motion.div>
        )}

        {/* STEP 2 — Parceiro (só casal) */}
        {step === STEP_PARTNER && (
          <motion.div key="step-partner" {...fade} className="w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h1 className="font-cormorant text-2xl font-semibold mb-2">Quem é seu parceiro(a)?</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Adicione o nome agora. Você pode convidar por email depois nas configurações.
            </p>
            <div className="space-y-3 mb-6 text-left">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Nome do(a) parceiro(a)</label>
                <Input
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  placeholder="Ex: Camila"
                  className="h-11"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Email (opcional)</label>
                <Input
                  value={partnerEmail}
                  onChange={e => setPartnerEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  type="email"
                  className="h-11"
                />
              </div>
            </div>
            <Button
              onClick={() => setStep(STEP_DONE)}
              className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Continuar <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <button onClick={() => setStep(STEP_NAME)} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Voltar
            </button>
          </motion.div>
        )}

        {/* STEP 3 — Pronto */}
        {step === STEP_DONE && (
          <motion.div key="step-done" {...fade} className="w-full max-w-sm text-center">
            <div className="text-5xl mb-6">
              {plano === 'casal' ? '🤍' : '✨'}
            </div>
            <h1 className="font-cormorant text-2xl font-semibold mb-3">
              {plano === 'casal'
                ? `${nome} & ${partnerName || 'parceiro(a)'}, bem-vindos!`
                : `Bem-vindo(a), ${nome}!`}
            </h1>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              {plano === 'casal'
                ? 'Seu espaço a dois está pronto. Rotina, metas e conexão — tudo em um lugar.'
                : 'Seu planner pessoal está pronto. Organize sua vida com leveza e constância.'}
            </p>
            <Button
              onClick={handleFinish}
              className={cn("w-full h-12 text-base font-semibold", plano === 'casal' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : '')}
            >
              Entrar no {plano === 'casal' ? 'Nosso' : 'Meu'} Planner
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Step dots */}
      <div className="flex gap-2 mt-12">
        {[0, 1, plano === 'casal' ? 2 : null, plano === 'casal' ? 3 : 2].filter(s => s !== null).map((s, i) => (
          <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", step === s ? 'bg-primary w-4' : 'bg-muted')} />
        ))}
      </div>
    </div>
  );
}
