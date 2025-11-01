import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { paymentAPI } from '@/api/client';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2
} from 'lucide-react';

interface Transfer {
  transferId: string;
  from: string | any; // ✅ Can be string or object
  to: string | any;   // ✅ Can be string or object
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'INITIATING' | 'EXECUTING';
  railType?: string;
  displayName?: string;
  cost?: number;
  receivedAmount?: number;
  instant?: boolean;
  features?: any;
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
}

const MOCK_TRANSFERS: Transfer[] = [
  {
    transferId: 'mock_1',
    from: 'zkpay://uk/abc123',
    to: 'zkpay://uk/xyz789',
    amount: 50.00,
    status: 'COMPLETED',
    railType: 'CHANNEL',
    displayName: 'Channel Rail',
    instant: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    transferId: 'mock_2',
    from: 'zkpay://uk/def456',
    to: 'zkpay://uk/abc123',
    amount: 125.50,
    status: 'COMPLETED',
    railType: 'STABLECOIN',
    displayName: 'Stablecoin Rail',
    instant: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86300000).toISOString(),
  },
  {
    transferId: 'mock_3',
    from: 'zkpay://uk/abc123',
    to: 'zkpay://uk/ghi012',
    amount: 75.25,
    status: 'PENDING',
    railType: 'TRADITIONAL',
    displayName: 'Traditional Rail',
    instant: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    transferId: 'mock_4',
    from: 'zkpay://uk/abc123',
    to: 'zkpay://uk/jkl345',
    amount: 200.00,
    status: 'COMPLETED',
    railType: 'STABLECOIN',
    displayName: 'Stablecoin Rail',
    instant: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 172700000).toISOString(),
  },
];

export default function History() {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>(MOCK_TRANSFERS);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>(MOCK_TRANSFERS);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterTransfers();
  }, [transfers, filter, searchTerm]);

  const loadHistory = async () => {
    try {
      const response = await paymentAPI.getHistory({ limit: 50 });
      const realTransfers = response.data.transfers || [];

      if (realTransfers.length > 0) {
        console.log('[History] Loaded real transfers:', realTransfers.length);
        setTransfers(realTransfers);
        setUseMockData(false);
      } else {
        console.log('[History] No real transfers, using mock data');
        setUseMockData(true);
      }
    } catch (error) {
      console.error('[History] Failed to load transfers:', error);
      console.log('[History] Error loading, using mock data');
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Helper to format recipient (handles both object and string)
  const formatRecipient = (recipient: any): string => {
    if (!recipient) return 'Unknown';

    // If it's an object
    if (typeof recipient === 'object' && recipient !== null) {
      const display = recipient.displayName || recipient.username || recipient.zkHash;
      if (!display) return 'Unknown';
      
      // Format zkHash
      if (typeof display === 'string' && display.startsWith('zk') && display.length > 25) {
        return `${display.substring(0, 15)}...${display.substring(display.length - 6)}`;
      }
      
      return String(display);
    }

    // If it's a string
    if (typeof recipient === 'string') {
      if (recipient.length === 0) return 'Unknown';
      
      // Format zkHash
      if (recipient.startsWith('zk') && recipient.length > 25) {
        return `${recipient.substring(0, 15)}...${recipient.substring(recipient.length - 6)}`;
      }
      
      // Truncate long strings
      return recipient.length > 30 
        ? recipient.substring(0, 30) + '...'
        : recipient;
    }

    return 'Unknown';
  };

  // ✅ NEW: Helper to get raw string value for filtering
  const getRecipientString = (recipient: any): string => {
    if (!recipient) return '';
    if (typeof recipient === 'string') return recipient;
    if (typeof recipient === 'object') {
      return recipient.zkHash || recipient.username || recipient.displayName || '';
    }
    return '';
  };

  const filterTransfers = () => {
    let filtered = [...transfers];

    // Filter by status
    if (filter !== 'ALL') {
      filtered = filtered.filter((t) => t.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((t) => {
        const searchLower = searchTerm.toLowerCase();
        const toStr = getRecipientString(t.to).toLowerCase();
        const fromStr = getRecipientString(t.from).toLowerCase();
        
        return (
          t.transferId.toLowerCase().includes(searchLower) ||
          toStr.includes(searchLower) ||
          fromStr.includes(searchLower)
        );
      });
    }

    setFilteredTransfers(filtered);
  };

  const getStatusIcon = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
      case 'INITIATING':
      case 'ROUTING':
      case 'EXECUTING':
      case 'CONFIRMING':
      case 'RETRYING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
      case 'INITIATING':
      case 'ROUTING':
      case 'EXECUTING':
      case 'CONFIRMING':
      case 'RETRYING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOutgoing = (transfer: Transfer) => {
    const fromStr = getRecipientString(transfer.from);
    return fromStr === user?.zkHash;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-1">
          {useMockData ? 'Showing example transactions' : 'Your recent transfers'}
        </p>
      </div>

      {/* Mock Data Banner */}
      {useMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Loader2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>Preview Mode:</strong> These are example transactions. 
                Send your first payment to see real transaction history!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID or zkHash..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transfers List */}
      {loading && !useMockData ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Loading transfers...</p>
          </div>
        </div>
      ) : filteredTransfers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transfers found</h3>
          <p className="text-gray-600">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransfers.map((transfer) => (
            <button
              key={transfer.transferId}
              onClick={() => setSelectedTransfer(transfer)}
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Direction Icon */}
                  <div className={`p-3 rounded-lg ${
                    isOutgoing(transfer) ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    {isOutgoing(transfer) ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    )}
                  </div>

                  {/* Transfer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {isOutgoing(transfer) ? 'Sent' : 'Received'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transfer.status)}`}>
                        {getStatusText(transfer.status)}
                      </span>
                      {transfer.railType && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {transfer.railType}
                        </span>
                      )}
                    </div>
                    {/* ✅ FIXED: Use formatRecipient helper */}
                    <div className="text-sm text-gray-600 font-mono truncate">
                      {isOutgoing(transfer) ? 'To: ' : 'From: '}
                      {formatRecipient(isOutgoing(transfer) ? transfer.to : transfer.from)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(transfer.createdAt)}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      isOutgoing(transfer) ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isOutgoing(transfer) ? '-' : '+'}£{transfer.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Transfer Detail Modal */}
      {selectedTransfer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTransfer(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Transfer Details</h3>
              <button
                onClick={() => setSelectedTransfer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Transfer ID</label>
                <div className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1 break-all">
                  {selectedTransfer.transferId}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(selectedTransfer.status)}
                  <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(selectedTransfer.status)}`}>
                    {getStatusText(selectedTransfer.status)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Amount</label>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  £{selectedTransfer.amount.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">From</label>
                {/* ✅ FIXED: Use formatRecipient helper */}
                <div className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1 break-all">
                  {formatRecipient(selectedTransfer.from)}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">To</label>
                {/* ✅ FIXED: Use formatRecipient helper */}
                <div className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1 break-all">
                  {formatRecipient(selectedTransfer.to)}
                </div>
              </div>

              {selectedTransfer.railType && (
                <div>
                  <label className="text-sm text-gray-600">Payment Method</label>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {selectedTransfer.railType}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600">Created</label>
                <div className="text-sm text-gray-900 mt-1">
                  {new Date(selectedTransfer.createdAt).toLocaleString()}
                </div>
              </div>

              {selectedTransfer.completedAt && (
                <div>
                  <label className="text-sm text-gray-600">Completed</label>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(selectedTransfer.completedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTransfer(null)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}