// Simple in-memory rate limiting (pour production, utiliser Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxRequests?: number;
  windowMs?: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const maxRequests = config.maxRequests || 100;
  const windowMs = config.windowMs || 15 * 60 * 1000; // 15 minutes par défaut

  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Nettoyer les anciennes entrées (éviter fuite mémoire)
  if (rateLimitMap.size > 10000) {
    const cutoff = now - windowMs;
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < cutoff) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

export function getRateLimitIdentifier(request: Request): string {
  // Essayer d'obtenir l'IP réelle (derrière proxy)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}
