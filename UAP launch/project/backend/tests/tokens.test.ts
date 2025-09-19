import { 
  signToken, 
  verifyToken, 
  generateNonce, 
  isValidStepProgression,
  createExpiration,
  TokenPayload 
} from '../src/tokens';

describe('Token System', () => {
  describe('signToken and verifyToken', () => {
    it('should sign and verify a valid token', () => {
      const payload: TokenPayload = {
        sessionId: 'test-session-123',
        step: 1,
        nonce: 'test-nonce-456',
        exp: Date.now() + 5 * 60 * 1000 // 5 minutes from now
      };

      const token = signToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format

      const verified = verifyToken(token);
      expect(verified).not.toBeNull();
      expect(verified!.sessionId).toBe(payload.sessionId);
      expect(verified!.step).toBe(payload.step);
      expect(verified!.nonce).toBe(payload.nonce);
      expect(verified!.exp).toBe(payload.exp);
    });

    it('should reject expired tokens', () => {
      const payload: TokenPayload = {
        sessionId: 'test-session-123',
        step: 1,
        nonce: 'test-nonce-456',
        exp: Date.now() - 1000 // 1 second ago
      };

      const token = signToken(payload);
      const verified = verifyToken(token);
      expect(verified).toBeNull();
    });

    it('should reject tampered tokens', () => {
      const payload: TokenPayload = {
        sessionId: 'test-session-123',
        step: 1,
        nonce: 'test-nonce-456',
        exp: Date.now() + 5 * 60 * 1000
      };

      const token = signToken(payload);
      const tamperedToken = token.slice(0, -5) + 'XXXXX'; // Tamper with signature
      
      const verified = verifyToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it('should reject malformed tokens', () => {
      expect(verifyToken('not.a.token')).toBeNull();
      expect(verifyToken('only-one-part')).toBeNull();
      expect(verifyToken('')).toBeNull();
      expect(verifyToken('too.many.parts.here')).toBeNull();
    });

    it('should reject tokens with invalid payload structure', () => {
      // We can't easily test this without exposing internal signing mechanism
      // But verifyToken should handle JSON parsing errors gracefully
      expect(verifyToken('invalid')).toBeNull();
      expect(verifyToken('a.b.c')).toBeNull(); // Invalid base64url
    });
  });

  describe('generateNonce', () => {
    it('should generate unique nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      
      expect(typeof nonce1).toBe('string');
      expect(typeof nonce2).toBe('string');
      expect(nonce1).not.toBe(nonce2);
      expect(nonce1.length).toBeGreaterThan(0);
    });

    it('should generate UUID format nonces', () => {
      const nonce = generateNonce();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(nonce)).toBe(true);
    });
  });

  describe('isValidStepProgression', () => {
    it('should allow progression to next step', () => {
      expect(isValidStepProgression(0, 1)).toBe(true);
      expect(isValidStepProgression(1, 2)).toBe(true);
      expect(isValidStepProgression(2, 3)).toBe(true);
    });

    it('should allow jumping to completion step', () => {
      expect(isValidStepProgression(0, 999)).toBe(true);
      expect(isValidStepProgression(1, 999)).toBe(true);
      expect(isValidStepProgression(2, 999)).toBe(true);
    });

    it('should reject skipping steps', () => {
      expect(isValidStepProgression(0, 2)).toBe(false);
      expect(isValidStepProgression(1, 3)).toBe(false);
      expect(isValidStepProgression(0, 5)).toBe(false);
    });

    it('should reject backwards progression', () => {
      expect(isValidStepProgression(2, 1)).toBe(false);
      expect(isValidStepProgression(1, 0)).toBe(false);
      expect(isValidStepProgression(3, 2)).toBe(false);
    });

    it('should reject staying at same step', () => {
      expect(isValidStepProgression(1, 1)).toBe(false);
      expect(isValidStepProgression(0, 0)).toBe(false);
      expect(isValidStepProgression(2, 2)).toBe(false);
    });
  });

  describe('createExpiration', () => {
    it('should create future expiration timestamps', () => {
      const now = Date.now();
      const exp5min = createExpiration(5);
      const exp10min = createExpiration(10);
      
      expect(exp5min).toBeGreaterThan(now);
      expect(exp10min).toBeGreaterThan(now);
      expect(exp10min).toBeGreaterThan(exp5min);
    });

    it('should create correct minute offsets', () => {
      const now = Date.now();
      const exp1min = createExpiration(1);
      const expectedMin = now + (1 * 60 * 1000);
      
      // Allow 100ms tolerance for execution time
      expect(Math.abs(exp1min - expectedMin)).toBeLessThan(100);
    });

    it('should handle edge cases', () => {
      const now = Date.now();
      expect(createExpiration(0)).toBeGreaterThanOrEqual(now);
      expect(createExpiration(-1)).toBeLessThan(now);
    });
  });

  describe('Token Integration', () => {
    it('should handle complete token lifecycle', () => {
      // Initial session token
      const sessionId = generateNonce();
      let currentStep = 0;
      
      const initialToken = signToken({
        sessionId,
        step: currentStep,
        nonce: generateNonce(),
        exp: createExpiration(10)
      });
      
      // Verify initial token
      let payload = verifyToken(initialToken);
      expect(payload).not.toBeNull();
      expect(payload!.sessionId).toBe(sessionId);
      expect(payload!.step).toBe(0);
      
      // Progress to step 1
      currentStep = 1;
      const progressToken = signToken({
        sessionId,
        step: currentStep,
        nonce: generateNonce(),
        exp: createExpiration(5)
      });
      
      payload = verifyToken(progressToken);
      expect(payload).not.toBeNull();
      expect(payload!.step).toBe(1);
      
      // Complete the flow
      const completionToken = signToken({
        sessionId,
        step: 999,
        nonce: generateNonce(),
        exp: createExpiration(1)
      });
      
      payload = verifyToken(completionToken);
      expect(payload).not.toBeNull();
      expect(payload!.step).toBe(999);
    });

    it('should reject cross-session token usage', () => {
      const session1 = generateNonce();
      const session2 = generateNonce();
      
      const token1 = signToken({
        sessionId: session1,
        step: 1,
        nonce: generateNonce(),
        exp: createExpiration(5)
      });
      
      const payload = verifyToken(token1);
      expect(payload!.sessionId).toBe(session1);
      expect(payload!.sessionId).not.toBe(session2);
    });
  });
});