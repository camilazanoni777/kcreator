import { toast as sonnerToast } from 'sonner'

/**
 * API compatível com o hook antigo do shadcn (toast radix), usando Sonner por baixo.
 */
export function useToast() {
  return {
    toast: ({ title, description, ...options }) => {
      if (title != null && title !== '') {
        sonnerToast(title, { description, ...options })
      } else {
        sonnerToast(description ?? '', options)
      }
    },
  }
}
