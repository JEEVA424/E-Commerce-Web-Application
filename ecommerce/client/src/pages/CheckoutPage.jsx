// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiCreditCard, FiMapPin, FiCheckCircle } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
    paymentMethod: 'DUMMY',
    notes: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const { data } = await orderAPI.create(form);
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiMapPin className="text-blue-600" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address *</label>
                <input required value={form.shippingAddress} onChange={set('shippingAddress')} className="input-field" placeholder="123 Main Street" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                <input required value={form.shippingCity} onChange={set('shippingCity')} className="input-field" placeholder="New York" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                <input required value={form.shippingState} onChange={set('shippingState')} className="input-field" placeholder="NY" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code *</label>
                <input required value={form.shippingZip} onChange={set('shippingZip')} className="input-field" placeholder="10001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country *</label>
                <select required value={form.shippingCountry} onChange={set('shippingCountry')} className="input-field">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Notes (Optional)</label>
                <textarea value={form.notes} onChange={set('notes')} className="input-field resize-none" rows={2} placeholder="Any special delivery instructions..." />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-blue-600" /> Payment Method
            </h2>
            <div className="space-y-3">
              {['DUMMY', 'CREDIT_CARD', 'PAYPAL', 'COD'].map((method) => (
                <label key={method} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${form.paymentMethod === method ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={method} checked={form.paymentMethod === method} onChange={set('paymentMethod')} className="text-blue-600" />
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {{ DUMMY: '💳 Demo Payment (Test)', CREDIT_CARD: '💳 Credit / Debit Card', PAYPAL: '🔵 PayPal', COD: '💵 Cash on Delivery' }[method]}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-xs text-yellow-700 dark:text-yellow-300">
              ⚠️ This is a demo store. No real payment will be processed.
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <img src={item.product.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-gray-800 dark:text-gray-200">{item.product.name}</p>
                    <p className="text-gray-500">×{item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <hr className="border-gray-200 dark:border-gray-600 mb-3" />
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>${cart.subtotal?.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Tax</span><span>${cart.tax?.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Shipping</span><span>{cart.shipping === 0 ? 'Free' : `$${cart.shipping?.toFixed(2)}`}</span></div>
              <hr className="border-gray-200 dark:border-gray-600" />
              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-gray-100"><span>Total</span><span>${cart.grandTotal?.toFixed(2)}</span></div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2">
              <FiCheckCircle className="w-5 h-5" />
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
