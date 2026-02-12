import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, TrendingUp } from 'lucide-react';

const DetectionCard = ({ detection }) => {
  if (!detection) {
    return (
      <div className="bg-card rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">Detection Results</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          No detection data yet
        </div>
      </div>
    );
  }

  const getColorForClass = (className) => {
    const colors = {
      dry: 'bg-blue-400',
      wet: 'bg-green-500',
      electronic: 'bg-orange-500'
    };
    return colors[className] || 'bg-gray-500';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-white">Detection Results</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={detection.timestamp}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Objects Detected</span>
            <motion.span
              className="text-3xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {detection.count}
            </motion.span>
          </div>

          {detection.objects && detection.objects.length > 0 && (
            <div className="space-y-3">
              {detection.objects.map((obj, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-darker rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getColorForClass(obj.class)}`} />
                    <span className="text-white capitalize font-medium">{obj.class}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-gray-400">{(obj.confidence * 100).toFixed(0)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DetectionCard;
