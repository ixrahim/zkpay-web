// src/pages/Pots.tsx

import { useState, useEffect } from 'react';
import { potsAPI } from '@/api/client';
import { Pot, PotStats, PotTransaction } from '@/types';
import { 
  PiggyBank, 
  Plus, 
  TrendingUp, 
  Target,
  ArrowDownCircle,
  ArrowUpCircle,
  X,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export default function Pots() {
  const [pots, setPots] = useState<Pot[]>([]);
  const [stats, setStats] = useState<PotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);

  useEffect(() => {
    loadPots();
    loadStats();
  }, []);

  const loadPots = async () => {
    try {
      setLoading(true);
      const response = await potsAPI.getAll();
      setPots(response.data.pots || []);
    } catch (error) {
      console.error('Failed to load pots', error);
      toast.error('Failed to load pots');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await potsAPI.getStats();
      setStats(response.data.statistics);
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  if (loading && pots.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading pots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Pots</h1>
          <p className="text-gray-600 mt-1">Track your savings goals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Pot
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Saved</span>
              <PiggyBank className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">£{stats.totalSaved.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Active Pots</span>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activePots}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Completed</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completedPots}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Goals</span>
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">£{stats.totalTargets.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pots.length > 0 ? (
          pots.map((pot) => (
            <div
              key={pot.id}
              onClick={() => setSelectedPot(pot)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              style={{ borderTopColor: pot.color, borderTopWidth: '4px' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{pot.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{pot.name}</h3>
                    {pot.status === 'completed' && (
                      <span className="text-xs text-green-600 font-medium">✓ Goal Reached!</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{pot.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min(pot.progressPercentage || 0, 100)}%`,
                      backgroundColor: pot.color
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    £{pot.currentAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    of £{pot.targetAmount.toFixed(2)}
                  </div>
                </div>
                {pot.deadline && pot.daysRemaining !== undefined && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      {pot.daysRemaining} days
                    </div>
                    <div className="text-xs text-gray-500">remaining</div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <PiggyBank className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pots yet</h3>
            <p className="text-gray-600 mb-4">Create your first savings pot to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Pot
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePotModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadPots();
            loadStats();
          }}
        />
      )}

      {selectedPot && (
        <PotDetailsModal
          pot={selectedPot}
          onClose={() => setSelectedPot(null)}
          onUpdate={() => {
            loadPots();
            loadStats();
          }}
        />
      )}
    </div>
  );
}

// Create Pot Modal
function CreatePotModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [emoji, setEmoji] = useState('💰');
  const [color, setColor] = useState('#2563eb');
  const [loading, setLoading] = useState(false);

  const emojis = ['💰', '✈️', '🏠', '🚗', '🎓', '💍', '🎁', '📱', '🎮', '🏖️'];
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await potsAPI.create({
        name,
        targetAmount: parseFloat(targetAmount),
        deadline: deadline || undefined,
        emoji,
        color,
      });
      toast.success('Pot created!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create pot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Savings Pot</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pot Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Holiday Fund"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (£) *</label>
            <input
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose an Emoji</label>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-3xl p-3 rounded-lg border-2 transition-colors ${
                    emoji === e ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Color</label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    color === c ? 'border-gray-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Pot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Pot Details Modal
function PotDetailsModal({ 
  pot, 
  onClose, 
  onUpdate 
}: { 
  pot: Pot; 
  onClose: () => void; 
  onUpdate: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      await potsAPI.deposit(pot.id, parseFloat(amount), note || undefined);
      toast.success('Deposited successfully!');
      setAmount('');
      setNote('');
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      await potsAPI.withdraw(pot.id, parseFloat(amount), note || undefined);
      toast.success('Withdrawn successfully!');
      setAmount('');
      setNote('');
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{pot.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{pot.name}</h2>
              {pot.status === 'completed' && (
                <span className="text-sm text-green-600 font-medium">✓ Goal Reached!</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-bold text-gray-900">{pot.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full"
              style={{ 
                width: `${Math.min(pot.progressPercentage || 0, 100)}%`,
                backgroundColor: pot.color
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>£{pot.currentAmount.toFixed(2)}</span>
            <span>£{pot.targetAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (£)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Monthly savings"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDeposit}
              disabled={loading || pot.status === 'completed'}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              <ArrowDownCircle className="w-5 h-5 mr-2" />
              Deposit
            </button>
            <button
              onClick={handleWithdraw}
              disabled={loading || pot.currentAmount === 0}
              className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
            >
              <ArrowUpCircle className="w-5 h-5 mr-2" />
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}