export function genId(): string {
  return Math.random().toString(36).substr(2, 9);
}
