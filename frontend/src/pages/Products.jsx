import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', stock_quantity: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity)
      };

      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/products`, payload);
      }
      setShowModal(false);
      setFormData({ name: '', sku: '', price: '', stock_quantity: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      alert('Error saving product: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const openEdit = (p) => {
    setFormData({ name: p.name, sku: p.sku, price: p.price, stock_quantity: p.stock_quantity });
    setEditingId(p.id);
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingId(null);
          setFormData({ name: '', sku: '', price: '', stock_quantity: '' });
          setShowModal(true);
        }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock_quantity}</td>
                <td>
                  {p.stock_quantity > 10 ? (
                    <span className="badge badge-success">In Stock</span>
                  ) : p.stock_quantity > 0 ? (
                    <span className="badge badge-warning">Low Stock</span>
                  ) : (
                    <span className="badge badge-danger">Out of Stock</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => openEdit(p)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input required className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input required className="form-control" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} disabled={!!editingId} />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input required type="number" step="0.01" min="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Stock</label>
                <input required type="number" min="0" className="form-control" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
