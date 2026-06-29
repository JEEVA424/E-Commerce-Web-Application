// src/pages/OrderDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiX } from 'react-icons/fi';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getById(id).then((r) => setOrder(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderAPI.cancel(id);
      setOrder((o) => ({ ...o, status: 'CANCELLED' }));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold">Order not found</h2></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm mb-6">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Details</h1>
          <p className="text-gray-500 font-mono text-sm mt-1">#{order.id.toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          {['PENDING', 'PROCESSING'].includes(order.status) && (
            <button onClick={handleCancel} disabled={cancelling} className="btn-danger text-sm flex items-center gap-1 py-1.5">
              <FiX className="w-4 h-4" /> {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product.image || 'https://via.placeholder.com/60'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>${order.totalAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Tax</span><span>${order.taxAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Shipping</span><span>{order.shippingAmount === 0 ? 'Free' : `$${order.shippingAmount.toFixed(2)}`}</span></div>
            <hr className="border-gray-200 dark:border-gray-600" />
            <div className="flex justify-between font-bold text-base text-gray-900 dark:text-gray-100"><span>Total</span><span>${order.grandTotal.toFixed(2)}</span></div>
          </div>
          <hr className="border-gray-200 dark:border-gray-600 my-4" />
          <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex justify-between"><span>Payment</span><span>{order.paymentMethod}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="text-green-600 font-medium">{order.paymentStatus}</span></div>
            <div className="flex justify-between"><span>Date</span><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
