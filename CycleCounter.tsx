
import React from 'react';

interface CycleCounterProps {
  count: number;
}

const CycleCounter: React.FC<CycleCounterProps> = ({ count }) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-lg font-medium text-gray-400 uppercase tracking-wider">
        Numero di Cicli
      </h3>
      <p className="text-8xl font-bold text-green-400 font-mono" style={{ textShadow: '0 0 15px rgba(52, 211, 153, 0.5)' }}>
        {count.toLocaleString('it-IT')}
      </p>
    </div>
  );
};

export default CycleCounter;
