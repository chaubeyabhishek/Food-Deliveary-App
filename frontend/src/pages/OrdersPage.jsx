import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const STATUS = {
    pending: { bg: 'rgba(251,191,36,0.14)', color: '#fbbf24', border: 'rgba(251,191,36,0.38)', icon: '⏳', label: 'Pending' },
    preparing: { bg: 'rgba(59,130,246,0.14)', color: '#60a5fa', border: 'rgba(59,130,246,0.38)', icon: '👨‍🍳', label: 'Preparing' },
    'out for delivery': { bg: 'rgba(167,139,250,0.14)', color: '#a78bfa', border: 'rgba(167,139,250,0.38)', icon: '🚀', label: 'On the way' },
    delivered: { bg: 'rgba(34,197,94,0.14)', color: '#4ade80', border: 'rgba(34,197,94,0.38)', icon: '✅', label: 'Delivered' },
    cancelled: { bg: 'rgba(239,68,68,0.14)', color: '#f87171', border: 'rgba(239,68,68,0.38)', icon: '❌', label: 'Cancelled' },
};

const STEPS = ['pending', 'preparing', 'out for delivery', 'delivered'];

function StatusBadge({ status }) {
    const cfg = STATUS[status] || STATUS.pending;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
            background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color
        }}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

function ProgressBar({ status }) {
    const idx = STEPS.indexOf(status);
    if (idx < 0) return null;
    return (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {STEPS.map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                        <div style={{
                            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                            background: i <= idx ? '#f97316' : 'rgba(255,255,255,0.1)',
                            boxShadow: i <= idx ? '0 0 8px rgba(249,115,22,0.7)' : 'none',
                            transition: 'all .3s'
                        }} />
                        {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? 'rgba(249,115,22,0.6)' : 'rgba(255,255,255,0.07)', transition: 'background .3s' }} />}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {STEPS.map((s, i) => (
                    <span key={s} style={{ fontSize: '0.68rem', fontWeight: 600, color: i <= idx ? '#f97316' : '#333', textTransform: 'capitalize', maxWidth: 60, textAlign: i === 0 ? 'left' : i === STEPS.length - 1 ? 'right' : 'center' }}>
                        {s === 'out for delivery' ? 'En Route' : s}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/user').then(({ data }) => setOrders([...data].reverse())).finally(() => setLoading(false));
    }, []);

    const FOOD_PH = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&q=60';

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#080810' }}>
            <Navbar />
            <div style={{ paddingTop: 88, maxWidth: 720, margin: '0 auto', padding: '88px 24px' }}>
                {[...Array(3)].map((_, i) => <div key={i} className="shimmer" style={{ height: 200, borderRadius: 16, marginBottom: 16 }} />)}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#080810', paddingBottom: 80 }}>
            <Navbar />
            <div style={{ paddingTop: 80, maxWidth: 720, margin: '0 auto', padding: '80px 24px 80px' }}>

                <div style={{ marginBottom: 36 }}>
                    <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>My Orders</h1>
                    <p style={{ color: '#555', fontSize: '0.85rem', marginTop: 8 }}>
                        {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: 80 }}>
                        <div className="float" style={{ fontSize: '4rem', marginBottom: 16 }}>📦</div>
                        <h3 style={{ color: '#555', fontWeight: 700, fontSize: '1.3rem', margin: 0 }}>No orders yet</h3>
                        <p style={{ color: '#444', marginTop: 8, fontSize: '0.85rem' }}>Start ordering from our restaurants!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {orders.map((order, i) => (
                            <div key={order._id} className="fade-in" style={{
                                animationDelay: `${i * 70}ms`,
                                borderRadius: 18, overflow: 'hidden',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                transition: 'border-color .2s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.18)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>

                                {/* Top bar */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 10 }}>
                                    <div>
                                        <p style={{ color: '#333', fontSize: '0.72rem', fontFamily: 'monospace', margin: '0 0 2px' }}>#{order._id.slice(-8).toUpperCase()}</p>
                                        <p style={{ color: '#ddd', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Progress */}
                                {order.status !== 'cancelled' && <ProgressBar status={order.status} />}

                                {/* Items */}
                                <div style={{ padding: '14px 20px' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            {item.image && (
                                                <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
                                                    onError={e => { e.target.src = FOOD_PH; }} />
                                            )}
                                            <span style={{ color: '#bbb', flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</span>
                                            <span style={{ color: '#555', fontSize: '0.78rem' }}>×{item.quantity}</span>
                                            <span style={{ color: '#ddd', fontWeight: 600, fontSize: '0.85rem', minWidth: 52, textAlign: 'right' }}>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', maxWidth: '60%' }}>
                                        <span style={{ color: 'rgba(249,115,22,0.6)' }}>📍</span>
                                        <span style={{ color: '#555', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{order.deliveryAddress}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: '#555', fontSize: '0.7rem', margin: 0 }}>Total paid</p>
                                        <p style={{ color: '#f97316', fontWeight: 900, fontSize: '1.4rem', margin: 0, textShadow: '0 0 16px rgba(249,115,22,0.5)' }}>₹{order.total}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
