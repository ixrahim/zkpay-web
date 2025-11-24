import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages (Protected)
import Dashboard from './pages/Dashboard';
import SendPayment from './pages/SendPayment';
import Channels from './pages/Channels';
import History from './pages/History';
import Settings from './pages/Settings';
import SplitBills from './pages/SplitBills';
import Pots from './pages/Pots';
import Analytics from './pages/Analytics';

// Public Landing Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Product from './pages/Product';
import Security from './pages/Security';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Cards from './pages/Cards';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/security" element={<Security />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/send" element={<SendPayment />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/splitbills" element={<SplitBills />} />
            <Route path="/pots" element={<Pots />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;