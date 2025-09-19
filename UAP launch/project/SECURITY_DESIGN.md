# Security Design Document
## Syncron Security Awareness Month 2025 Launch App

### 🎯 Security Objectives

1. **Server-Side Authority**: Never trust client-side completion claims
2. **Anti-Tampering**: Prevent manipulation of progress/completion state  
3. **Session Integrity**: Ensure authentic user journey through experiences
4. **Production Hardening**: Protect against reverse engineering attempts

---

### 🏗️ Architecture Overview

```
┌─────────────────┐    HTTPS    ┌─────────────────┐
│   Frontend      │ ◄─────────► │   Backend       │
│   (React)       │   Tokens    │   (Express)     │
└─────────────────┘             └─────────────────┘
        │                               │
        │                               │
        ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│ Obfuscated      │             │ HMAC Validation │
│ Production      │             │ + Nonce Chain   │
│ Bundle          │             │ + Rate Limiting │
└─────────────────┘             └─────────────────┘
```

---

### 🔐 Token Security Model

#### **HMAC-SHA256 Implementation**
- **Algorithm**: HMAC-SHA256 with server-side secret
- **Structure**: `{header}.{payload}.{signature}` (JWT-like)
- **Secret**: Environment variable `HMAC_SECRET` (never client-exposed)

#### **Token Payload Structure**
```typescript
interface TokenPayload {
  sessionId: string;  // UUID v4 session identifier
  step: number;       // Current completion step (0-999)
  nonce: string;      // UUID v4 anti-replay nonce
  exp: number;        // Unix timestamp expiration
}
```

#### **Nonce Chaining Strategy**
- Each token contains a unique nonce
- Server validates and issues new nonce on each step
- Prevents replay attacks and token reuse
- Broken chain = invalid session

---

### 🛡️ Security Controls

#### **1. Session Management**
- **Start**: Issues initial token (10min expiry)
- **Progress**: Validates current token, issues next (5min expiry)  
- **Complete**: Final validation before redirect (immediate expiry)

#### **2. Anti-Tamper Measures**
```typescript
// Rate limiting per IP
const rateLimits = new Map();
const RATE_LIMIT = 10; // requests per minute

// Suspicious activity logging
logger.warn('Invalid token attempt', {
  ip: req.ip,
  sessionId: payload?.sessionId,
  timestamp: Date.now()
});
```

#### **3. Production Hardening**
- **Code Obfuscation**: Variable name mangling
- **Bundle Minification**: Remove whitespace, comments
- **No Source Maps**: Prevent original code inspection
- **Environment Separation**: Dev vs prod configurations

---

### 🚨 Threat Model

#### **Threats Mitigated**
| Threat | Mitigation |
|--------|------------|
| Token Forgery | HMAC-SHA256 signature validation |
| Replay Attacks | Nonce chaining + expiration |
| Session Hijacking | Short-lived tokens + HTTPS only |
| Progress Skipping | Server-side step validation |
| Completion Spoofing | Final token verification |
| Rate/DDoS | Express rate limiting middleware |
| Code Analysis | Production obfuscation |

#### **Residual Risks**
- **Social Engineering**: Users sharing completion tokens
- **Insider Threats**: Access to `HMAC_SECRET` environment variable
- **Browser Vulnerabilities**: XSS leading to token theft
- **Network MITM**: If HTTPS misconfigured

---

### 🔍 Validation Logic

#### **Token Signing Process**
```typescript
export function signToken(payload: TokenPayload): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");
  
  const body = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64url");
  
  const data = `${header}.${body}`;
  const signature = crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(data)
    .digest("base64url");
    
  return `${data}.${signature}`;
}
```

#### **Token Verification Process**
```typescript
export function verifyToken(token: string): TokenPayload | null {
  try {
    const [header, body, signature] = token.split(".");
    
    // Verify signature
    const expectedSig = crypto
      .createHmac("sha256", HMAC_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
      
    if (expectedSig !== signature) return null;
    
    // Check expiration
    const payload: TokenPayload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    );
    
    if (Date.now() > payload.exp) return null;
    
    return payload;
  } catch {
    return null;
  }
}
```

---

### 📊 Security Monitoring

#### **Logging Strategy**
- **Info**: Successful completions with timing data
- **Warn**: Invalid token attempts, rate limit hits
- **Error**: Server errors, crypto failures

#### **Metrics to Track**
- Session completion rate vs abandonment
- Average time to completion
- Invalid token attempt frequency
- Geographic distribution of sessions

---

### 🔧 Security Configuration

#### **Environment Variables**
```bash
# Required
HMAC_SECRET=256-bit-random-key-change-in-production
NODE_ENV=production

# Optional  
RATE_LIMIT_WINDOW=60000    # 1 minute
RATE_LIMIT_MAX=10          # 10 requests per window
SESSION_TIMEOUT=600000     # 10 minutes
```

#### **Production Deployment Checklist**
- [ ] Unique `HMAC_SECRET` generated and secured
- [ ] HTTPS enforced (no HTTP fallback)
- [ ] Source maps disabled in build
- [ ] Error messages sanitized (no stack traces)
- [ ] Rate limiting configured
- [ ] Monitoring/alerting enabled
- [ ] Security headers configured

---

### 🔄 Incident Response

#### **Token Compromise Response**
1. **Rotate** `HMAC_SECRET` immediately
2. **Invalidate** all existing sessions
3. **Monitor** for continued suspicious activity
4. **Notify** security team and stakeholders

#### **Attack Detection Indicators**
- High volume of invalid token requests
- Rapid session progression (bot-like behavior)
- Unusual geographic patterns
- Completion without proper step progression

---

### ✅ Security Validation

#### **Automated Testing**
- Token signing/verification unit tests
- Integration tests for session flow
- Load testing for rate limiting
- Negative testing for invalid inputs

#### **Manual Security Review**
- Code review focusing on token handling
- Penetration testing of session endpoints
- Configuration audit of production environment
- Documentation review for security procedures

---

**Document Version**: 1.0  
**Last Updated**: Security Awareness Month 2025  
**Next Review**: Post-launch security assessment