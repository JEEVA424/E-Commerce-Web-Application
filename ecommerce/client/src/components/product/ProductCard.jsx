// src/components/product/ProductCard.jsx
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="card group hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-600 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 left-2 badge bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Featured</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.category?.name}</p>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        {product.brand && <p className="text-xs text-gray-400 mb-2">{product.brand}</p>}

        <div className="flex items-center gap-1 mb-3">
          <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-600 dark:text-gray-300">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 btn-primary text-xs py-1.5 px-3 disabled:opacity-50"
          >
            <FiShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
