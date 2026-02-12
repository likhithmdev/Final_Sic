import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rewardsAPI } from '../utils/api';
import { Gift, ShoppingCart, Coins, X, CheckCircle, AlertCircle } from 'lucide-react';

const REWARD_ITEMS = [
  {
    id: 1,
    name: 'Amazon Gift Card',
    cost: 500,
    icon: '🎁',
    description: '₹100 Amazon voucher',
    category: 'vouchers'
  },
  {
    id: 2,
    name: 'Flipkart Voucher',
    cost: 500,
    icon: '🛍️',
    description: '₹100 shopping credit',
    category: 'vouchers'
  },
  {
    id: 3,
    name: 'Reusable Water Bottle',
    cost: 800,
    icon: '💧',
    description: 'Eco-friendly steel bottle',
    category: 'products'
  },
  {
    id: 4,
    name: 'Tote Bag',
    cost: 600,
    icon: '👜',
    description: 'Sustainable cotton bag',
    category: 'products'
  },
  {
    id: 5,
    name: 'Plant Seedlings',
    cost: 300,
    icon: '🌱',
    description: '5 plant seeds pack',
    category: 'eco'
  },
  {
    id: 6,
    name: 'Bamboo Cutlery Set',
    cost: 700,
    icon: '🥢',
    description: 'Reusable cutlery kit',
    category: 'products'
  },
  {
    id: 7,
    name: 'Netflix 1 Month',
    cost: 1000,
    icon: '📺',
    description: 'Entertainment subscription',
    category: 'subscriptions'
  },
  {
    id: 8,
    name: 'Zomato Gold',
    cost: 800,
    icon: '🍔',
    description: '1 month membership',
    category: 'subscriptions'
  },
  {
    id: 9,
    name: 'Phone Accessories',
    cost: 400,
    icon: '📱',
    description: 'Cable & screen guard',
    category: 'tech'
  },
  {
    id: 10,
    name: 'Stationery Pack',
    cost: 250,
    icon: '📝',
    description: 'Eco-friendly supplies',
    category: 'products'
  },
  {
    id: 11,
    name: 'Headphones',
    cost: 1500,
    icon: '🎧',
    description: 'Wireless earbuds',
    category: 'tech'
  },
  {
    id: 12,
    name: 'Fitness Tracker',
    cost: 2000,
    icon: '⌚',
    description: 'Smart band',
    category: 'tech'
  }
];

const Store = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRedeem = async (item) => {
    if (user.credits < item.cost) {
      setError('Insufficient credits');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSelectedItem(item);
  };

  const confirmRedeem = async () => {
    if (!selectedItem) return;

    setRedeeming(true);
    
    try {
      const response = await rewardsAPI.redeemItem({
        item_name: selectedItem.name,
        item_cost: selectedItem.cost,
        quantity: 1
      });

      if (response.data.success) {
        updateUser({ credits: response.data.remaining_credits });
        setSelectedItem(null);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Redemption failed');
      setTimeout(() => setError(''), 3000);
    }
    
    setRedeeming(false);
  };

  return (
    <div className="min-h-screen bg-darker overflow-hidden">
      {/* Header */}
      <header className="bg-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Gift className="w-7 h-7 text-primary" />
              Rewards Store
            </h1>
            <p className="text-sm text-gray-400">Redeem your credits for amazing rewards</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 border border-primary rounded-full px-5 py-2.5">
              <Coins className="w-5 h-5 text-primary inline mr-2" />
              <span className="text-primary font-bold text-xl">{user?.credits || 0}</span>
              <span className="text-gray-400 ml-2 text-sm">Credits</span>
            </div>

            <button
              onClick={() => navigate('/redeem')}
              className="bg-card border border-gray-700 rounded-full px-4 py-2 text-white hover:border-primary transition-colors"
            >
              Back to Redeem
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-96px)] overflow-y-auto">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
          {REWARD_ITEMS.map((item, index) => {
            const canAfford = user?.credits >= item.cost;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  canAfford
                    ? 'border-gray-800 hover:border-primary hover:shadow-lg hover:shadow-primary/20'
                    : 'border-gray-800/50 opacity-60'
                }`}
                onClick={() => canAfford && handleRedeem(item)}
              >
                <div className="text-5xl mb-3 text-center">{item.icon}</div>
                <h3 className="font-bold text-white text-center mb-1 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-400 text-center mb-3">{item.description}</p>
                
                <div className="flex items-center justify-center gap-1 text-primary font-bold">
                  <Coins className="w-4 h-4" />
                  <span>{item.cost}</span>
                </div>

                {!canAfford && (
                  <p className="text-xs text-red-500 text-center mt-2">Insufficient credits</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => !redeeming && setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl p-6 max-w-md w-full border border-gray-800"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedItem.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.name}</h3>
                <p className="text-gray-400 mb-6">{selectedItem.description}</p>

                <div className="bg-darker rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-primary font-bold flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      {selectedItem.cost}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">After redemption:</span>
                    <span className="text-white font-bold">
                      {user.credits - selectedItem.cost} credits
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedItem(null)}
                    disabled={redeeming}
                    className="flex-1 bg-darker text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRedeem}
                    disabled={redeeming}
                    className="flex-1 bg-primary text-dark font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {redeeming ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full"
                        />
                        <span>Redeeming...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Confirm</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-card rounded-xl p-8 text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Redeemed!</h3>
              <p className="text-gray-400">Your reward will be delivered soon</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Store;
