import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentAPI, identityAPI } from '@/api/client';
import { toast } from 'sonner';
import { Send, Check, Lock, Zap, DollarSign, AtSign, X } from 'lucide-react';
import { RouteOption, UserSearchResult } from '@/types';

export default function SendPayment() {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ NEW: User search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  // ✅ NEW: Search users as they type
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const cleanQuery = searchQuery.startsWith('@') ? searchQuery.substring(1) : searchQuery;
        const response = await identityAPI.searchUsers(cleanQuery, 10);
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ NEW: Handle user selection from search
  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setRecipient(`@${user.username}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  // ✅ NEW: Clear selected user
  const handleClearUser = () => {
    setSelectedUser(null);
    setRecipient('');
  };

  // Auto-estimate when amount and recipient are filled
  useEffect(() => {
    if (recipient && amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => {
        handleEstimate();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [recipient, amount]);

  const handleEstimate = async () => {
    if (!amount || parseFloat(amount) <= 0 || !recipient) return;

    setEstimating(true);
    try {
      // ✅ UPDATED: Can now send @username or zkHash
      const fromIdentifier = user?.username ? `@${user.username}` : user!.zkHash;
      
      // ✅ Call backend /api/payments/estimate
      const response = await paymentAPI.estimateRoutes({
        from: fromIdentifier,
        to: recipient,
        amount: parseFloat(amount),
      });
      
      // ✅ Backend returns: { routes: RouteOption[] }
      const estimatedRoutes = (response.data.routes || []).map((route: any) => ({
        type: route.type,
        estimatedCost: route.cost || route.estimatedCost || 0,
        estimatedTime: route.estimatedTime || 0,
        reliability: route.reliability || 1,
        privacy: route.privacy || false,
        recommended: route.recommended || false,
        description: route.description || '',
      }));
      
      setRoutes(estimatedRoutes);
      
      // Auto-select recommended route
      const recommended = estimatedRoutes.find((r: RouteOption) => r.recommended) || estimatedRoutes[0];
      setSelectedRoute(recommended);
    } catch (error: any) {
      console.error('Failed to estimate routes:', error);
      toast.error('Failed to estimate routes');
      setRoutes([]);
      setSelectedRoute(null);
    } finally {
      setEstimating(false);
    }
  };

  const handleSend = async () => {
    if (!recipient || !amount || !selectedRoute) {
      toast.error('Please fill all fields and select a route');
      return;
    }

    setLoading(true);
    
    // ✅ UPDATED: Can now use @username
    const fromIdentifier = user?.username ? `@${user.username}` : user!.zkHash;
    
    console.log('[SendPayment] Sending payment:', {
      from: fromIdentifier,
      to: recipient,
      amount: parseFloat(amount),
      preferences: { routeType: selectedRoute.type }
    });

    try {
      // ✅ Call backend /api/payments/send
      const response = await paymentAPI.send({
        from: fromIdentifier,
        to: recipient,
        amount: parseFloat(amount),
        preferences: {
          routeType: selectedRoute.type,
        },
      });
      
      console.log('[SendPayment] Success response:', response.data);
      
      toast.success('Payment sent successfully!');
      setSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setRecipient('');
        setAmount('');
        setRoutes([]);
        setSelectedRoute(null);
        setSelectedUser(null); // ✅ NEW: Clear selected user
      }, 3000);
    } catch (error: any) {
      console.error('[SendPayment] Error:', error);
      console.error('[SendPayment] Error response:', error.response?.data);
      
      const message = error.response?.data?.error || error.response?.data?.message || 'Payment failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'CHANNEL':
        return <Zap className="w-5 h-5" />;
      case 'STABLECOIN':
        return <Lock className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Sent!</h2>
          <p className="text-gray-600 mb-4">Your payment was processed successfully</p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">£{amount}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">To:</span>
              <span className="font-semibold">{recipient}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Route:</span>
              <span className="font-semibold">{selectedRoute?.type}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Send Payment</h1>
        <p className="text-gray-600 mt-1">Transfer funds securely and privately</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="bg-gray-50 rounded-lg p-3">
            {/* ✅ NEW: Show username if available */}
            {user?.username && (
              <div className="text-sm text-gray-600 mb-1">@{user.username}</div>
            )}
            <div className="text-sm text-gray-600 mb-1">{user?.username ? 'zkHash:' : 'Your zkHash'}</div>
            <div className="font-mono text-sm text-gray-900 break-all">{user?.zkHash}</div>
          </div>
        </div>

        {/* ✅ NEW: Recipient - Search or Manual Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send to
          </label>
          
          {/* Selected User Card */}
          {selectedUser ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedUser.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{selectedUser.displayName}</span>
                    {selectedUser.verified && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600">@{selectedUser.username}</span>
                </div>
              </div>
              <button
                onClick={handleClearUser}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search username..."
                />
                {searchLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.username}
                      onClick={() => handleSelectUser(result)}
                      className="w-full p-3 hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {result.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{result.displayName}</span>
                          {result.verified && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600">@{result.username}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Manual Input Option */}
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Or enter zkHash manually:</div>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="zkpay://uk/xyz789ghi0123456 or @username"
                />
              </div>
            </>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (GBP)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">£</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        {/* Estimating Routes */}
        {estimating && (
          <div className="text-center py-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3" />
            <p className="text-sm text-gray-600">Estimating best routes...</p>
          </div>
        )}

        {/* Route Selection */}
        {routes.length > 0 && !estimating && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Payment Route
            </label>
            {routes.map((route) => (
              <button
                key={route.type}
                onClick={() => setSelectedRoute(route)}
                className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                  selectedRoute?.type === route.type
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedRoute?.type === route.type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getRouteIcon(route.type)}
                    </div>
                    <span className="font-semibold text-gray-900">{route.type}</span>
                  </div>
                  {route.recommended && (
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Cost</div>
                    <div className="font-semibold">£{(route.estimatedCost || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Time</div>
                    <div className="font-semibold">
                      {(route.estimatedTime || 0) === 0
                        ? 'Instant'
                        : `~${Math.round((route.estimatedTime || 0) / 1000)}s`}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Privacy</div>
                    <div className="font-semibold">
                      {route.privacy ? (
                        <span className="flex items-center text-green-600">
                          <Lock className="w-4 h-4 mr-1" />
                          Private
                        </span>
                      ) : (
                        <span className="text-gray-600">Standard</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!recipient || !amount || !selectedRoute || loading || estimating}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>{loading ? 'Sending...' : 'Send Payment'}</span>
        </button>
      </div>
    </div>
  );
}