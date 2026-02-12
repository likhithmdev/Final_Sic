import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import LiveFeed from '../components/LiveFeed';
import DetectionCard from '../components/DetectionCard';
import BinStatus from '../components/BinStatus';
import ProcessingChamber from '../components/ProcessingChamber';
import StatsPanel from '../components/StatsPanel';
import { adminAPI } from '../utils/api';
import { Wifi, WifiOff, Cpu, Gift } from 'lucide-react';

const RewardsSummary = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    adminAPI
      .getUsersSummary()
      .then((res) => {
        if (!isMounted) return;
        setUsers(res.data.users || []);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load rewards summary', err);
        setError('Failed to load rewards summary');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-4 bg-card border border-gray-800 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Rewards Overview</h2>
          <p className="text-xs text-gray-400">
            Users, trash events, and total reward points
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading rewards data...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-400">No users have earned rewards yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left py-2 pr-4">User</th>
                <th className="text-left py-2 pr-4">Email</th>
                <th className="text-right py-2 pr-4">Trash Events</th>
                <th className="text-right py-2">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-900">
                  <td className="py-2 pr-4 text-white">{u.name}</td>
                  <td className="py-2 pr-4 text-gray-400 truncate max-w-[180px]">
                    {u.email}
                  </td>
                  <td className="py-2 pr-4 text-right text-gray-200">
                    {u.bottles_submitted}
                  </td>
                  <td className="py-2 text-right text-emerald-400 font-semibold">
                    {u.credits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

const Dashboard = () => {
  const { connected, detection, binStatus, systemStatus } = useSocket();

  return (
    <div className="min-h-screen bg-darker text-white">
      {/* Header */}
      <header className="bg-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Cpu className="w-8 h-8 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">Smart AI Bin</h1>
                <p className="text-sm text-gray-400">Real-time Waste Segregation System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {connected ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-400">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-400">Disconnected</span>
                  </>
                )}
              </div>

              <button
                onClick={() => window.location.href = '/redeem'}
                className="bg-primary text-dark font-bold px-6 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                <span>Redeem Points</span>
              </button>

              <motion.div
                className="px-4 py-2 bg-primary/10 border border-primary rounded-full"
                animate={{ borderColor: ['#00ff88', '#00ff8840', '#00ff88'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm font-medium text-primary">LIVE</span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <LiveFeed detection={detection} />
            <DetectionCard detection={detection} />
            <StatsPanel detection={detection} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BinStatus 
              binStatus={binStatus} 
              destination={detection?.destination}
            />
            <ProcessingChamber detection={detection} />
          </div>
        </div>

        {/* System Status */}
        {systemStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-card border border-gray-800 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Status</p>
                <p className="text-white font-medium capitalize">{systemStatus.status}</p>
              </div>
              {systemStatus.message && (
                <p className="text-sm text-gray-400">{systemStatus.message}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Rewards / Users Summary */}
        <RewardsSummary />
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-6 text-center text-gray-500 text-sm">
        <p>Smart AI Waste Segregation System • Edge AI + IoT Dashboard</p>
      </footer>
    </div>
  );
};

export default Dashboard;
