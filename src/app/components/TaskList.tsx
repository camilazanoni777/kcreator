'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'

const initialTasks = [
    { id: 1, title: 'Reunião com equipe', priority: 'high', completed: false, time: '09:00' },
    { id: 2, title: 'Enviar relatório financeiro', priority: 'medium', completed: false, time: '11:00' },
    { id: 3, title: 'Academia', priority: 'low', completed: true, time: '18:00' },
    { id: 4, title: 'Ligar para mãe', priority: 'medium', completed: false, time: '20:00' },
]

export default function TaskList() {
    const [tasks, setTasks] = useState(initialTasks)

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertCircle size={16} className="text-red-500" />
            case 'medium': return <Clock size={16} className="text-orange-500" />
            default: return <Clock size={16} className="text-charcoal-400" />
        }
    }

    return (
        <div className="space-y-3">
            {tasks.map((task, index) => (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${task.completed
                            ? 'bg-charcoal-50 opacity-60'
                            : 'bg-white border border-charcoal-100 hover:border-primary-200'
                        }`}
                >
                    <div className="flex-shrink-0">
                        {task.completed ? (
                            <CheckCircle size={20} className="text-emerald-500" />
                        ) : (
                            <Circle size={20} className="text-charcoal-300" />
                        )}
                    </div>

                    <div className="flex-1">
                        <p className={`font-medium ${task.completed ? 'line-through text-charcoal-400' : 'text-charcoal-800'
                            }`}>
                            {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            {getPriorityIcon(task.priority)}
                            <span className="text-xs text-charcoal-500">{task.time}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}