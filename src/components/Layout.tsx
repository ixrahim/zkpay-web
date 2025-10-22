import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { useAuth } from '@/hooks/useAuth';
import { Lock, LogOut } from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Lock className="w-8 h-8 text-primary-600 mr-3" />
          <span className="text-xl font-bold text-gray-900">ZKPay</span>
        </div>

        <div className="p-4">
          <Navigation />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
            <div className="text-xs text-gray-500">Logged in as</div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.userId}
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
