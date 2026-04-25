export function avatarUrl(seed: string): string {
  return `https://i.pravatar.cc/320?u=${encodeURIComponent(seed || 'afristory')}`;
}

export function coverUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed || 'afristory')}/640/640`;
}
