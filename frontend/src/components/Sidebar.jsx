import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
          <Package size={24} color="white" />
        </div>
        NexInvent
      </div>
      
      <nav>
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/products" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Package size={20} />
          Products
        </NavLink>
        <NavLink to="/customers" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          Customers
        </NavLink>
        <NavLink to="/orders" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          Orders
        </NavLink>
      </nav>
    </aside>
  );
}
