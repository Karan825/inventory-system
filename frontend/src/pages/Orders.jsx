import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_URL}/customers`);
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) return showToast('Error: Select a customer');
    
    // Filter out items without product_id
    const validItems = orderItems
      .filter(item => item.product_id)
      .map(item => ({ product_id: parseInt(item.product_id), quantity: parseInt(item.quantity) }));
      
    if (validItems.length === 0) return showToast('Error: Add at least one valid product');

    try {
      await axios.post(`${API_URL}/orders`, {
        customer_id: parseInt(selectedCustomerId),
        items: validItems
      });
      showToast('Order created successfully');
      setShowModal(false);
      setSelectedCustomerId('');
      setOrderItems([{ product_id: '', quantity: 1 }]);
      fetchOrders();
      fetchProducts(); // Refresh stock
    } catch (error) {
      showToast('Error: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${API_URL}/orders/${id}`);
        showToast('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        showToast('Error deleting order');
      }
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Order
        </button>
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{customers.find(c => c.id === o.customer_id)?.full_name || o.customer_id}</td>
                <td>${o.total_amount.toFixed(2)}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(o.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ maxWidth: '600px' }}>
            <h2>Create New Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Customer</label>
                <select required className="form-control" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Products</label>
                {orderItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <select required className="form-control" value={item.product_id} onChange={e => updateItem(index, 'product_id', e.target.value)}>
                      <option value="">Select Product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id} disabled={p.stock_quantity === 0}>
                          {p.name} - ${p.price} (Stock: {p.stock_quantity})
                        </option>
                      ))}
                    </select>
                    <input required type="number" min="1" className="form-control" style={{ width: '100px' }} value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} />
                    {orderItems.length > 1 && (
                      <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}><Trash2 size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '8px' }} onClick={addItem}>
                  + Add Another Product
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
