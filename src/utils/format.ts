/** Formata um valor em centavos para o padrão "R$ 79,90". */
export function formatCentsToBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Formata minutos jogados para algo como "12h 30min" ou "45min". */
export function formatPlaytime(minutes: number): string {
  if (minutes <= 0) return 'Nunca jogado';
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return `${remaining}min jogados`;
  if (remaining === 0) return `${hours}h jogadas`;
  return `${hours}h ${remaining}min jogadas`;
}

/** Formata uma data ISO para o padrão brasileiro (ex.: 12 mar. 2024). */
export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Formata uma data ISO relativa (ex.: "há 3 dias") de forma simples. */
export function formatRelative(iso: string | null): string {
  if (!iso) return 'nunca';
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'agora há pouco';
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `há ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `há ${diffDays}d`;
}
