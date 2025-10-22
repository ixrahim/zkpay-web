import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentAPI } from '@/api/client';
import { toast } from 'sonner';
import { Send, Check, Lock, Clock } from 'lucide-react';
import { RouteOption } from '@/types';

export default function SendPayment() {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEstimate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setEstimating(true);
    try {
      const response = await paymentAPI.estimateRoutes({
        from: user!.zkHash,
        to: recipient,
        amount: parseFloat(amount),
      });
      setRoutes(response.data.routes);
      setSelectedRoute(response.data.routes[0]);
    } catch (error) {
      toast.error('Failed to estimate routes');
    } finally {
      setEstimating(false);
    }
  };

  const handleSend = async () => {
    if (!recipient || !amount || !selectedRoute) return;

    setLoading(true);
    try {
      await paymentAPI.send({
        from: user!.zkHash,
        to: recipient,
        amount: parseFloat(amount),
      });
      toast.success('Payment sent successfully!');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setRecipient('');
        setAmount('');
        setRoutes([]);
        setSelectedRoute(null);
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Sent!</h2>
          <p className="text-gray-600">Your payment was processed successfully</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Send Payment</h1>
        <p className="text-gray-600 mt-1">Transfer funds instantly</p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient zkHash
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="input"
            placeholder="zkpay://uk/xyz789ghi0123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (GBP)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={handleEstimate}
            className="input"
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
        </div>

        {estimating && (
          <div className="text-center py-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full" />
            <p className="text-sm text-gray-600 mt-2">Estimating routes...</p>
          </div>
        )}

        {routes.length > 0 && !estimating && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Select Route</label>
            {routes.map((route) => (
              <button
                key={route.type}
                onClick={() => setSelectedRoute(route)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRoute?.type === route.type
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{route.type}</span>
                  {route.recommended && (
                    <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Cost: £{route.estimatedCost.toFixed(2)}</span>
                  <span>•</span>
                  <span>
                    {route.estimatedTime === 0
                      ? 'Instant'
                      : `~${Math.round(route.estimatedTime / 1000)}s`}
                  </span>
                  {route.privacy && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!recipient || !amount || !selectedRoute || loading}
          className="btn btn-primary w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Sending...' : 'Send Payment'}
        </button>
      </div>
    </div>
  );
}
