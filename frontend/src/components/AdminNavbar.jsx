import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/restaurants', label: 'Restaurants', icon: '🍽️' },
    { to: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminNavbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
            background: 'rgba(8,8,16,0.9)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(249,115,22,0.18)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.4)'
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

                    {/* Left: Logo + Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                        <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#f97316,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 0 16px rgba(249,115,22,0.45)' }}>🍔</div>
                            <span style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
                                <span style={{ color: '#eee' }}>FoodRush</span>{' '}
                                <span style={{ color: '#f97316' }}>Admin</span>
                            </span>
                        </Link>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {LINKS.map(({ to, label, icon }) => {
                                const isActive = pathname === to;
                                return (
                                    <Link key={to} to={to} style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '7px 14px', borderRadius: 10, textDecoration: 'none',
                                        fontSize: '0.85rem', fontWeight: 600, transition: 'all .2s',
                                        background: isActive ? 'rgba(249,115,22,0.16)' : 'transparent',
                                        border: isActive ? '1px solid rgba(249,115,22,0.35)' : '1px solid transparent',
                                        color: isActive ? '#f97316' : '#888'
                                    }}
                                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#ddd'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
                                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent'; } }}>
                                        <span style={{ fontSize: '0.8rem' }}>{icon}</span> {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, padding: '5px 12px', borderRadius: 99, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.28)', color: '#f97316' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', animation: 'pulse 2s infinite' }} />
                            Admin
                        </span>
                        <button onClick={() => { logout(); navigate('/admin/login'); }} style={{
                            background: 'transparent', border: '1px solid transparent', color: '#555', fontSize: '0.85rem',
                            padding: '7px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all .2s'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
