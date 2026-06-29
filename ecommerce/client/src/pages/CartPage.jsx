// src/pages/CartPage.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();

  if (loading) return <LoadingSpinner />;

  const isEmpty = !cart?.items?.length;

  const handleRemove = async (itemId, name) => {
    try {
      await removeItem(itemId);
      toast.success(`${name} removed from cart`);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleQtyChange = async (itemId, newQty) => {
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  if (isEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-6">Add some products to get started!</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Browse Products <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline flex items-center gap-1">
          <FiTrash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/products/${item.productId}`}>
                <img
                  src={item.product.image || 'https://via.placeholder.com/80'}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.brand}</p>
                <p className="text-blue-600 font-bold mt-1">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => handleRemove(item.id, item.product.name)} className="text-red-400 hover:text-red-600 transition-colors">
                  <FiTrash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button onClick={() => handleQtyChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <span className="px-3 py-1 font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => handleQtyChange(item.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>${cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Tax (8%)</span>
                <span>${cart.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span>{cart.shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${cart.shipping?.toFixed(2)}`}</span>
              </div>
              {cart.shipping > 0 && (
                <p className="text-xs text-gray-400">Add ${(100 - cart.subtotal).toFixed(2)} more for free shipping</p>
              )}
              <hr className="border-gray-200 dark:border-gray-600" />
              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-gray-100">
                <span>Grand Total</span>
                <span>${cart.grandTotal?.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full py-3 mt-6 text-center block font-semibold">
              Proceed to Checkout →
            </Link>
            <Link to="/products" className="block text-center text-sm text-blue-600 hover:underline mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
