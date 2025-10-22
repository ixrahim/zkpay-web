import { useState, useEffect } from 'react';
import { paymentAPI } from '@/api/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Zap, Clock, Check } from 'lucide-react';

export default function History() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await paymentAPI.getHistory({ limit: 20 });
      setTransfers(response.data.transfers || []);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading history..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1">View all your transactions</p>
      </div>

      {transfers.length > 0 ? (
        <div className="card divide-y divide-gray-200">
          {transfers.map((transfer: any) => (
            <div key={transfer.transferId} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {transfer.instant ? (
                      <Zap className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transfer.railType || 'Transfer'}
                    </div>
                    <div className="text-sm text-gray-500">
                      To: {transfer.to?.substring(0, 25)}...
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">£{transfer.amount}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(transfer.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    transfer.state === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {transfer.state}
                </span>
                <span className="text-gray-500">ID: {transfer.transferId}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Check className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers yet</h3>
          <p className="text-gray-600">Your payment history will appear here</p>
        </div>
      )}
    </div>
  );
}
