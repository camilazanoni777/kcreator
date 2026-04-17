import PageHeader from '@/components/shared/PageHeader'
import BentoCard from '@/components/shared/BentoCard'
import { Sparkles } from 'lucide-react'

export default function MarcasPage() {
  return (
    <div>
      <PageHeader
        title="Marcas"
        subtitle="Gestão de marcas e briefings — módulo em construção"
      />
      <div className="px-4 sm:px-8 pb-8">
        <BentoCard title="Em breve" icon={Sparkles}>
          <p className="text-sm text-muted-foreground">
            Você poderá cadastrar marcas e acompanhar campanhas aqui em breve.
          </p>
        </BentoCard>
      </div>
    </div>
  )
}
