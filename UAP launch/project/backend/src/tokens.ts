import crypto from 'crypto';
import { logger } from './utils/logger';

const HMAC_SECRET = process.env.HMAC_SECRET || (() => {
  logger.warn('Using default HMAC_SECRET - change this in production!');
  return 'dev-secret-key-change-in-production';
})();

export interface TokenPayload {
  sessionId: string;
  step: number;
  nonce: string;
  exp: number;
  iat?: number;
}

/**
 * Signs a token payload using HMAC-SHA256
 */
export function signToken(payload: TokenPayload): string {
  try {
    // Add issued at timestamp
    const fullPayload = {
      ...payload,
      iat: Date.now()
    };

    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    ).toString('base64url');
    
    const body = Buffer.from(
      JSON.stringify(fullPayload)
    ).toString('base64url');
    
    const data = `${header}.${body}`;
    const signature = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(data)
      .digest('base64url');
    
    return `${data}.${signature}`;
  } catch (error) {
    logger.error('Token signing failed', { error });
    throw new Error('Token signing failed');
  }
}

/**
 * Verifies and decodes a token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [header, body, signature] = parts;
    
    // Verify signature
    const data = `${header}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(data)
      .digest('base64url');
    
    if (expectedSignature !== signature) {
      logger.warn('Invalid token signature');
      return null;
    }
    
    // Decode and validate payload
    const payload: TokenPayload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8')
    );
    
    // Check expiration
    if (Date.now() > payload.exp) {
      logger.info('Token expired', { 
        sessionId: payload.sessionId,
        exp: new Date(payload.exp).toISOString()
      });
      return null;
    }
    
    // Validate required fields
    if (!payload.sessionId || typeof payload.step !== 'number' || !payload.nonce) {
      logger.warn('Invalid token payload structure');
      return null;
    }
    
    return payload;
  } catch (error) {
    logger.warn('Token verification failed', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}

/**
 * Generates a secure random nonce
 */
export function generateNonce(): string {
  return crypto.randomUUID();
}

/**
 * Validates step progression (prevents skipping)
 */
export function isValidStepProgression(currentStep: number, nextStep: number): boolean {
  // Allow progression to next step or completion
  const validNextSteps = [currentStep + 1, 999]; // 999 is completion step
  return validNextSteps.includes(nextStep);
}

/**
 * Creates session expiration timestamp
 */
export function createExpiration(minutes: number): number {
  return Date.now() + (minutes * 60 * 1000);
}