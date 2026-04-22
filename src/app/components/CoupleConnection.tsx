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
                <div className="p-2 rounded-lg bg-rose-100">
                    <Heart size={20} className="text-rose-600" />
                </div>
                <span className="text-sm text-charcoal-500">Conexão</span>
            </div>

            <div className="text-center">
                <p className="text-3xl font-bold text-charcoal-800 mb-2">
                    {alignmentScore}%
                </p>
                <p className="text-sm text-charcoal-500 mb-4">
                    Nível de alinhamento
                </p>

                <div className="relative h-2 bg-charcoal-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${alignmentScore}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="absolute h-full gradient-accent rounded-full"
                    />
                </div>

                <div className="flex justify-between mt-3">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white" />
                        <div className="w-8 h-8 rounded-full bg-lavender-200 border-2 border-white" />
                    </div>
                    <span className="text-xs text-charcoal-500">
                        Check-in há 2 dias
                    </span>
                </div>
            </div>
        </div>
    )
}