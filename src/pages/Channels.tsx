import { useState, useEffect } from 'react';
import { channelAPI } from '@/api/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Zap, Users } from 'lucide-react';

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const response = await channelAPI.getAll('OPEN');
      setChannels(response.data.channels || []);
    } catch (error) {
      console.error('Failed to load channels', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading channels..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Channels</h1>
        <p className="text-gray-600 mt-1">Manage your instant payment channels</p>
      </div>

      {channels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel: any) => (
            <div key={channel.channelId} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {channel.channelId.substring(0, 12)}...
                    </div>
                    <div className="text-sm text-gray-500">{channel.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Balance</div>
                  <div className="font-medium text-gray-900">
                    £{Object.values(channel.balances)[0] || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {channel.totalTransfers || 0} transfers
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No channels yet</h3>
          <p className="text-gray-600">Open a channel to start instant transfers</p>
        </div>
      )}
    </div>
  );
}
