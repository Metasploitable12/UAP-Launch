import React, { useState } from 'react';
import { Shield, Play, Zap, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onStart: (copyVariant: 'corporate' | 'dad-joke' | 'meme') => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [selectedVariant, setSelectedVariant] = useState<'corporate' | 'dad-joke' | 'meme'>('corporate');

  const copyVariants = {
    corporate: {
      title: "Join Syncron's Security Awareness Month 2025",
      subtitle: "Interactive learning experiences to strengthen your cybersecurity skills",
      description: "Embark on a guided journey through security scenarios and test your skills in our retro-themed mini-game. Build confidence while having fun!",
      buttonText: "Begin Your Journey"
    },
    'dad-joke': {
      title: "Security Awareness Month: It's 'Phish-ally' Fun! 🐟",
      subtitle: "Don't worry, our jokes are worse than our malware!",
      description: "Navigate through cyber-security scenarios that are more twisted than USB cables behind your desk. Our mini-game has fewer bugs than Internet Explorer (probably).",
      buttonText: "Let's Get This 'Byte' Started"
    },
    meme: {
      title: "Security Awareness Month 2025: Based & Securitypilled 💯",
      subtitle: "Touch grass? Nah, touch security best practices ✨",
      description: "fr fr no cap this slaps different. Navigate through cybersec scenarios that absolutely send, then flex your skills in our retro game that's bussin' 🔥",
      buttonText: "Say Less, Let's Go"
    }
  };

  const currentCopy = copyVariants[selectedVariant];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {currentCopy.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            {currentCopy.subtitle}
          </p>
        </motion.div>

        {/* Copy Variant Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-sm text-gray-500 mb-4">Choose your adventure style:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(copyVariants).map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedVariant === variant
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {variant === 'dad-joke' ? 'Dad Jokes' : variant === 'meme' ? 'Meme Mode' : 'Corporate'}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          {currentCopy.description}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStart(selectedVariant)}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Play size={20} className="mr-2" />
          {currentCopy.buttonText}
        </motion.button>
      </div>

      {/* Feature Preview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid md:grid-cols-3 gap-8 mt-16"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Choose Your Adventure
          </h3>
          <p className="text-gray-600">
            Navigate through realistic cybersecurity scenarios with humor and engaging storytelling.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Zap size={24} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Retro Mini-Game
          </h3>
          <p className="text-gray-600">
            Test your reflexes avoiding phishing links in our nostalgic arcade-style game.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Award size={24} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Security Mastery
          </h3>
          <p className="text-gray-600">
            Complete both experiences to unlock exclusive Security Awareness Month resources.
          </p>
        </div>
      </motion.div>

      {/* Stats/Motivation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="text-center mt-16 p-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Join the Security Champions
        </h3>
        <p className="text-gray-600 mb-6">
          Every interaction makes our organization more secure. Your participation matters!
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-600">5min</div>
            <div className="text-sm text-gray-600">Average completion</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-gray-600">Fun guaranteed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">∞</div>
            <div className="text-sm text-gray-600">Security awareness gained</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;