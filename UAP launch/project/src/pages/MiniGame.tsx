import React, { useState, useEffect, useRef } from 'react';
import { Zap, Heart, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SessionData } from '../App';
import { updateProgress } from '../utils/api';

interface MiniGameProps {
  sessionData: SessionData;
  onComplete: (score: number, newSessionData: SessionData) => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: 'phishing' | 'safe' | 'power-up';
  id: number;
}

const MiniGame: React.FC<MiniGameProps> = ({ sessionData, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [playerY, setPlayerY] = useState(250);
  const [isLoading, setIsLoading] = useState(false);
  const [gameTime, setGameTime] = useState(30); // 30 second game

  const canvasWidth = 800;
  const canvasHeight = 500;
  const playerX = 50;
  const playerSize = 40;

  useEffect(() => {
    if (isPlaying) {
      startGameLoop();
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (gameStarted && gameTime > 0) {
      const timer = setTimeout(() => setGameTime(gameTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameTime === 0) {
      endGame();
    }
  }, [gameTime, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setScore(0);
    setLives(3);
    setGameObjects([]);
    setPlayerY(250);
    setGameTime(30);
  };

  const startGameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let objectSpawnTimer = 0;
    let nextObjectId = 0;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw background grid
      ctx.strokeStyle = '#16213e';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvasWidth; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
      for (let y = 0; y < canvasHeight; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }

      // Spawn objects
      objectSpawnTimer += deltaTime;
      if (objectSpawnTimer > 1000) { // Spawn every 1 second
        const objectType = Math.random() < 0.7 ? 'phishing' : (Math.random() < 0.8 ? 'safe' : 'power-up');
        const newObject: GameObject = {
          x: canvasWidth,
          y: Math.random() * (canvasHeight - 40),
          width: 40,
          height: 40,
          speed: 150 + Math.random() * 100,
          type: objectType,
          id: nextObjectId++
        };
        setGameObjects(prev => [...prev, newObject]);
        objectSpawnTimer = 0;
      }

      // Update and draw objects
      setGameObjects(prev => {
        const updated = prev.map(obj => ({
          ...obj,
          x: obj.x - (obj.speed * deltaTime) / 1000
        })).filter(obj => obj.x > -obj.width);

        // Draw objects
        updated.forEach(obj => {
          if (obj.type === 'phishing') {
            // Draw phishing link (red with alert icon)
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText('⚠️', obj.x + 10, obj.y + 25);
          } else if (obj.type === 'safe') {
            // Draw safe link (green with shield)
            ctx.fillStyle = '#10b981';
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText('🛡️', obj.x + 10, obj.y + 25);
          } else {
            // Draw power-up (blue with star)
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText('⭐', obj.x + 10, obj.y + 25);
          }
        });

        return updated;
      });

      // Draw player
      ctx.fillStyle = '#ff7a00'; // Syncron orange
      ctx.fillRect(playerX, playerY - playerSize/2, playerSize, playerSize);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText('🚀', playerX + 8, playerY + 8);

      // Check collisions
      gameObjects.forEach(obj => {
        if (
          playerX < obj.x + obj.width &&
          playerX + playerSize > obj.x &&
          playerY - playerSize/2 < obj.y + obj.height &&
          playerY + playerSize/2 > obj.y
        ) {
          // Collision detected
          if (obj.type === 'phishing') {
            setLives(prev => prev - 1);
            setGameObjects(prev => prev.filter(o => o.id !== obj.id));
          } else if (obj.type === 'safe') {
            setScore(prev => prev + 10);
            setGameObjects(prev => prev.filter(o => o.id !== obj.id));
          } else if (obj.type === 'power-up') {
            setScore(prev => prev + 50);
            setGameObjects(prev => prev.filter(o => o.id !== obj.id));
          }
        }
      });

      if (isPlaying) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const endGame = async () => {
    setIsPlaying(false);
    setIsLoading(true);

    try {
      const updatedSessionData = await updateProgress(
        sessionData.sessionId,
        sessionData.token,
        2
      );
      
      onComplete(score, {
        ...sessionData,
        token: updatedSessionData.token,
        currentStep: 2
      });
    } catch (error) {
      console.error('Failed to complete mini-game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!isPlaying) return;

    switch (event.key) {
      case 'ArrowUp':
        setPlayerY(prev => Math.max(playerSize/2, prev - 20));
        break;
      case 'ArrowDown':
        setPlayerY(prev => Math.min(canvasHeight - playerSize/2, prev + 20));
        break;
      case ' ':
        event.preventDefault();
        // Space bar action if needed
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    if (lives <= 0) {
      endGame();
    }
  }, [lives]);

  const copyVariants = {
    corporate: {
      title: "Security Defender",
      instructions: "Navigate your ship through cyberspace. Collect secure links (🛡️) and power-ups (⭐), but avoid phishing attacks (⚠️)!",
      startButton: "Launch Defense Systems"
    },
    'dad-joke': {
      title: "Phishing Avoider 3000",
      instructions: "Steer your ship through the internet! Grab the good stuff (🛡️ and ⭐) but dodge those phishy links (⚠️). It's like driving, but with less honking!",
      startButton: "Fire Up the Dad-Mobile!"
    },
    meme: {
      title: "Security Ship Goes Brrrr 🚀",
      instructions: "Pilot your ship through cyber-space bestie! Collect the good vibes (🛡️ and ⭐) but avoid the sus links (⚠️). This is giving retro gaming energy fr!",
      startButton: "Let's Get This Ship!"
    }
  };

  const currentCopy = copyVariants[sessionData.copyVariant];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finalizing your security training...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Zap size={24} className="text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {currentCopy.title}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          {currentCopy.instructions}
        </p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border-2 border-gray-300 rounded-xl bg-gray-900"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-6">
                    <Zap size={48} className="mx-auto mb-4 text-orange-400" />
                    <h3 className="text-2xl font-bold mb-2">Ready to Play?</h3>
                    <p className="text-gray-300 mb-4">Use arrow keys to move your ship</p>
                  </div>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    {currentCopy.startButton}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {gameStarted && (
          <div className="flex justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-blue-500" />
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart size={20} className="text-red-500" />
              <span className="font-semibold">Lives: {lives}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} className="text-yellow-500" />
              <span className="font-semibold">Time: {gameTime}s</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-medium text-green-800">Secure Links</div>
              <div className="text-sm text-green-600">+10 points</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-medium text-blue-800">Power-ups</div>
              <div className="text-sm text-blue-600">+50 points</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="font-medium text-red-800">Phishing Links</div>
              <div className="text-sm text-red-600">Avoid these!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;