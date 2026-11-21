export function corsOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);
}
