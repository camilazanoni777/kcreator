import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
    title: 'Lumina - Productivity & Wellness OS',
    description: 'Organização, bem-estar, finanças e creator studio em uma experiência premium.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
            <body className="bg-background font-sans antialiased text-foreground transition-colors duration-300">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster richColors closeButton position="top-center" />
                </ThemeProvider>
            </body>
        </html>
    )
}
