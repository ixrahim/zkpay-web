import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentAPI } from '@/api/client';
import { Wallet, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [balance] = useState(1250.50);
  const [stats, setStats] = useState({ monthly: 0, transactions: 0, channels: 0 });
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await paymentAPI.getHistory({ limit: 5 });
      setRecentTransfers(response.data.transfers || []);
      setStats({
        monthly: 450,
        transactions: response.data.transfers?.length || 0,
        channels: 3,
      });
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.userId}</p>
      </div>

      <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-100">Available Balance</span>
          <Wallet className="w-6 h-6" />
        </div>
        <div className="text-4xl font-bold mb-2">£{balance.toFixed(2)}</div>
        <div className="text-sm text-blue-100 font-mono">
          {user?.zkHash?.substring(0, 35)}...
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">This Month</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">£{stats.monthly.toFixed(2)}</div>
          <div className="text-sm text-green-600 mt-1">+12% from last month</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Transactions</span>
            <Zap className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.transactions}</div>
          <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Channels</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.channels}</div>
          <div className="text-sm text-gray-500 mt-1">All active</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        {recentTransfers.length > 0 ? (
          <div className="space-y-3">
            {recentTransfers.map((transfer: any) => (
              <div
                key={transfer.transferId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{transfer.railType}</div>
                  <div className="text-sm text-gray-500">
                    To: {transfer.to?.substring(0, 25)}...
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">-£{transfer.amount}</div>
                  <div className="text-xs text-gray-500">{transfer.state}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent transfers</p>
        )}
      </div>
    </div>
  );
}
