import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
const STATUS_CFG = {
    pending: { bg: 'rgba(251,191,36,0.14)', color: '#fbbf24', border: 'rgba(251,191,36,0.38)', icon: '⏳' },
    preparing: { bg: 'rgba(96,165,250,0.14)', color: '#60a5fa', border: 'rgba(96,165,250,0.38)', icon: '👨‍🍳' },
    'out for delivery': { bg: 'rgba(167,139,250,0.14)', color: '#a78bfa', border: 'rgba(167,139,250,0.38)', icon: '🚀' },
    delivered: { bg: 'rgba(34,197,94,0.14)', color: '#4ade80', border: 'rgba(34,197,94,0.38)', icon: '✅' },
    cancelled: { bg: 'rgba(239,68,68,0.14)', color: '#f87171', border: 'rgba(239,68,68,0.38)', icon: '❌' },
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => { api.get('/orders/admin').then(({ data }) => setOrders(data)).finally(() => setLoading(false)); }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/status`, { status });
            setOrders(orders.map(o => o._id === orderId ? data : o));
            toast.success(`Status → ${status}`);
        } catch { toast.error('Failed to update status'); }
    };

    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);
    const counts = { All: orders.length };
    STATUSES.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });

    return (
        <div style={{ minHeight: '100vh', background: '#080810', paddingBottom: 60 }}>
            <AdminNavbar />
            <div style={{ paddingTop: 88, maxWidth: 1280, margin: '0 auto', padding: '88px 24px 60px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>📦 All Orders</h1>
                        <p style={{ color: '#555', fontSize: '0.83rem', marginTop: 6 }}>{orders.length} total orders</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', color: '#777' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
                        Live updates
                    </div>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 24 }} className="scrollbar-hide">
                    {['All', ...STATUSES].map(s => {
                        const isActive = filter === s;
                        const cfg = STATUS_CFG[s];
                        return (
                            <button key={s} onClick={() => setFilter(s)} style={{
                                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 16px', borderRadius: 99, cursor: 'pointer',
                                fontSize: '0.82rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all .2s',
                                background: isActive ? 'linear-gradient(135deg,#f97316,#ef4444)' : 'rgba(255,255,255,0.04)',
                                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.09)',
                                color: isActive ? '#fff' : '#666',
                                boxShadow: isActive ? '0 4px 18px rgba(249,115,22,0.4)' : 'none'
                            }}>
                                {cfg ? cfg.icon : '📋'} {s}
                                <span style={{ padding: '1px 7px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)', color: isActive ? '#fff' : '#444' }}>{counts[s]}</span>
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 160, borderRadius: 16 }} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>📭</div>
                        <p style={{ color: '#555', fontWeight: 600 }}>No orders in this category</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {filtered.map((order, i) => {
                            const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
                            return (
                                <div key={order._id} className="fade-in" style={{
                                    animationDelay: `${i * 40}ms`,
                                    borderRadius: 18, overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    transition: 'border-color .2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${cfg.border}`; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>

                                    {/* Top */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 12 }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>#{order._id.slice(-8).toUpperCase()}</span>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                                                    {cfg.icon} {order.status}
                                                </span>
                                            </div>
                                            <p style={{ color: '#777', fontSize: '0.82rem', margin: 0 }}>
                                                {order.userId?.name || 'User'} <span style={{ color: '#444' }}>·</span> <span style={{ color: '#444', fontSize: '0.78rem' }}>{order.userId?.email}</span>
                                            </p>
                                            <p style={{ color: '#333', fontSize: '0.75rem', marginTop: 3 }}>
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: '#f97316', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 4px', textShadow: '0 0 16px rgba(249,115,22,0.4)' }}>₹{order.total}</p>
                                            <span style={{ color: '#444', fontSize: '0.75rem', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>{order.paymentMethod}</span>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
                                        {order.items.map((item, idx) => (
                                            <span key={idx} style={{ color: '#666', fontSize: '0.8rem' }}>
                                                {item.name} <span style={{ color: '#333' }}>×{item.quantity}</span>
                                            </span>
                                        ))}
                                    </div>

                                    {/* Address + Status Change */}
                                    <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                        <p style={{ color: '#444', fontSize: '0.78rem', maxWidth: 320, display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
                                            <span style={{ color: 'rgba(249,115,22,0.5)' }}>📍</span>
                                            {order.deliveryAddress}
                                        </p>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {STATUSES.filter(s => s !== order.status).map(s => {
                                                const c = STATUS_CFG[s];
                                                return (
                                                    <button key={s} onClick={() => handleStatusChange(order._id, s)} style={{
                                                        padding: '5px 12px', borderRadius: 99, cursor: 'pointer', textTransform: 'capitalize',
                                                        fontSize: '0.75rem', fontWeight: 600, transition: 'all .2s',
                                                        background: c.bg, border: `1px solid ${c.border}`, color: c.color
                                                    }}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                                        {c.icon} {s}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
