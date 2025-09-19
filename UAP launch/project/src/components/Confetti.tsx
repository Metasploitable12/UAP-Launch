import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (active) {
      setIsRunning(true);
      // Stop confetti after 3 seconds
      const timer = setTimeout(() => {
        setIsRunning(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!isRunning) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={true}
      numberOfPieces={150}
      gravity={0.3}
      colors={[
        '#FF7A00', // Syncron Orange
        '#FFB366', // Light Orange
        '#FF9933', // Medium Orange
        '#4CAF50', // Success Green
        '#2196F3', // Primary Blue
        '#9C27B0', // Purple
        '#FF5722', // Deep Orange
      ]}
    />
  );
};

export default Confetti;