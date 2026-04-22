'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

export default function FinanceSummary() {
    const income = 4500
    const expenses = 2800
    const balance = income - expenses

    return (
        <div className="card">
            <h2 className="text-xl font-semibold text-charcoal-800 mb-6">
                Resumo Financeiro
            </h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100">
                            <TrendingUp size={20} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-emerald-800">Entradas</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-700">
                        R$ {income.toLocaleString('pt-BR')}
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100">
                            <TrendingDown size={20} className="text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-red-800">Saídas</span>
                    </div>
                    <span className="text-lg font-bold text-red-700">
                        R$ {expenses.toLocaleString('pt-BR')}
                    </span>
                </div>

                <div className="pt-4 border-t border-charcoal-100">
                    <div className="flex items-center justify-between">
                        <span className="text-charcoal-600 font-medium">Saldo</span>
                        <span className={`text-2xl font-bold ${balance >= 0 ? 'text-charcoal-800' : 'text-red-600'
                            }`}>
                            R$ {balance.toLocaleString('pt-BR')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}