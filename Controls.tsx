
import React from 'react';
import { PlayIcon, PauseIcon, FinishFlagIcon } from './icons';

interface ControlsProps {
  isTestRunning: boolean;
  onToggle: () => void;
  onEndTest: () => void;
  isEndTestDisabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({ isTestRunning, onToggle, onEndTest, isEndTestDisabled }) => {
  const playPauseButtonClass = isTestRunning
    ? 'bg-yellow-500 hover:bg-yellow-600 focus-visible:outline-yellow-500'
    : 'bg-green-500 hover:bg-green-600 focus-visible:outline-green-500';

  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={onToggle}
        className={`flex items-center justify-center w-32 h-16 rounded-full text-white font-bold text-2xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-opacity-75 ${playPauseButtonClass}`}
        aria-label={isTestRunning ? 'Pausa Test' : 'Inizia Test'}
      >
        {isTestRunning ? (
          <>
            <PauseIcon />
            <span className="ml-2">Pausa</span>
          </>
        ) : (
          <>
            <PlayIcon />
            <span className="ml-2">Play</span>
          </>
        )}
      </button>
      <button
        onClick={onEndTest}
        disabled={isEndTestDisabled}
        className="flex items-center justify-center w-auto px-6 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-opacity-75 focus-visible:outline-red-600 disabled:bg-red-900 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        aria-label="Fine Test"
      >
        <FinishFlagIcon />
        <span className="ml-2">Fine Test</span>
      </button>
    </div>
  );
};

export default Controls;
