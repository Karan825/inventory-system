import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStock: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/customers`),
          axios.get(`${API_URL}/orders`)
        ]);

        const products = productsRes.data;
        setStats({
          totalProducts: products.length,
          totalCustomers: customersRes.data.length,
          totalOrders: ordersRes.data.length,
          lowStock: products.filter(p => p.stock_quantity < 10).length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div style={{ color: '#818CF8' }}><Package size={32} /></div>
          <div>
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div style={{ color: '#34D399' }}><Users size={32} /></div>
          <div>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div style={{ color: '#FBBF24' }}><ShoppingCart size={32} /></div>
          <div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div style={{ color: '#F87171' }}><AlertTriangle size={32} /></div>
          <div>
            <div className="stat-value">{stats.lowStock}</div>
            <div className="stat-label">Low Stock Items (&lt;10)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
