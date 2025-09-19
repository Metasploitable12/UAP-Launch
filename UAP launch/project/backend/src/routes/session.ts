import { Router, Request, Response } from 'express';
import { 
  signToken, 
  verifyToken, 
  generateNonce, 
  isValidStepProgression,
  createExpiration,
  TokenPayload 
} from '../tokens';
import { logger } from '../utils/logger';

const router = Router();

// Session storage (in production, use Redis or database)
const activeSessions = new Map<string, { 
  sessionId: string; 
  currentStep: number; 
  createdAt: number;
  lastActivity: number;
}>();

// Cleanup expired sessions periodically
setInterval(() => {
  const now = Date.now();
  const expiredSessions = [];
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > 15 * 60 * 1000) { // 15 minutes inactive
      expiredSessions.push(sessionId);
    }
  }
  
  expiredSessions.forEach(sessionId => {
    activeSessions.delete(sessionId);
    logger.info('Cleaned up expired session', { sessionId });
  });
}, 5 * 60 * 1000); // Run every 5 minutes

/**
 * Start a new security awareness session
 */
router.post('/start', (req: Request, res: Response) => {
  try {
    const sessionId = generateNonce();
    const now = Date.now();
    
    // Create session record
    activeSessions.set(sessionId, {
      sessionId,
      currentStep: 0,
      createdAt: now,
      lastActivity: now
    });
    
    // Create initial token
    const token = signToken({
      sessionId,
      step: 0,
      nonce: generateNonce(),
      exp: createExpiration(10) // 10 minutes
    });
    
    logger.info('Session started', { 
      sessionId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({ 
      sessionId, 
      token,
      message: 'Welcome to Syncron Security Awareness Month 2025!',
      expiresIn: 600 // seconds
    });
  } catch (error) {
    logger.error('Failed to start session', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip 
    });
    res.status(500).json({ error: 'Failed to start session' });
  }
});

/**
 * Update session progress
 */
router.post('/:id/progress', (req: Request, res: Response) => {
  try {
    const { token, step, data } = req.body;
    const sessionId = req.params.id;
    
    if (!token || typeof step !== 'number') {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Verify token
    const payload = verifyToken(token);
    if (!payload || payload.sessionId !== sessionId) {
      logger.warn('Invalid token in progress update', { 
        sessionId,
        ip: req.ip,
        providedSessionId: payload?.sessionId
      });
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Check session exists
    const session = activeSessions.get(sessionId);
    if (!session) {
      logger.warn('Session not found', { sessionId, ip: req.ip });
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Validate step progression
    if (!isValidStepProgression(payload.step, step)) {
      logger.warn('Invalid step progression', { 
        sessionId,
        currentStep: payload.step,
        requestedStep: step,
        ip: req.ip
      });
      return res.status(400).json({ error: 'Invalid step progression' });
    }
    
    // Update session
    session.currentStep = step;
    session.lastActivity = Date.now();
    
    // Issue new token
    const newToken = signToken({
      sessionId,
      step,
      nonce: generateNonce(),
      exp: createExpiration(5) // 5 minutes for progress steps
    });
    
    logger.info('Progress updated', { 
      sessionId,
      step,
      ip: req.ip,
      data: data ? 'provided' : 'none'
    });
    
    res.json({ 
      token: newToken,
      message: `Step ${step} completed`,
      expiresIn: 300
    });
  } catch (error) {
    logger.error('Failed to update progress', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionId: req.params.id,
      ip: req.ip 
    });
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * Complete the security awareness experience
 */
router.post('/:id/complete', (req: Request, res: Response) => {
  try {
    const { token, gameScore, totalTime } = req.body;
    const sessionId = req.params.id;
    
    if (!token) {
      return res.status(400).json({ error: 'Missing completion token' });
    }
    
    // Verify token
    const payload = verifyToken(token);
    if (!payload || payload.sessionId !== sessionId) {
      logger.warn('Invalid completion token', { 
        sessionId,
        ip: req.ip,
        providedSessionId: payload?.sessionId
      });
      return res.status(401).json({ error: 'Invalid completion token' });
    }
    
    // Check session exists and is at valid step
    const session = activeSessions.get(sessionId);
    if (!session) {
      logger.warn('Completion attempted for non-existent session', { 
        sessionId, 
        ip: req.ip 
      });
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Validate completion step (should be at least step 2 - CYOA + Mini Game)
    if (payload.step < 2) {
      logger.warn('Premature completion attempt', { 
        sessionId,
        currentStep: payload.step,
        ip: req.ip
      });
      return res.status(400).json({ error: 'Experience not fully completed' });
    }
    
    // Issue final completion token
    const completionToken = signToken({
      sessionId,
      step: 999, // Completion marker
      nonce: generateNonce(),
      exp: createExpiration(1) // 1 minute to use
    });
    
    // Log successful completion
    logger.info('Security awareness experience completed', { 
      sessionId,
      gameScore,
      totalTime,
      ip: req.ip,
      completedAt: new Date().toISOString(),
      sessionDuration: Date.now() - session.createdAt
    });
    
    // Clean up session
    activeSessions.delete(sessionId);
    
    res.json({
      completionToken,
      redirectUrl: 'https://syncron.atlassian.net/wiki/x/UwDPZg',
      message: '🎉 Congratulations! You\'ve completed Syncron Security Awareness Month 2025!',
      stats: {
        gameScore: gameScore || 0,
        totalTime: totalTime || 0,
        completedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Failed to complete session', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionId: req.params.id,
      ip: req.ip 
    });
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

/**
 * Get session status (optional endpoint for debugging)
 */
router.get('/:id/status', (req: Request, res: Response) => {
  try {
    const sessionId = req.params.id;
    const session = activeSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      sessionId: session.sessionId,
      currentStep: session.currentStep,
      createdAt: new Date(session.createdAt).toISOString(),
      lastActivity: new Date(session.lastActivity).toISOString(),
      isActive: Date.now() - session.lastActivity < 15 * 60 * 1000
    });
  } catch (error) {
    logger.error('Failed to get session status', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionId: req.params.id 
    });
    res.status(500).json({ error: 'Failed to get session status' });
  }
});

export default router;