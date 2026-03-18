import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: number;
  role: 'admin' | 'buyer' | 'seller' | 'guest';
  email: string;
}

export function signToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET as string, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
