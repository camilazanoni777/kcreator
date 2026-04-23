'use client'

import { motion } from 'framer-motion'
import { Smile } from 'lucide-react'

interface MoodCardProps {
    score: number
}

export default function MoodCard({ score }: MoodCardProps) {
    const getMoodInfo = (score: number) => {
        if (score >= 9) return { emoji: '🌟', label: 'Excelente', labelClass: 'text-success' }
        if (score >= 7) return { emoji: '😊', label: 'Bom', labelClass: 'text-success' }
        if (score >= 5) return { emoji: '😐', label: 'Neutro', labelClass: 'text-warning' }
        if (score >= 3) return { emoji: '😔', label: 'Baixo', labelClass: 'text-warning' }
        return { emoji: '😢', label: 'Ruim', labelClass: 'text-destructive' }
    }

    const info = getMoodInfo(score)

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="card"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="icon-shell icon-shell-primary p-2 rounded-lg">
                    <Smile size={20} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Humor de hoje</span>
            </div>

            <div className="flex items-center gap-4">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-5xl"
                >
                    {info.emoji}
                </motion.span>

                <div>
                    <p className="text-3xl font-bold text-foreground">{score}/10</p>
                    <p className={`text-sm font-medium ${info.labelClass}`}>
                        {info.label}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
