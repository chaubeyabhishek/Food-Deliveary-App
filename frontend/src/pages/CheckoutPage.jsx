import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const PAY_OPTS = [
    { val: 'COD', icon: '💵', label: 'Cash on Delivery', sub: 'Pay when it arrives' },
    { val: 'Online', icon: '💳', label: 'Online Payment', sub: 'UPI / Card (simulated)' },
];

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('COD');
    const [placing, setPlacing] = useState(false);
    const navigate = useNavigate();

    const items = cart?.items || [];
    const subtotal = cart?.total || 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const handleOrder = async () => {
        if (!address.trim()) { toast.error('Please enter a delivery address'); return; }
        if (!items.length) { toast.error('Your cart is empty'); return; }
        setPlacing(true);
        try {
            await api.post('/orders', { deliveryAddress: address, paymentMethod: payment });
            await clearCart();
            toast.success('🎉 Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally { setPlacing(false); }
    };

    const card = (children, extra = {}) => ({
        borderRadius: 18, padding: '24px 22px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        ...extra
    });

    const stepCircle = {
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#f97316,#ef4444)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8rem', fontWeight: 900, color: '#fff'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#080810', paddingBottom: 80 }}>
            <Navbar />
            <div style={{ paddingTop: 80, maxWidth: 960, margin: '0 auto', padding: '80px 24px 80px' }}>
                <div style={{ marginBottom: 36 }}>
                    <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Checkout</h1>
                    <p style={{ color: '#555', fontSize: '0.85rem', marginTop: 8 }}>Just a couple of steps to complete your order</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 24, alignItems: 'start' }}>

                    {/* ── Left ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Step 1: Address */}
                        <div style={card({})}>
                            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={stepCircle}>1</span> Delivery Address
                            </h3>
                            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={4}
                                placeholder="Flat no., Street, Locality, City, PIN..."
                                className="input-dark" style={{ resize: 'none', lineHeight: 1.6 }} />
                        </div>

                        {/* Step 2: Payment */}
                        <div style={card({})}>
                            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={stepCircle}>2</span> Payment Method
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {PAY_OPTS.map(({ val, icon, label, sub }) => (
                                    <button key={val} onClick={() => setPayment(val)} style={{
                                        padding: '18px 16px', borderRadius: 14, textAlign: 'left', cursor: 'pointer',
                                        background: payment === val ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${payment === val ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.09)'}`,
                                        boxShadow: payment === val ? '0 0 20px rgba(249,115,22,0.12)' : 'none',
                                        transition: 'all .2s'
                                    }}>
                                        <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</div>
                                        <div style={{ color: payment === val ? '#f97316' : '#ccc', fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
                                        <div style={{ color: '#555', fontSize: '0.75rem', marginTop: 3 }}>{sub}</div>
                                        {payment === val && (
                                            <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, background: 'rgba(249,115,22,0.18)', color: '#f97316', fontSize: '0.7rem', fontWeight: 700 }}>✓ Selected</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Summary ── */}
                    <div style={{ position: 'sticky', top: 80, borderRadius: 20, padding: '24px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.22)', boxShadow: '0 0 60px rgba(249,115,22,0.08)' }}>
                        <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', margin: '0 0 18px' }}>Order Summary</h3>

                        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }} className="scrollbar-hide">
                            {items.map(item => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.83rem' }}>
                                    <span style={{ color: '#aaa', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
                                        {item.foodId?.name} <span style={{ color: '#555' }}>×{item.quantity}</span>
                                    </span>
                                    <span style={{ color: '#ddd', flexShrink: 0, fontWeight: 500 }}>₹{(item.foodId?.price || 0) * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        {[['Subtotal', `₹${subtotal}`], ['Delivery', 'FREE'], ['Tax (5%)', `₹${tax}`]].map(([l, v]) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 10 }}>
                                <span style={{ color: '#666' }}>{l}</span>
                                <span style={{ color: l === 'Delivery' ? '#4ade80' : '#ccc', fontWeight: l === 'Delivery' ? 700 : 400 }}>{v}</span>
                            </div>
                        ))}

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                            <span style={{ color: '#f97316', fontWeight: 900, fontSize: '1.8rem', textShadow: '0 0 20px rgba(249,115,22,0.5)' }}>₹{total}</span>
                        </div>

                        <button onClick={handleOrder} disabled={placing} style={{
                            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                            background: 'linear-gradient(135deg,#f97316,#ef4444)',
                            color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: placing ? 'not-allowed' : 'pointer',
                            opacity: placing ? 0.65 : 1, boxShadow: '0 4px 24px rgba(249,115,22,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            transition: 'transform .2s'
                        }}
                            onMouseEnter={e => { if (!placing) e.currentTarget.style.transform = 'scale(1.02)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                            {placing ? <><span className="spinner" />Placing Order...</> : '🎉 Place Order'}
                        </button>

                        <p style={{ textAlign: 'center', color: '#333', fontSize: '0.72rem', marginTop: 12 }}>
                            By ordering you agree to our terms of service
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
