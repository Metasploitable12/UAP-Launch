import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Target, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from '../components/Confetti';
import type { SessionData } from '../App';
import { completeSession } from '../utils/api';

interface CompleteProps {
  sessionData: SessionData;
  gameScore: number;
  totalTime: number;
}

const Complete: React.FC<CompleteProps> = ({ sessionData, gameScore, totalTime }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    handleCompletion();
  }, []);

  const handleCompletion = async () => {
    try {
      setIsLoading(true);
      const response = await completeSession(sessionData.sessionId, sessionData.token, {
        gameScore,
        totalTime
      });
      
      setRedirectUrl(response.redirectUrl);
      setCompletionMessage(response.message);
    } catch (error) {
      console.error('Failed to complete session:', error);
      setCompletionMessage('🎉 Congratulations! You\'ve completed Syncron Security Awareness Month 2025!');
      setRedirectUrl('https://syncron.atlassian.net/wiki/x/UwDPZg');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = () => {
    if (redirectUrl) {
      window.open(redirectUrl, '_blank');
    }
  };

  const copyVariants = {
    corporate: {
      title: "Mission Accomplished! 🛡️",
      subtitle: "You've successfully completed Syncron Security Awareness Month 2025",
      achievements: [
        "Navigated complex cybersecurity scenarios with confidence",
        "Demonstrated excellent security judgment and decision-making",
        "Successfully defended against simulated cyber threats",
        "Earned your Security Awareness Champion status"
      ],
      nextSteps: "Continue your security journey with our comprehensive resources and training materials.",
      buttonText: "Access Security Resources"
    },
    'dad-joke': {
      title: "You Nailed It! (Unlike my DIY projects) 🔨",
      subtitle: "You've mastered security better than I've mastered the thermostat",
      achievements: [
        "Spotted phishing attempts faster than I spot a good parking spot",
        "Made security decisions better than my fashion choices",
        "Defended against cyber threats like I defend the TV remote",
        "Earned more security points than I have dad joke groans"
      ],
      nextSteps: "Keep being awesome! Check out more security tips (they're less corny than my jokes).",
      buttonText: "Get More Security Wisdom"
    },
    meme: {
      title: "That Was Absolutely Sending! 🔥",
      subtitle: "You just completed security awareness month and honestly? That's pretty poggers",
      achievements: [
        "Spotted sus emails like you spot main character energy ✨",
        "Made security choices that were absolutely based 💯",
        "Defended against cyber threats with galaxy brain energy 🧠",
        "Unlocked security champion status - you're built different fr"
      ],
      nextSteps: "Keep slaying in the security game bestie! More resources await your main character moment.",
      buttonText: "Let's Go Get Those Resources"
    }
  };

  const currentCopy = copyVariants[sessionData.copyVariant];

  const getScoreRating = (score: number) => {
    if (score >= 200) return { text: 'Legendary!', color: 'text-purple-600', emoji: '🏆' };
    if (score >= 150) return { text: 'Excellent!', color: 'text-gold-600', emoji: '🥇' };
    if (score >= 100) return { text: 'Great!', color: 'text-green-600', emoji: '🥈' };
    if (score >= 50) return { text: 'Good!', color: 'text-blue-600', emoji: '🥉' };
    return { text: 'Keep practicing!', color: 'text-gray-600', emoji: '📈' };
  };

  const scoreRating = getScoreRating(gameScore);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6">
          <Trophy size={40} className="text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {currentCopy.title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {currentCopy.subtitle}
        </p>

        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-4">
            {completionMessage}
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Target size={24} className="text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {gameScore} {scoreRating.emoji}
          </h3>
          <p className="text-gray-600">Game Score</p>
          <p className={`text-sm font-medium ${scoreRating.color} mt-1`}>
            {scoreRating.text}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
          </h3>
          <p className="text-gray-600">Time Completed</p>
          <p className="text-sm text-blue-600 font-medium mt-1">
            {totalTime < 300 ? 'Speed runner!' : totalTime < 600 ? 'Perfect pace!' : 'Thorough approach!'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Trophy size={24} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            100%
          </h3>
          <p className="text-gray-600">Completion</p>
          <p className="text-sm text-green-600 font-medium mt-1">
            Security Champion!
          </p>
        </div>
      </motion.div>

      {/* Achievement List */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          What You Accomplished
        </h2>
        
        <div className="space-y-4">
          {currentCopy.achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{achievement}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Continue Your Security Journey
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            {currentCopy.nextSteps}
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
              <span className="text-gray-600">Preparing your resources...</span>
            </div>
          ) : (
            <button
              onClick={handleRedirect}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <ExternalLink size={20} className="mr-2" />
              {currentCopy.buttonText}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Complete;