import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { identityAPI } from '@/api/client';
import { toast } from 'sonner';
import { UserPlus, Mail, KeyRound, Building2, CreditCard, AtSign, User, Check, X, Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',           // ✅ NEW: Username field
    displayName: '',        // ✅ NEW: Display name field
    password: '',
    sortCode: '',
    accountNumber: '',
    bankName: '',
  });
  const [loading, setLoading] = useState(false);
  
  // ✅ NEW: Username availability checking
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');

  // ✅ NEW: Check username availability as user types
  useEffect(() => {
    const checkUsername = async () => {
      const { username } = formData;

      if (username.length < 3) {
        setUsernameAvailable(null);
        setUsernameError('');
        return;
      }

      // Validate format
      if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(username)) {
        setUsernameError('Username must start with a letter and contain only letters, numbers, _ or -');
        setUsernameAvailable(false);
        return;
      }

      setCheckingUsername(true);
      setUsernameError('');

      try {
        const response = await identityAPI.checkUsername(username);
        setUsernameAvailable(response.data.available);
        if (!response.data.available) {
          setUsernameError(`@${username} is already taken`);
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameError('Could not check availability');
      } finally {
        setCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ NEW: Validate username
    if (!formData.username || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!usernameAvailable) {
      toast.error('Please choose an available username');
      return;
    }

    setLoading(true);

    try {
      // ✅ Generate a simple public key (in production, use proper crypto)
      const publicKey = '0x' + Math.random().toString(36).substring(2) + Date.now().toString(36);

      // ✅ Call backend /api/identity/create with username
      const response = await identityAPI.create({
        userId: formData.email,
        username: formData.username.toLowerCase(),        // ✅ NEW: Add username
        displayName: formData.displayName || formData.username,  // ✅ NEW: Add display name
        password: formData.password,
        sortCode: formData.sortCode,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        publicKey,
        country: 'GB',                                    // ✅ NEW: Add country
      });

      // ✅ Backend returns: { zkHash, verified, token, user, username, secretAddress }
      const { user, token, username } = response.data;
      
      login(user, token);
      
      // ✅ NEW: Show success with username
      toast.success(`Welcome @${username}! Your account is ready. You can receive payments at @${username}`, {
        duration: 5000,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join ZKPay today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="alice@example.com"
              required
            />
          </div>

          {/* ✅ NEW: Username field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AtSign className="w-4 h-4 inline mr-1" />
              Username *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-semibold">@</span>
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                className="w-full pl-8 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="alice"
                maxLength={20}
                required
              />
              {/* Status indicator */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {checkingUsername && (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                )}
                {!checkingUsername && formData.username.length >= 3 && usernameAvailable === true && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {!checkingUsername && formData.username.length >= 3 && usernameAvailable === false && (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            {usernameError && (
              <p className="text-xs text-red-600 mt-1">{usernameError}</p>
            )}
            {!usernameError && formData.username.length >= 3 && usernameAvailable && (
              <p className="text-xs text-green-600 mt-1">@{formData.username} is available!</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This is how others will send you money. Choose wisely!
            </p>
          </div>

          {/* ✅ NEW: Display name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Display Name (optional)
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Alice Johnson"
            />
            <p className="text-xs text-gray-500 mt-1">How your name appears to others</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <KeyRound className="w-4 h-4 inline mr-1" />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Bank Account Details</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Barclays, HSBC"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Sort Code
                </label>
                <input
                  type="text"
                  value={formData.sortCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData({ ...formData, sortCode: value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="123456"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">6 digits</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setFormData({ ...formData, accountNumber: value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="12345678"
                  pattern="\d{8}"
                  maxLength={8}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">8 digits</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !usernameAvailable} 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}