import React, { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';
import PropTypes from 'prop-types';

const QUIRKY_MESSAGES = [
  "Hang in there, almost there",
  "Almost done",
  "Shouldn't take more longer"
];

const LoadingOverlay = ({ isLoading, message }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quirkyMessage, setQuirkyMessage] = useState(message);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 6000);
    }, 6000);

    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    if (elapsedTime > 8000) {
      const randomMessage = QUIRKY_MESSAGES[Math.floor(Math.random() * QUIRKY_MESSAGES.length)];
      setQuirkyMessage(randomMessage);
    }
  }, [elapsedTime, isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center text-center">
        <Coffee 
          className="h-12 w-12 text-brown-600 animate-bounce mb-4"
        />
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          {quirkyMessage}
        </p>
      </div>
    </div>
  );
};

LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.string
};

LoadingOverlay.defaultProps = {
  message: "Updating Property..."
};

export default LoadingOverlay;