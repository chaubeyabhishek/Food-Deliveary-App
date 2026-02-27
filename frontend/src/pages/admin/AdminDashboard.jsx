import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ restaurants: 0, orders: 0, pending: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get('/restaurants'), api.get('/orders/admin')])
            .then(([rRes, oRes]) => {
                const orders = oRes.data;
                setStats({
                    restaurants: rRes.data.length,
                    orders: orders.length,
                    pending: orders.filter(o => o.status === 'pending').length,
                    revenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total || 0), 0),
                });
            }).finally(() => setLoading(false));
    }, []);

    const CARDS = [
        { label: 'Restaurants', value: stats.restaurants, icon: '🍽️', color: '#f97316', glow: 'rgba(249,115,22,0.3)', link: '/admin/restaurants' },
        { label: 'Total Orders', value: stats.orders, icon: '📦', color: '#60a5fa', glow: 'rgba(96,165,250,0.3)', link: '/admin/orders' },
        { label: 'Pending', value: stats.pending, icon: '⏳', color: '#fbbf24', glow: 'rgba(251,191,36,0.3)', link: '/admin/orders' },
        { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: '💰', color: '#4ade80', glow: 'rgba(74,222,128,0.3)', link: '/admin/orders' },
    ];

    const QUICK = [
        { to: '/admin/restaurants', icon: '🍽️', title: 'Manage Restaurants', desc: 'Add, edit, or remove restaurants and manage their food menus', accent: '#f97316' },
        { to: '/admin/orders', icon: '📦', title: 'Manage Orders', desc: 'View all orders and update delivery status in real-time', accent: '#60a5fa' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#080810', paddingBottom: 60 }}>
            <AdminNavbar />
            <div style={{ paddingTop: 88, maxWidth: 1280, margin: '0 auto', padding: '88px 24px 60px' }}>

                <div style={{ marginBottom: 36 }}>
                    <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px' }}>Dashboard 👋</h1>
                    <p style={{ color: '#555', fontSize: '0.88rem', margin: 0 }}>Here's what's happening with FoodRush today.</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
                    {CARDS.map(c => (
                        <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
                            <div className="food-card" style={{ borderRadius: 18, padding: '22px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all .3s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${c.color === '#f97316' ? '249,115,22' : c.color === '#60a5fa' ? '96,165,250' : c.color === '#fbbf24' ? '251,191,36' : '74,222,128'},0.3)`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                <div style={{ width: 46, height: 46, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', background: `${c.glow.replace('0.3', '0.15')}`, border: `1px solid ${c.glow}`, boxShadow: `0 4px 18px ${c.glow}`, marginBottom: 16 }}>
                                    {c.icon}
                                </div>
                                <p style={{ color: '#666', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{c.label}</p>
                                {loading
                                    ? <div className="shimmer" style={{ height: 32, width: '60%', borderRadius: 8 }} />
                                    : <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>{c.value}</p>
                                }
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick actions */}
                <h2 style={{ color: '#ddd', fontSize: '1rem', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.01em' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
                    {QUICK.map(({ to, icon, title, desc, accent }) => (
                        <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                            <div className="food-card" style={{ borderRadius: 18, padding: '28px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all .3s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}55`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                <div style={{ fontSize: '2.2rem', marginBottom: 14 }}>{icon}</div>
                                <h3 style={{ color: '#eee', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 8px' }}>{title}</h3>
                                <p style={{ color: '#555', fontSize: '0.83rem', margin: '0 0 14px', lineHeight: 1.55 }}>{desc}</p>
                                <span style={{ color: accent, fontSize: '0.83rem', fontWeight: 700 }}>Get started →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
