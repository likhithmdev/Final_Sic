import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { rewardsAPI, authAPI } from '../utils/api';
import { Gift, TrendingUp, MapPin, LogOut, CheckCircle } from 'lucide-react';

const RedeemPoints = () => {
  const { user, updateUser } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastCredit, setLastCredit] = useState(null);

  useEffect(() => {
    rewardsAPI.getCheckInStatus()
      .then(res => setCheckedIn(res.data.checked_in))
      .catch(() => setCheckedIn(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onCredit = (data) => {
      if (data.user_id === user?.id) {
        authAPI.getMe().then(res => {
          updateUser(res.data.user);
          setLastCredit({ waste_type: data.waste_type, credits: data.credits });
          setTimeout(() => setLastCredit(null), 4000);
        });
      }
    };
    socket.on('creditUpdate', onCredit);
    return () => socket.off('creditUpdate', onCredit);
  }, [socket, user?.id, updateUser]);

  const handleCheckIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await rewardsAPI.checkIn();
      setCheckedIn(true);
    } catch (err) {
      alert('Failed to check in. Please try again.');
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await rewardsAPI.checkOut();
      setCheckedIn(false);
    } catch (err) {
      alert('Failed to check out. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-darker overflow-hidden">
      <header className="bg-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Earn Points</h1>
            <p className="text-sm text-gray-400">Check in at the bin, then dispose plastic or e-waste to earn credits</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 border border-primary rounded-full px-4 py-2">
              <span className="text-primary font-bold text-lg">{user?.credits ?? 0}</span>
              <span className="text-gray-400 ml-2 text-sm">Credits</span>
            </div>
            <button
              onClick={() => navigate('/store')}
              className="bg-card border border-gray-700 rounded-full px-4 py-2 text-white hover:border-primary transition-colors flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>Store</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Check-in Section */}
          <div className="bg-card rounded-xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white">Check in at the bin</h2>
            </div>

            {checkedIn ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary rounded-lg">
                  <CheckCircle className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">You&apos;re checked in</p>
                    <p className="text-sm text-gray-400">Dispose plastic or e-waste in the bin to earn points automatically</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>• Plastic / Dry waste → <span className="text-primary font-semibold">+5 credits</span></p>
                  <p>• E-waste → <span className="text-primary font-semibold">+10 credits</span></p>
                  <p>• Wet waste → no credits</p>
                </div>
                <button
                  onClick={handleCheckOut}
                  disabled={loading}
                  className="w-full py-3 bg-darker border border-gray-700 rounded-lg text-white hover:border-gray-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : 'Check out'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-400">Scan the QR on the bin, log in, then tap below before disposing trash.</p>
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="w-full py-4 bg-primary text-dark font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Please wait...' : (
                    <>
                      <MapPin className="w-5 h-5" />
                      Check in to bin
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-white">Your stats</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-darker rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Total credits</p>
                  <p className="text-3xl font-bold text-primary">{user?.credits ?? 0}</p>
                </div>
                <div className="bg-darker rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Items disposed</p>
                  <p className="text-3xl font-bold text-white">{user?.bottles_submitted ?? 0}</p>
                </div>
                <div className="bg-darker rounded-lg p-4 col-span-2">
                  <p className="text-gray-400 text-sm mb-1">Total earned (lifetime)</p>
                  <p className="text-3xl font-bold text-green-500">{user?.total_earned ?? 0}</p>
                </div>
              </div>
            </div>

            {lastCredit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-primary/20 border border-primary rounded-lg"
              >
                <p className="text-primary font-semibold">
                  +{lastCredit.waste_type === 'electronic' ? 10 : 5} credits for {lastCredit.waste_type} waste
                </p>
                <p className="text-sm text-gray-400">Total: {lastCredit.credits} credits</p>
              </motion.div>
            )}

            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/50 p-6">
              <h3 className="text-lg font-bold text-white mb-3">How it works</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-dark flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <p>Check in at the bin (tap the button above)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-dark flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <p>Dispose plastic or e-waste in the Smart AI Bin</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-dark flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <p>Points are credited automatically when the bin segregates your waste</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RedeemPoints;
