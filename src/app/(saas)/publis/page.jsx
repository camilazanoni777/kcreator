import PageHeader from '@/components/shared/PageHeader'
import BentoCard from '@/components/shared/BentoCard'
import { Handshake } from 'lucide-react'

export default function PublisPage() {
  return (
    <div>
      <PageHeader
        title="Publis"
        subtitle="Parcerias e entregas — módulo em construção"
      />
      <div className="px-4 sm:px-8 pb-8">
        <BentoCard title="Em breve" icon={Handshake}>
          <p className="text-sm text-muted-foreground">
            Esta área será liberada em uma próxima versão. Enquanto isso, use o
            Estúdio e o Banco de Ideias.
          </p>
        </BentoCard>
      </div>
    </div>
  )
}
