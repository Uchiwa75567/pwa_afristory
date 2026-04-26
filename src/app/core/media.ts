export function avatarUrl(seed: string): string {
  return '/assets/avatar-user.svg';
}

export function coverUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed || 'afristory')}/640/640`;
}
