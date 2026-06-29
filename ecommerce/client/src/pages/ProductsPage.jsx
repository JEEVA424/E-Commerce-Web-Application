// src/pages/ProductsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => { categoryAPI.getAll().then((r) => setCategories(r.data.data)); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 12 };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await productAPI.getAll(params);
      setProducts(data.data);
      setPagination(data.pagination);
      // Sync URL
      const urlParams = {};
      Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'createdAt' && v !== 'desc' && v !== 1) urlParams[k] = v; });
      setSearchParams(urlParams, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'createdAt', order: 'desc', page: 1 });
    setSearchInput('');
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-5">
          {/* Search */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2"><FiSearch /> Search</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="input-field text-sm"
              />
              <button type="submit" className="btn-primary px-3 py-2">
                <FiSearch className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Category */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2"><FiFilter /> Category</h3>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="cat" checked={!filters.category} onChange={() => updateFilter('category', '')} className="text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">All Categories</span>
              </label>
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="cat" checked={filters.category === c.name} onChange={() => updateFilter('category', c.name)} className="text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">({c._count?.products || 0})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Price Range</h3>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="input-field text-sm w-24" min="0" />
              <span className="self-center text-gray-400">–</span>
              <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="input-field text-sm w-24" min="0" />
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="w-full btn-secondary text-sm flex items-center justify-center gap-2">
              <FiX /> Clear Filters
            </button>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Loading...' : `${pagination.total || 0} products found`}
            </p>
            <div className="flex items-center gap-2">
              <select value={`${filters.sort}:${filters.order}`} onChange={(e) => { const [s, o] = e.target.value.split(':'); setFilters((f) => ({ ...f, sort: s, order: o, page: 1 })); }} className="input-field text-sm py-1.5 w-auto">
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="rating:desc">Top Rated</option>
                <option value="name:asc">Name A-Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20 card">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No products found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              <Pagination page={pagination.page} pages={pagination.pages} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
