import { SaaSProviders } from '@/components/saas/SaaSProviders'

export default function SaasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SaaSProviders>{children}</SaaSProviders>
}
