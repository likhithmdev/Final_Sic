import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';

const ProcessingChamber = ({ detection }) => {
  const isProcessing = detection?.destination === 'processing';
  const objectCount = detection?.count || 0;

  return (
    <div className="bg-card rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-5 h-5 text-processing" />
        <h2 className="text-xl font-bold text-white">Processing Chamber</h2>
      </div>

      <div className={`relative p-6 rounded-lg border-2 transition-all ${
        isProcessing 
          ? 'bg-processing/10 border-processing' 
          : 'bg-darker border-gray-700'
      }`}>
        {isProcessing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-16 h-16 border-4 border-processing border-t-transparent rounded-full mx-auto mb-4"
            />
            
            <h3 className="text-lg font-semibold text-white mb-2">
              Multi-Object Processing
            </h3>
            
            <p className="text-gray-400 text-sm mb-4">
              {objectCount} objects detected - separating for individual sorting
            </p>

            <div className="space-y-2">
              {detection.objects.map((obj, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center justify-between p-2 bg-darker/50 rounded"
                >
                  <span className="text-white capitalize text-sm">{obj.class}</span>
                  <ArrowRight className="w-4 h-4 text-processing" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Standby Mode</p>
            <p className="text-gray-600 text-xs mt-1">
              Activates when multiple objects detected
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-darker p-3 rounded-lg">
          <p className="text-gray-400 mb-1">Status</p>
          <p className={`font-medium ${isProcessing ? 'text-processing' : 'text-gray-500'}`}>
            {isProcessing ? 'Active' : 'Idle'}
          </p>
        </div>
        <div className="bg-darker p-3 rounded-lg">
          <p className="text-gray-400 mb-1">Queue</p>
          <p className="font-medium text-white">
            {isProcessing ? objectCount : 0} items
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingChamber;
