import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import '../../pages/Dashboard.css';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Campaigns', to: '/campaigns' },
  { label: 'Labels', to: '/labels' },
  { label: 'Profile', to: '/profile' },
];

export default function DashboardLayout() {
  const location = useLocation();

  const isLinkActive = (to, isActive) => {
    if (to === '/dashboard') {
      return isActive || location.pathname === '/';
    }

    if (to === '/campaigns') {
      return isActive || location.pathname.startsWith('/campaigns');
    }

    return isActive;
  };

  return (
    <div className="dash-root">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">◆</span>
          <span className="logo-text">MetricMail</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                ['nav-item', isLinkActive(item.to, isActive) ? 'active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="avatar">?</div>
            <div className="user-info">
              <div className="user-name">Welcome</div>
              <div className="user-role">Member</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
