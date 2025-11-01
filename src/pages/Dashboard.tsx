import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '@/api/client';
import { Wallet, DollarSign, Zap, TrendingUp, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance] = useState(1250.50);
  const [stats, setStats] = useState({ monthly: 0, transactions: 0, channels: 3 });
  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await paymentAPI.getHistory({ limit: 5 });
      const transfers = response.data.transfers || [];
      
      setRecentTransfers(transfers);
      
      const monthlyTotal = transfers.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      
      setStats({
        monthly: monthlyTotal,
        transactions: transfers.length,
        channels: 3,
      });
    } catch (error) {
      console.error('Failed to load dashboard', error);
      setRecentTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADDED: Helper function to safely format recipient
  const formatRecipient = (recipient: any): string => {
    if (!recipient || typeof recipient !== 'string' || recipient.length === 0) {
      return 'Unknown';
    }
    if (recipient.length > 30) {
      return recipient.substring(0, 30) + '...';
    }
    return recipient;
  };

  const getStatusIcon = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50';
      case 'FAILED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.userId}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-blue-100 text-sm">Available Balance</span>
          <Wallet className="w-6 h-6 text-blue-100" />
        </div>
        <div className="text-4xl font-bold mb-2">£{balance.toFixed(2)}</div>
        <div className="text-sm text-blue-100 font-mono break-all">
          {user?.zkHash}
        </div>
        <button
          onClick={() => navigate('/send')}
          className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">This Month</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">£{stats.monthly.toFixed(2)}</div>
          <div className="text-sm text-green-600 mt-1">
            {stats.transactions > 0 ? `${stats.transactions} transactions` : 'No transactions yet'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Transactions</span>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.transactions}</div>
          <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Channels</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.channels}</div>
          <div className="text-sm text-gray-500 mt-1">Active channels</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button 
            onClick={() => navigate('/history')}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        
        {recentTransfers.length > 0 ? (
          <div className="space-y-3">
            {recentTransfers.map((transfer: any) => (
              <div
                key={transfer.transferId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(transfer.status)}`}>
                    {getStatusIcon(transfer.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transfer.railType || 'Transfer'}
                    </div>
                    {/* ✅ FIXED LINE - Safe recipient formatting */}
                    <div className="text-sm text-gray-500 font-mono">
                      To: {formatRecipient(transfer.to)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">-£{transfer.amount?.toFixed(2)}</div>
                  <div className={`text-xs px-2 py-1 rounded ${getStatusColor(transfer.status)}`}>
                    {getStatusText(transfer.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No recent transfers</p>
            <button
              onClick={() => navigate('/send')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Your First Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}