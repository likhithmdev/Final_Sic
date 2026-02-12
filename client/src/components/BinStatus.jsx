import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';

const BinStatus = ({ binStatus, destination }) => {
  const bins = [
    { name: 'Dry-Waste', type: 'dry', color: 'bg-blue-400', icon: '🗑️' },
    { name: 'Wet-Waste', type: 'wet', color: 'bg-green-500', icon: '🥬' },
    { name: 'E-waste', type: 'electronic', color: 'bg-orange-500', icon: '⚡' }
  ];

  const getFillLevel = (type) => {
    if (!binStatus || !binStatus.levels) return 0;
    return binStatus.levels[type] || 0;
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Trash2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-white">Bin Status</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bins.map((bin, index) => {
          const fillLevel = getFillLevel(bin.type);
          const isDestination = destination === bin.type;
          const isFull = fillLevel >= 80;

          return (
            <motion.div
              key={bin.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: isDestination ? 1.05 : 1,
                borderColor: isDestination ? '#00ff88' : '#1f2937'
              }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                isDestination ? 'bg-primary/10' : 'bg-darker'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
  <div className="flex items-center gap-2">
    <span className="text-2xl">{bin.icon}</span>
    <span className="text-[13px] text-white font-medium break-words">
      {bin.name}
    </span>
  </div>
  {isFull && <AlertTriangle className="w-4 h-4 text-red-500" />}
</div>


              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fill Level</span>
                  <span className={`font-medium ${isFull ? 'text-red-500' : 'text-gray-300'}`}>
                    {fillLevel.toFixed(0)}%
                  </span>
                </div>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${isFull ? 'bg-red-500' : bin.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${fillLevel}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {isDestination && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-xs text-primary font-medium"
                >
                  ← Current Destination
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BinStatus;
