// src/pages/admin/AdminProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', brand: '', categoryId: '', isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    categoryAPI.getAll().then((r) => setCategories(r.data.data));
    if (isEdit) {
      productAPI.getById(id).then((r) => {
        const p = r.data.data;
        setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, brand: p.brand || '', categoryId: p.categoryId, isFeatured: p.isFeatured });
        setImagePreview(p.image);
      });
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await productAPI.update(id, formData);
        toast.success('Product updated!');
      } else {
        await productAPI.create(formData);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <button onClick={() => navigate('/admin/products')} className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm mb-6">
        <FiArrowLeft /> Back to Products
      </button>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
              <input required value={form.name} onChange={set('name')} className="input-field" placeholder="iPhone 15 Pro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
              <textarea required value={form.description} onChange={set('description')} className="input-field resize-none" rows={4} placeholder="Detailed product description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($) *</label>
                <input required type="number" step="0.01" min="0" value={form.price} onChange={set('price')} className="input-field" placeholder="99.99" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock *</label>
                <input required type="number" min="0" value={form.stock} onChange={set('stock')} className="input-field" placeholder="100" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                <input value={form.brand} onChange={set('brand')} className="input-field" placeholder="Apple" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select required value={form.categoryId} onChange={set('categoryId')} className="input-field">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Image</h3>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full aspect-square object-cover rounded-lg mb-3 bg-gray-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }} />
            ) : (
              <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                <FiUpload className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <label className="btn-secondary w-full text-center cursor-pointer text-sm flex items-center justify-center gap-2">
              <FiUpload className="w-4 h-4" />
              {imagePreview ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-2 text-center">JPEG, PNG, WebP up to 5MB</p>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base font-semibold">
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
