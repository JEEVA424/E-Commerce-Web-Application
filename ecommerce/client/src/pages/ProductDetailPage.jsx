// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingCart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    productAPI.getById(id)
      .then((r) => setProduct(r.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return toast.error('Please login to add items to cart');
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Link to="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
    </div>
  );

  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm mb-6">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="card overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/600x600?text=No+Image'}
            alt={product.name}
            className="w-full h-96 md:h-[500px] object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-sm text-blue-600 font-medium mb-1">{product.category?.name}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h1>
          {product.brand && <p className="text-gray-500 dark:text-gray-400 mb-3">by {product.brand}</p>}

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <FiStar key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
          </div>

          <div className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="mb-6">
            {inStock ? (
              <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          {inStock && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="flex-1 btn-primary py-3 text-base flex items-center justify-center gap-2"
            >
              <FiShoppingCart className="w-5 h-5" />
              {adding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Details */}
          <div className="mt-8 card p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{product.category?.name}</span>
            </div>
            {product.brand && (
              <div className="flex justify-between">
                <span className="text-gray-500">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Stock</span>
              <span className="font-medium">{product.stock} units</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
