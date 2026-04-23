'use client'

import type { LucideIcon } from 'lucide-react'
import {
    LayoutDashboard, CheckSquare, Target, Repeat,
    DollarSign, Heart, Settings, LogOut, X
} from 'lucide-react'

export type AppView = 'dashboard' | 'tasks' | 'habits' | 'goals' | 'finance' | 'couple'

interface SidebarProps {
    currentView: AppView
    onViewChange: (view: AppView) => void
    isOpen: boolean
    onClose: () => void
}

const menuItems: { id: AppView; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'habits', label: 'Hábitos', icon: Repeat },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'finance', label: 'Finanças', icon: DollarSign },
    { id: 'couple', label: 'Conexão', icon: Heart },
]

export default function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-foreground/35 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar: CSS transform on small screens only; lg: always visible (framer x would hide the bar on desktop when isOpen is false) */}
            <aside
                className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-card transition-transform duration-300 ease-out lg:static lg:z-auto lg:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 h-full flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                                <span className="text-white font-bold text-xl">L</span>
                            </div>
                            <span className="font-serif text-xl font-bold text-foreground">
                                Lumina
                            </span>
                        </div>
                        <button onClick={onClose} className="lg:hidden rounded-lg p-2 hover:bg-secondary">
                            <X size={20} className="text-muted-foreground" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = currentView === item.id

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onViewChange(item.id)
                                        onClose()
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'gradient-accent text-white shadow-lg shadow-primary-500/25'
                                            : 'text-muted-foreground hover:bg-secondary'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            )
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="space-y-2 pt-6 border-t border-border">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
                            <Settings size={20} />
                            <span className="font-medium">Configurações</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut size={20} />
                            <span className="font-medium">Sair</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
