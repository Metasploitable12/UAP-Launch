const API_BASE = '/api';

export interface SessionStartResponse {
  sessionId: string;
  token: string;
  message?: string;
  expiresIn?: number;
}

export interface ProgressUpdateResponse {
  token: string;
  message?: string;
  expiresIn?: number;
}

export interface CompletionResponse {
  completionToken: string;
  redirectUrl: string;
  message: string;
  stats?: {
    gameScore: number;
    totalTime: number;
    completedAt: string;
  };
}

export async function startSession(): Promise<SessionStartResponse> {
  const response = await fetch(`${API_BASE}/session/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to start session' }));
    throw new Error(error.error || 'Failed to start session');
  }

  return response.json();
}

export async function updateProgress(
  sessionId: string, 
  token: string, 
  step: number,
  data?: any
): Promise<ProgressUpdateResponse> {
  const response = await fetch(`${API_BASE}/session/${sessionId}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      step,
      data
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update progress' }));
    throw new Error(error.error || 'Failed to update progress');
  }

  return response.json();
}

export async function completeSession(
  sessionId: string,
  token: string,
  stats: {
    gameScore: number;
    totalTime: number;
  }
): Promise<CompletionResponse> {
  const response = await fetch(`${API_BASE}/session/${sessionId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      gameScore: stats.gameScore,
      totalTime: stats.totalTime
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to complete session' }));
    throw new Error(error.error || 'Failed to complete session');
  }

  return response.json();
}

export async function getSessionStatus(sessionId: string) {
  const response = await fetch(`${API_BASE}/session/${sessionId}/status`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get session status' }));
    throw new Error(error.error || 'Failed to get session status');
  }

  return response.json();
}