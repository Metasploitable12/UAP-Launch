import React from 'react';
import { Shield, Zap } from 'lucide-react';
import type { GameStep } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: GameStep;
}

const Layout: React.FC<LayoutProps> = ({ children, currentStep }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Syncron Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center transform rotate-45">
                <div className="w-6 h-6 bg-white rounded-sm transform -rotate-45"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Syncron Security Awareness
                </h1>
                <p className="text-sm text-orange-600 font-medium">Month 2025</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                ['cyoa', 'minigame', 'complete'].includes(currentStep)
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Shield size={16} />
                <span>Adventure</span>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                ['minigame', 'complete'].includes(currentStep)
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Zap size={16} />
                <span>Game</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Syncron Security Awareness Month 2025</p>
            <p className="mt-1">Building a more secure tomorrow, one click at a time 🛡️</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;