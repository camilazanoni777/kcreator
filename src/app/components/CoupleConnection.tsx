'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface CoupleConnectionProps {
    alignmentScore: number
}

export default function CoupleConnection({ alignmentScore }: CoupleConnectionProps) {
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div className="icon-shell icon-shell-accent p-2 rounded-lg">
                    <Heart size={20} className="text-accent-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Conexão</span>
            </div>

            <div className="text-center">
                <p className="text-3xl font-bold text-foreground mb-2">
                    {alignmentScore}%
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                    Nível de alinhamento
                </p>

                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${alignmentScore}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="absolute h-full gradient-accent rounded-full"
                    />
                </div>

                <div className="flex justify-between mt-3">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card" />
                        <div className="w-8 h-8 rounded-full bg-accent/65 border-2 border-card" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                        Check-in há 2 dias
                    </span>
                </div>
            </div>
        </div>
    )
}
