// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Total Users', value: data.stats.totalUsers, icon: FiUsers, color: 'blue', to: '/admin/users' },
    { label: 'Total Products', value: data.stats.totalProducts, icon: FiPackage, color: 'green', to: '/admin/products' },
    { label: 'Total Orders', value: data.stats.totalOrders, icon: FiShoppingBag, color: 'purple', to: '/admin/orders' },
    { label: 'Total Revenue', value: `$${data.stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'yellow', to: '/admin/orders' },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
              <div className={`p-2 rounded-lg ${colorMap[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{order.user.name}</p>
                  <p className="text-gray-500 font-mono text-xs">#{order.id.slice(0,8).toUpperCase()}</p>
                </div>
                <StatusBadge status={order.status} />
                <p className="font-bold text-gray-900 dark:text-gray-100">${order.grandTotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Low Stock Alerts</h2>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500">All products are well-stocked!</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</p>
                    <p className="text-gray-500">{p.category.name}</p>
                  </div>
                  <span className={`badge ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 xl:col-span-2">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Orders by Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {['PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map((status) => (
              <div key={status} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <StatusBadge status={status} />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{data.ordersByStatus[status] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
