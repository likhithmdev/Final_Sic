import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Layers, Activity } from 'lucide-react';

const StatsPanel = ({ detection }) => {
  const [stats, setStats] = useState({
    totalDetections: 0,
    dry: 0,
    wet: 0,
    electronic: 0,
    multiObject: 0
  });

  useEffect(() => {
    if (detection) {
      setStats(prev => {
        const newStats = {
          totalDetections: prev.totalDetections + 1,
          dry: prev.dry,
          wet: prev.wet,
          electronic: prev.electronic,
          multiObject: prev.multiObject
        };

        if (detection.count > 1) {
          newStats.multiObject += 1;
        }

        detection.objects.forEach(obj => {
          if (newStats[obj.class] !== undefined) {
            newStats[obj.class] += 1;
          }
        });

        return newStats;
      });
    }
  }, [detection]);

  const statCards = [
    {
      label: 'Total Detections',
      value: stats.totalDetections,
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Dry Waste',
      value: stats.dry,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Wet Waste',
      value: stats.wet,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Electronic Waste',
      value: stats.electronic,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Multi-Object Events',
      value: stats.multiObject,
      icon: Layers,
      color: 'text-processing',
      bgColor: 'bg-processing/10'
    }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-white">Statistics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg ${stat.bgColor} border border-gray-700/50`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <motion.span
                key={stat.value}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-bold ${stat.color}`}
              >
                {stat.value}
              </motion.span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {stats.totalDetections > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-darker rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-400 mb-3">Distribution</h3>
          <div className="space-y-2">
            {['dry', 'wet', 'electronic'].map(type => {
              const percentage = stats.totalDetections > 0
                ? (stats[type] / stats.totalDetections) * 100
                : 0;
              
              const colors = {
                dry: 'bg-blue-400',
                wet: 'bg-green-500',
                electronic: 'bg-orange-500'
              };

              return (
                <div key={type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 capitalize">{type}</span>
                    <span className="text-gray-300">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={colors[type]}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsPanel;
