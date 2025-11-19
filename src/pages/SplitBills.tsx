// src/pages/SplitBills.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { splitBillsAPI, identityAPI } from '@/api/client';
import { SplitBill, SplitBillStats, UserSearchResult } from '@/types';
import { 
  Users, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function SplitBills() {
  const { user } = useAuth();
  const [bills, setBills] = useState<SplitBill[]>([]);
  const [stats, setStats] = useState<SplitBillStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadBills();
    loadStats();
  }, [filter]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const response = await splitBillsAPI.getAll(
        filter === 'all' ? undefined : filter
      );
      setBills(response.data.bills || []);
    } catch (error) {
      console.error('Failed to load bills', error);
      toast.error('Failed to load split bills');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await splitBillsAPI.getStats();
      setStats(response.data.statistics);
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const handlePayBill = async (billId: string) => {
    try {
      await splitBillsAPI.pay(billId);
      toast.success('Payment successful!');
      loadBills();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Payment failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading && bills.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading split bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Split Bills</h1>
          <p className="text-gray-600 mt-1">Manage group expenses</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Split Bill
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Bills</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBills}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Pending</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingBills}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">You Owe</span>
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              £{stats.totalOwed.toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Owed to You</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              £{stats.totalReceivable.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Bills
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Bills List */}
      <div className="space-y-4">
        {bills.length > 0 ? (
          bills.map((bill) => {
            const isCreator = bill.creatorId === user?.userId;
            // const myParticipation = bill.participants.find(
            //   (p) => p.userId === user?.userId
            // );

            return (
              <div
                key={bill.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-gray-900">{bill.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center space-x-1 ${getStatusBadge(bill.status)}`}>
                        {getStatusIcon(bill.status)}
                        <span className="ml-1">{bill.status}</span>
                      </span>
                    </div>
                    {bill.description && (
                      <p className="text-sm text-gray-600 mt-1">{bill.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Created {new Date(bill.createdAt).toLocaleDateString()}
                      {isCreator && <span className="ml-2 text-blue-600 font-medium">(You created this)</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      £{bill.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bill.participants.length} participants
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-2">
                  {bill.participants.map((participant) => (
                    <div
                      key={participant.userId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          participant.status === 'paid' ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          {participant.status === 'paid' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            @{participant.username}
                            {participant.userId === user?.userId && (
                              <span className="ml-2 text-xs text-blue-600">(You)</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {participant.status === 'paid' 
                              ? `Paid ${new Date(participant.paidAt!).toLocaleDateString()}`
                              : 'Not paid yet'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          £{participant.amountOwed.toFixed(2)}
                        </div>
                        {participant.userId === user?.userId && 
                         participant.status === 'pending' && 
                         bill.status === 'pending' && (
                          <button
                            onClick={() => handlePayBill(bill.id)}
                            className="mt-1 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No split bills yet</h3>
            <p className="text-gray-600 mb-4">Create your first split bill to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Split Bill
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateBillModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadBills();
            loadStats();
          }}
        />
      )}
    </div>
  );
}

// Create Bill Modal Component
function CreateBillModal({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await identityAPI.searchUsers(query);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  const addParticipant = (username: string) => {
    if (!participants.includes(username)) {
      setParticipants([...participants, username]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const removeParticipant = (username: string) => {
    setParticipants(participants.filter((p) => p !== username));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !totalAmount || participants.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await splitBillsAPI.create({
        title,
        totalAmount: parseFloat(totalAmount),
        participants: participants.map((username) => ({ username })),
        description: description || undefined,
      });
      toast.success('Split bill created!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create split bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Split Bill</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Dinner"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount (£) *
            </label>
            <input
              type="number"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="120.50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Italian restaurant"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Participants *
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                placeholder="Search by username..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.username}
                      type="button"
                      onClick={() => addParticipant(result.username)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">@{result.username}</div>
                        <div className="text-sm text-gray-500">{result.displayName}</div>
                      </div>
                      {result.verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {participants.length > 0 && (
              <div className="mt-3 space-y-2">
                {participants.map((username) => (
                  <div
                    key={username}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">@{username}</span>
                    <button
                      type="button"
                      onClick={() => removeParticipant(username)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}