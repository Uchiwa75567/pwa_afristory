const numberFormatter = new Intl.NumberFormat('fr-FR');

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatFcfa(points: number): string {
  return `${formatNumber(points * 5)} FCFA`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
