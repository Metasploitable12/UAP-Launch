# Syncron Security Awareness Month 2025 🛡️

A playful and secure launch app featuring a Choose Your Own Adventure experience and retro arcade mini-game, designed to engage employees in Security Awareness Month activities.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build:prod

# Run tests
npm test

# Start with Docker
docker-compose up
```

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Security**: HMAC-SHA256 token validation
- **Build**: Production obfuscation + minification
- **Deploy**: Docker containerization

## 📁 Project Structure

```
project-root/
├── README.md                 # This file
├── SECURITY_DESIGN.md       # Security architecture
├── docker-compose.yml       # Container orchestration
├── Dockerfile              # Production container
├── package.json            # Root package config
├── backend/                # Server-side application
│   ├── src/
│   │   ├── index.ts        # Express server
│   │   ├── tokens.ts       # JWT/HMAC token logic
│   │   ├── routes/
│   │   │   └── session.ts  # Session management API
│   │   └── utils/
│   │       └── logger.ts   # Logging utilities
│   ├── tests/
│   │   └── tokens.test.ts  # Token validation tests
│   └── package.json        # Backend dependencies
├── frontend/               # Client-side application
│   ├── src/
│   │   ├── App.tsx         # Main application
│   │   ├── pages/
│   │   │   ├── CYOA.tsx    # Choose Your Own Adventure
│   │   │   ├── MiniGame.tsx # Arcade game
│   │   │   └── Complete.tsx # Success page
│   │   ├── components/
│   │   │   ├── Confetti.tsx # Success animation
│   │   │   └── Layout.tsx   # App shell
│   │   └── utils/
│   │       └── api.ts      # API client
│   ├── vite.config.ts      # Build configuration
│   └── package.json        # Frontend dependencies
```

## 🔧 Development Setup

1. **Environment Variables**
   ```bash
   # Backend (.env)
   HMAC_SECRET=your-secret-key-here
   PORT=3001
   NODE_ENV=development
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## 🏭 Production Build

```bash
# Build optimized production bundle
npm run build:prod

# Build with debug symbols (for testing)
npm run build:debug

# Start production server
npm run start:prod
```

## 🐳 Docker Deployment

```bash
# Build and start containers
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up --build
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run backend tests only
npm run test:backend

# Run frontend tests only  
npm run test:frontend
```

## 🔒 Security Features

- **Server-side authority**: All completion logic on backend
- **Token validation**: HMAC-SHA256 signed tokens with nonce chaining
- **Anti-tamper**: Rate limiting and suspicious activity logging
- **Production hardening**: Code obfuscation and minification
- **Session management**: Time-bounded tokens with proper expiration

## 📖 API Documentation

### Start Session
```http
POST /api/session/start
```
**Response:**
```json
{
  "sessionId": "uuid",
  "token": "signed.jwt.token"
}
```

### Update Progress
```http
POST /api/session/:id/progress
Content-Type: application/json

{
  "token": "current.signed.token",
  "step": 1
}
```

### Complete Experience
```http
POST /api/session/:id/complete
Content-Type: application/json

{
  "token": "final.signed.token"
}
```
**Response:**
```json
{
  "completionToken": "completion.token",
  "redirectUrl": "https://syncron.atlassian.net/wiki/x/UwDPZg",
  "message": "🎉 You unlocked Security Awareness Month!"
}
```

## 🎮 User Experience Flow

1. **Landing Page**: Welcome to Syncron Security Awareness Month 2025
2. **Choose Your Adventure**: Navigate cybersecurity scenarios with humor
3. **Mini-Game**: Avoid phishing links in retro arcade style
4. **Success**: Confetti celebration and redirect to awareness resources

## 🎨 Copy Variants

The app includes three tone variants:
- **Corporate Playful**: Professional but engaging
- **Dad-Joke**: Pun-filled humor for lighter engagement  
- **Meme-Savvy**: Internet culture references for younger audiences

## 🔍 Security Audit

See `SECURITY_DESIGN.md` for detailed security architecture and threat model analysis.

## 📝 License

Internal Syncron project - All rights reserved.