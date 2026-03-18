export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createError(code: string, message?: string): AppError {
  const errorMap: Record<string, { message: string; statusCode: number }> = {
    NOT_FOUND: { message: message || 'Ressource non trouvée', statusCode: 404 },
    VALIDATION_ERROR: { message: message || 'Erreur de validation', statusCode: 400 },
    INTERNAL_ERROR: { message: message || 'Erreur interne du serveur', statusCode: 500 },
    UNAUTHORIZED: { message: message || 'Non autorisé', statusCode: 401 },
    FORBIDDEN: { message: message || 'Accès refusé', statusCode: 403 },
    INSUFFICIENT_STOCK: { message: message || 'Stock insuffisant', statusCode: 400 },
    ORDER_CREATION_FAILED: { message: message || 'Échec de la création de la commande', statusCode: 500 },
    RATE_LIMIT_EXCEEDED: { message: message || 'Trop de tentatives, réessayez plus tard', statusCode: 429 },
    USER_ALREADY_EXISTS: { message: message || 'Cet email est déjà utilisé', statusCode: 409 },
    INVALID_CREDENTIALS: { message: message || 'Email ou mot de passe incorrect', statusCode: 401 },
  };

  const error = errorMap[code] || { message: message || 'Erreur inconnue', statusCode: 500 };
  return new AppError(code, error.message, error.statusCode);
}
