'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

export default function FinanceSummary() {
    const income = 4500
    const expenses = 2800
    const balance = income - expenses

    return (
        <div className="card">
            <h2 className="text-xl font-semibold text-foreground mb-6">
                Resumo Financeiro
            </h2>

            <div className="space-y-4">
                <div className="surface-success flex items-center justify-between rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="icon-shell icon-shell-success p-2 rounded-lg">
                            <TrendingUp size={20} className="text-success" />
                        </div>
                        <span className="text-sm font-medium text-success">Entradas</span>
                    </div>
                    <span className="text-lg font-bold text-success">
                        R$ {income.toLocaleString('pt-BR')}
                    </span>
                </div>

                <div className="surface-danger flex items-center justify-between rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="icon-shell icon-shell-danger p-2 rounded-lg">
                            <TrendingDown size={20} className="text-destructive" />
                        </div>
                        <span className="text-sm font-medium text-destructive">Saídas</span>
                    </div>
                    <span className="text-lg font-bold text-destructive">
                        R$ {expenses.toLocaleString('pt-BR')}
                    </span>
                </div>

                <div className="pt-4 border-t border-border/70">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Saldo</span>
                        <span className={`text-2xl font-bold ${balance >= 0 ? 'text-foreground' : 'text-destructive'
                            }`}>
                            R$ {balance.toLocaleString('pt-BR')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
