import type { Promotion } from '../types'

type Window = Pick<Promotion, 'startsAt' | 'endsAt'>

export function promotionIsActive(p: Window, now: number) {
  const starts = p.startsAt === null ? null : Date.parse(p.startsAt)
  const ends = p.endsAt === null ? null : Date.parse(p.endsAt)
  return (starts === null || (Number.isFinite(starts) && now >= starts)) &&
    (ends === null || (Number.isFinite(ends) && now <= ends))
}

// No timer or substitute date for an absent boundary. Endpoints are inclusive.
export function promotionBoundaries(p: Window): number[] {
  return [
    ...(p.startsAt === null ? [] : [Date.parse(p.startsAt)]),
    ...(p.endsAt === null ? [] : [Date.parse(p.endsAt) + 1]),
  ].filter(Number.isFinite)
}

export function promotionDate(value: string | null): string | undefined {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return undefined
  return new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Costa_Rica' }).format(new Date(value))
}
