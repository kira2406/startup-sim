export function formatQuarter(quarter: number, short: boolean = false): string {
  const year = Math.ceil(quarter / 4)
  const q = ((quarter - 1) % 4) + 1
  if (short) {
    return `Y${year}Q${q}`
  }
  return `Year ${year} Quarter ${q}`
}