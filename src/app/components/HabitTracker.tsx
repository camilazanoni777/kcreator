'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Flame } from 'lucide-react'

const habits = [
    { id: 1, title: 'Meditação', streak: 12, completedToday: true },
    { id: 2, title: 'Leitura', streak: 5, completedToday: false },
    { id: 3, title: 'Exercício', streak: 8, completedToday: true },
    { id: 4, title: 'Journaling', streak: 3, completedToday: false },
]

export default function HabitTracker() {
    const [habitState, setHabitState] = useState(habits)

    const toggleHabit = (id: number) => {
        setHabitState(habitState.map(habit =>
            habit.id === id
                ? { ...habit, completedToday: !habit.completedToday }
                : habit
        ))
    }

    return (
        <div className="space-y-4">
            {habitState.map((habit, index) => (
                <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => toggleHabit(habit.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${habit.completedToday
                                    ? 'gradient-accent text-white'
                                    : 'bg-charcoal-100 text-charcoal-400 hover:bg-charcoal-200'
                                }`}
                        >
                            <Check size={16} strokeWidth={3} />
                        </button>
                        <span className={`font-medium ${habit.completedToday ? 'text-charcoal-800' : 'text-charcoal-600'
                            }`}>
                            {habit.title}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-orange-500">
                        <Flame size={14} />
                        <span className="text-sm font-medium">{habit.streak}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}