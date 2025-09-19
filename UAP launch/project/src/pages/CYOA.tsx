import React, { useState, useEffect } from 'react';
import { ChevronRight, AlertTriangle, Shield, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SessionData } from '../App';
import { startSession, updateProgress } from '../utils/api';

interface CYOAProps {
  sessionData: SessionData | null;
  onComplete: (newSessionData: SessionData) => void;
  onSessionCreate: (sessionData: SessionData) => void;
}

const CYOA: React.FC<CYOAProps> = ({ sessionData, onComplete, onSessionCreate }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userChoices, setUserChoices] = useState<number[]>([]);

  // Initialize session if not exists
  useEffect(() => {
    if (!sessionData) {
      initializeSession();
    }
  }, [sessionData]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      const response = await startSession();
      const newSessionData: SessionData = {
        sessionId: response.sessionId,
        token: response.token,
        currentStep: 0,
        copyVariant: 'corporate' // Default, will be set by parent
      };
      onSessionCreate(newSessionData);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyVariants = {
    corporate: {
      scenarios: [
        {
          title: "The Suspicious Email",
          situation: "You receive an urgent email from 'IT Support' asking you to verify your password due to a security incident. The email has your company logo but the sender's address is from a free email service.",
          choices: [
            { text: "Click the link and enter my password immediately", isCorrect: false, explanation: "Never provide credentials through email links, even if they appear urgent!" },
            { text: "Forward the email to our actual IT department", isCorrect: true, explanation: "Excellent! Always verify suspicious requests through official channels." },
            { text: "Delete the email and change my password on the official company portal", isCorrect: true, explanation: "Smart move! You're being proactive while staying secure." }
          ]
        },
        {
          title: "The USB Discovery",
          situation: "Walking through the parking lot, you find a USB drive labeled 'Confidential - Q1 Budget Data' near your car. Your curiosity is piqued about what confidential information it might contain.",
          choices: [
            { text: "Take it to IT Security to scan safely", isCorrect: true, explanation: "Perfect! This is exactly the right approach for unknown devices." },
            { text: "Plug it into my work computer to see what's on it", isCorrect: false, explanation: "This is a common attack vector! Unknown USB devices can contain malware." },
            { text: "Post on Slack asking if anyone lost a USB drive", isCorrect: false, explanation: "While well-intentioned, this could help an attacker identify their target." }
          ]
        },
        {
          title: "The Social Engineering Call",
          situation: "Someone calls claiming to be from your bank's fraud department, saying there's suspicious activity on your corporate credit card. They ask you to confirm the card number and CVV to 'verify your identity.'",
          choices: [
            { text: "Provide the information since they mentioned specific recent transactions", isCorrect: false, explanation: "Attackers research targets! Always verify through official channels." },
            { text: "Hang up and call the bank using the number on my card", isCorrect: true, explanation: "Excellent! This is the gold standard for verifying suspicious calls." },
            { text: "Ask them to email me the details for review", isCorrect: false, explanation: "You're thinking cautiously, but legitimate institutions won't send sensitive info via email." }
          ]
        }
      ]
    },
    'dad-joke': {
      scenarios: [
        {
          title: "The 'Phish-y' Email",
          situation: "An email from 'IT Support' wants your password faster than a dad wants the thermostat left alone. The sender's address looks fishier than last week's tuna salad. What's your move, champ?",
          choices: [
            { text: "Click faster than I click 'Skip Ad'", isCorrect: false, explanation: "Whoa there, Speed Racer! That link is more dangerous than my cooking!" },
            { text: "Forward it to real IT like I forward dad jokes", isCorrect: true, explanation: "Now you're cooking with gas! Unlike my actual cooking, this won't burn the house down." },
            { text: "Delete and change password on the real site", isCorrect: true, explanation: "Smart as a whip! You're more secure than my WiFi password: 'password123'... wait, don't use that." }
          ]
        },
        {
          title: "The Mystery USB (Ultimate Surprise Bait)",
          situation: "Found a USB in the parking lot labeled 'Confidential Budget.' It's more tempting than the last slice of pizza, but potentially more dangerous than my dance moves at weddings.",
          choices: [
            { text: "Give it to IT Security (they love surprises!)", isCorrect: true, explanation: "Bingo! You passed this test better than I passed my driving test... eventually." },
            { text: "Plug it in like it's a phone charger", isCorrect: false, explanation: "Hold your horses! That USB has more viruses than a daycare center." },
            { text: "Post on Slack like it's a lost dog", isCorrect: false, explanation: "Nice try, but you just helped a hacker like I 'help' with dinner (spoiler: I don't)." }
          ]
        },
        {
          title: "The 'Bank' Call (More Fake Than My Hair)",
          situation: "Someone calls claiming to be from your bank. They know more about your transactions than you do, but they want your card info. This is shadier than my understanding of TikTok.",
          choices: [
            { text: "Give them the info (they seem legit!)", isCorrect: false, explanation: "Nope! They're faker than my excitement for lawn work." },
            { text: "Hang up and call the real bank number", isCorrect: true, explanation: "Ding ding ding! You win! Unlike when I try to win arguments with your mother." },
            { text: "Ask for an email with the details", isCorrect: false, explanation: "Close, but banks don't email sensitive stuff. That's like me remembering anniversaries - it doesn't happen!" }
          ]
        }
      ]
    },
    meme: {
      scenarios: [
        {
          title: "Sus Email Energy 📧",
          situation: "'IT Support' just slid into your inbox asking for your password. The vibes are more off than putting milk before cereal. The sender address is giving major impostor syndrome. What's the move, bestie?",
          choices: [
            { text: "Send it no questions asked 💀", isCorrect: false, explanation: "Bestie no! That's not the vibe. This ain't it, chief! 💀" },
            { text: "Forward to actual IT like 'is this you?'", isCorrect: true, explanation: "Period! You absolutely understood the assignment ✨💯" },
            { text: "Delete and change password like a boss", isCorrect: true, explanation: "OK but this is actually galaxy brain behavior 🧠✨" }
          ]
        },
        {
          title: "Random USB Spawn 💾",
          situation: "Bruh you found a USB in the parking lot labeled 'Confidential Budget' and it's giving main character energy. Your curiosity is absolutely sending you rn but this could be a trap card fr fr.",
          choices: [
            { text: "Straight to IT Security (no cap)", isCorrect: true, explanation: "This is the way! You're built different and security-pilled 💪" },
            { text: "Yeet it into my computer immediately", isCorrect: false, explanation: "BESTIE NO! That USB is more sus than Among Us gameplay 📮" },
            { text: "Drop it in the group chat", isCorrect: false, explanation: "You tried it bestie but that's helping the hackers low-key 👀" }
          ]
        },
        {
          title: "Fake Bank Call Goes Brrrr ☎️",
          situation: "Someone's calling about your bank account and they're spitting facts about your transactions. But they want your card deets and honestly? The energy feels manufactured. This person is giving NPC vibes.",
          choices: [
            { text: "Drop my whole card number like it's hot", isCorrect: false, explanation: "Bestie that's not the move! You just got finessed 💸" },
            { text: "Hang up and call the bank myself (big brain)", isCorrect: true, explanation: "NOW WE'RE TALKING! Absolutely served them with that verification energy ✨" },
            { text: "Ask them to slide into my email", isCorrect: false, explanation: "Good instinct but banks don't really do that email thing bestie 📧❌" }
          ]
        }
      ]
    }
  };

  const currentCopy = sessionData ? copyVariants[sessionData.copyVariant] : copyVariants.corporate;
  const scenario = currentCopy.scenarios[currentScenario];

  const handleChoice = async (choiceIndex: number) => {
    const newChoices = [...userChoices, choiceIndex];
    setUserChoices(newChoices);

    try {
      setIsLoading(true);
      
      if (sessionData) {
        const updatedSessionData = await updateProgress(
          sessionData.sessionId,
          sessionData.token,
          1
        );
        
        if (currentScenario < currentCopy.scenarios.length - 1) {
          // Move to next scenario
          setCurrentScenario(currentScenario + 1);
          onComplete({
            ...sessionData,
            token: updatedSessionData.token,
            currentStep: 1
          });
        } else {
          // Complete CYOA phase
          onComplete({
            ...sessionData,
            token: updatedSessionData.token,
            currentStep: 1
          });
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your security adventure...</p>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading scenario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Scenario {currentScenario + 1} of {currentCopy.scenarios.length}
            </span>
            <span className="text-sm text-orange-600 font-medium">
              Choose Your Adventure
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentScenario + 1) / currentCopy.scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Scenario Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {scenario.title}
                </h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {scenario.situation}
                </p>
              </div>
            </div>

            {/* Choices */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                What do you do?
              </h3>
              {scenario.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleChoice(index)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-300 rounded-xl transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium group-hover:text-orange-800">
                      {choice.text}
                    </span>
                    <ChevronRight 
                      size={20} 
                      className="text-gray-400 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all" 
                    />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Helpful Tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb size={16} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Security Tip</h4>
                  <p className="text-blue-700 text-sm">
                    When in doubt, verify through official channels. Attackers create urgency to prevent you from thinking clearly!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CYOA;