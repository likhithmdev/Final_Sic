import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Activity } from 'lucide-react';

const LiveFeed = ({ detection }) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <Camera className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-white">Live Camera Feed</h2>
        <motion.div
          className="ml-auto w-3 h-3 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </div>

      <div className="relative bg-darker rounded-lg aspect-video w-[75%] mx-auto flex items-center justify-center overflow-hidden">
      {detection ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Activity className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-gray-400">Detection Active</p>
          </motion.div>
        ) : (
          <div className="text-center">
            <Camera className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">Waiting for object...</p>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs text-white">
          LIVE
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
