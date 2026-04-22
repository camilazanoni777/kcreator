export const PRIORITY_ORDER = {
  urgente: 0,
  alta: 1,
  media: 2,
  baixa: 3,
}

export function greetingFor(date) {
  const hour = date.getHours()

  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'

  return 'Boa noite'
}

export function getUsagePercentage(total, used) {
  if (!total) return 0

  return Math.min(Math.round((used / total) * 100), 100)
}
