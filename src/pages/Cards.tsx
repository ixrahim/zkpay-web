// src/pages/Cards.tsx
import { useState, useEffect, useContext } from 'react';
import { 
  CreditCard, Plus, Trash2, Star, ShieldCheck, 
  QrCode, Lock, Smartphone, Eye, EyeOff, Copy, Check 
} from 'lucide-react';
import { toast } from 'sonner';
import { AuthContext } from '@/context/AuthContext';
import { cardsAPI } from '@/api/client';
import { StoredCard, VirtualCard } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Cards() {
  const { user } = useContext(AuthContext);
  const [cards, setCards] = useState<StoredCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showVirtualCard, setShowVirtualCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
  const [viewingKey, setViewingKey] = useState<string>('');
  const [hasViewingKey, setHasViewingKey] = useState(false);

  useEffect(() => {
  if (!user) return;

  const fetchViewingKey = async () => {
    try {
      setLoading(true);
      const response = await cardsAPI.getViewingKey(user.userId);
      
      if (response.data.success && response.data.viewingKey) {
        setViewingKey(response.data.viewingKey);
        setHasViewingKey(true);
        loadCards(response.data.viewingKey);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No viewing key exists yet
        setLoading(false);
      } else {
        console.error('Failed to fetch viewing key:', error);
        toast.error('Failed to access card vault');
        setLoading(false);
      }
    }
  };

  fetchViewingKey();
}, [user]);

  const loadCards = async (key: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cardsAPI.list(user.userId, key);
      setCards(response.data.cards);
    } catch (error: any) {
      console.error('Failed to load cards:', error);
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

 const createViewingKey = async () => {
  if (!user) return;

  try {
    setLoading(true);
    
    // Backend creates AND stores the key
    await cardsAPI.createViewingKey(user.userId);
    
    // Immediately fetch it back
    const response = await cardsAPI.getViewingKey(user.userId);
    
    setViewingKey(response.data.viewingKey);
    setHasViewingKey(true);
    
    toast.success('Card vault unlocked!');
    loadCards(response.data.viewingKey);
  } catch (error: any) {
    console.error('Failed to create viewing key:', error);
    toast.error('Failed to unlock card vault');
    setLoading(false);
  }
};

  const deleteCard = async (zkHash: string) => {
    if (!user || !viewingKey) return;

    try {
      await cardsAPI.delete(zkHash, user.userId, viewingKey);
      toast.success('Card deleted');
      loadCards(viewingKey);
    } catch (error: any) {
      console.error('Failed to delete card:', error);
      toast.error('Failed to delete card');
    }
  };

  const setDefaultCard = async (zkHash: string) => {
    if (!user || !viewingKey) return;

    try {
      await cardsAPI.setDefault(zkHash, user.userId, viewingKey);
      toast.success('Default card updated');
      loadCards(viewingKey);
    } catch (error: any) {
      console.error('Failed to set default card:', error);
      toast.error('Failed to set default card');
    }
  };

  const generateVirtualCard = async (card: StoredCard) => {
    if (!user || !viewingKey) return;

    try {
      const response = await cardsAPI.generateVirtual(card.zkHash, user.userId, viewingKey);
      setVirtualCard(response.data.virtualCard);
      setSelectedCard(card);
      setShowVirtualCard(true);
      toast.success('Virtual card generated!');
    } catch (error: any) {
      console.error('Failed to generate virtual card:', error);
      toast.error('Failed to generate virtual card');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hasViewingKey) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unlock Your Card Vault
          </h2>
          <p className="text-gray-600 mb-8">
            Your cards are encrypted in Secret Network's Trusted Execution Environment.
            Create a viewing key to securely access your cards.
          </p>
          <button
            onClick={createViewingKey}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Viewing Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Cards</h1>
          <p className="text-gray-600 mt-1">
            Securely stored in Secret Network TEE
          </p>
        </div>
        <button
          onClick={() => setShowAddCard(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Card
        </button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No cards yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first card to start making secure payments
          </p>
          <button
            onClick={() => setShowAddCard(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CardItem
              key={card.zkHash}
              card={card}
              onDelete={deleteCard}
              onSetDefault={setDefaultCard}
              onGenerateVirtual={generateVirtualCard}
            />
          ))}
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCard && (
        <AddCardModal
          onClose={() => setShowAddCard(false)}
          onSuccess={() => {
            setShowAddCard(false);
            loadCards(viewingKey);
          }}
          userId={user?.userId || ''}
          viewingKey={viewingKey}
        />
      )}

      {/* Virtual Card Modal */}
      {showVirtualCard && virtualCard && selectedCard && (
        <VirtualCardModal
          card={selectedCard}
          virtualCard={virtualCard}
          onClose={() => {
            setShowVirtualCard(false);
            setVirtualCard(null);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}

// Card Item Component
function CardItem({
  card,
  onDelete,
  onSetDefault,
  onGenerateVirtual,
}: {
  card: StoredCard;
  onDelete: (zkHash: string) => void;
  onSetDefault: (zkHash: string) => void;
  onGenerateVirtual: (card: StoredCard) => void;
}) {
  const brandColors: Record<string, string> = {
    Visa: 'from-blue-500 to-blue-700',
    Mastercard: 'from-red-500 to-orange-600',
    'American Express': 'from-green-500 to-teal-600',
    Unknown: 'from-gray-500 to-gray-700',
  };
console.log(card.brand)
  return (
    <div className="relative group">
      <div
        className={`bg-gradient-to-br ${
          brandColors[card.brand] || brandColors.Unknown
        } rounded-2xl p-6 text-white shadow-lg h-48 flex flex-col justify-between transition-transform hover:scale-105`}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80">
              {card.nickname || card.brand}
            </p>
            {card.isDefault && (
              <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded mt-1">
                <Star className="w-3 h-3 fill-current" />
                Default
              </span>
            )}
          </div>
          <CreditCard className="w-8 h-8 opacity-80" />
        </div>

        {/* Card Number */}
        <div>
          <p className="text-xl font-mono tracking-wider">
            •••• •••• •••• {card.last4}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between">
          <p className="text-sm">{card.brand}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateVirtual(card)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Generate virtual card"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            {!card.isDefault && (
              <button
                onClick={() => onSetDefault(card.zkHash)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Set as default"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Delete this card?')) {
                  onDelete(card.zkHash);
                }
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Delete card"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Virtual Card Modal Component
function VirtualCardModal({
  card,
  virtualCard,
  onClose,
}: {
  card: StoredCard;
  virtualCard: VirtualCard;
  onClose: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Virtual Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Original Card Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Linked to</p>
            <p className="font-semibold text-gray-900">
              {card.nickname || card.brand} •••• {card.last4}
            </p>
          </div>

          {/* Virtual Card Display */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm opacity-80">Virtual Card</span>
              <Smartphone className="w-6 h-6 opacity-80" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs opacity-70 mb-1">Card Number</p>
                {showDetails ? (
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-mono">
                      {virtualCard.virtualCardNumber.match(/.{1,4}/g)?.join(' ')}
                    </p>
                    <button
                      onClick={() => copyToClipboard(virtualCard.virtualCardNumber)}
                      className="p-2 hover:bg-white/20 rounded-lg"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-lg font-mono">•••• •••• •••• ••••</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs opacity-70 mb-1">Expiry</p>
                  <p className="text-sm font-mono">
                    {showDetails ? virtualCard.virtualExpiry : '••/••'}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">CVV</p>
                  <p className="text-sm font-mono">
                    {showDetails ? virtualCard.virtualCvv : '•••'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs opacity-70 mb-1">Cardholder</p>
                <p className="text-sm">{virtualCard.cardholderName}</p>
              </div>
            </div>
          </div>

          {/* Toggle Visibility Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showDetails ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Details
              </>
            )}
          </button>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>One-time use:</strong> This virtual card number is for single use only and expires after this session.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Card Modal Component
function AddCardModal({
  onClose,
  onSuccess,
  userId,
  
}: {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  viewingKey: string;
}) {
  const [loading, setLoading] = useState(false);
  const [addMethod, setAddMethod] = useState<'manual' | 'qr' | 'pin'>('manual');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    nickname: '',
    isDefault: false,
  });
  const [pinData, setPinData] = useState({
    pin: '',
    cardId: '',
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await cardsAPI.store({
        userId,
        cardData: {
          card_number: formData.cardNumber.replace(/\s/g, ''),
          expiry_month: formData.expiryMonth,
          expiry_year: formData.expiryYear,
          cvv: formData.cvv,
          cardholder_name: formData.cardholderName,
        },
        nickname: formData.nickname || undefined,
        isDefault: formData.isDefault,
      });

      toast.success('Card added successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Failed to add card:', error);
      toast.error(error.response?.data?.message || 'Failed to add card');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Backend endpoint for PIN-based card retrieval
      // For now, show a placeholder
      toast.info('PIN-based card entry will be available soon!');
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to add card via PIN:', error);
      toast.error('Failed to add card');
      setLoading(false);
    }
  };

  const handleQRScan = () => {
    // TODO: Implement QR code scanner
    toast.info('QR scanner will open your camera to scan card details');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Card</h2>

        {/* Method Selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setAddMethod('manual')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              addMethod === 'manual'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-xs font-medium">Manual</span>
          </button>

          <button
            onClick={() => setAddMethod('qr')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              addMethod === 'qr'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <QrCode className="w-6 h-6" />
            <span className="text-xs font-medium">QR Code</span>
          </button>

          <button
            onClick={() => setAddMethod('pin')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              addMethod === 'pin'
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Lock className="w-6 h-6" />
            <span className="text-xs font-medium">Easy PIN</span>
          </button>
        </div>

        {/* Manual Entry Form */}
        {addMethod === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <input
                  type="text"
                  value={formData.expiryMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryMonth: e.target.value })
                  }
                  placeholder="MM"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.expiryYear}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryYear: e.target.value })
                  }
                  placeholder="YY"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({ ...formData, cvv: e.target.value })
                }
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={formData.cardholderName}
                onChange={(e) =>
                  setFormData({ ...formData, cardholderName: e.target.value })
                }
                placeholder="JOHN SMITH"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname (Optional)
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
                placeholder="My Visa Card"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default card
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Card'}
              </button>
            </div>
          </form>
        )}

        {/* QR Code Scanner */}
        {addMethod === 'qr' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Scan Card QR Code
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Point your camera at the QR code on your card or card statement
              </p>
              <button
                onClick={handleQRScan}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Camera
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Privacy-first:</strong> Your card details never leave your device during scanning.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* PIN Entry */}
        {addMethod === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy PIN Entry
              </h3>
              <p className="text-sm text-gray-600">
                Use your bank's card PIN to securely add your card without typing card details
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card ID (from your bank)
              </label>
              <input
                type="text"
                value={pinData.cardId}
                onChange={(e) =>
                  setPinData({ ...pinData, cardId: e.target.value })
                }
                placeholder="Enter card ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit PIN
              </label>
              <input
                type="password"
                value={pinData.pin}
                onChange={(e) =>
                  setPinData({ ...pinData, pin: e.target.value })
                }
                placeholder="••••••"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                required
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Secure:</strong> Your PIN is verified with your bank and never stored by ZKPay.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Add Card'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}