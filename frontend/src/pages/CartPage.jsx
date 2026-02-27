import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const FOOD_PH = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, loading } = useCart();
    const navigate = useNavigate();

    const items = cart?.items || [];
    const subtotal = cart?.total || 0;
    const tax = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + tax;

    if (items.length === 0) return (
        <div style={{ minHeight: '100vh', background: '#080810', backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.1) 0%, transparent 55%)' }}>
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '88vh', gap: 16, paddingTop: 64 }}>
                <div className="float" style={{
                    width: 100, height: 100, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.4)'
                }}>🛒</div>
                <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>Your cart is empty</h2>
                <p style={{ color: '#555', textAlign: 'center', maxWidth: 280, lineHeight: 1.6, fontSize: '0.9rem' }}>
                    Hungry? Browse our restaurants and pick something delicious!
                </p>
                <Link to="/" style={{
                    marginTop: 8, padding: '12px 32px', borderRadius: 14, textDecoration: 'none',
                    background: 'linear-gradient(135deg,#f97316,#ef4444)',
                    color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                    boxShadow: '0 4px 24px rgba(249,115,22,0.45)'
                }}>Browse Restaurants</Link>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#080810', paddingBottom: 80 }}>
            <Navbar />
            <div style={{ paddingTop: 80, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 80px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Your Cart</h1>
                        <p style={{ color: '#555', fontSize: '0.85rem', marginTop: 6 }}>{items.length} item{items.length !== 1 ? 's' : ''} ready to order</p>
                    </div>
                    <button onClick={clearCart} style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                        color: '#f87171', fontSize: '0.8rem', fontWeight: 600, padding: '8px 16px',
                        borderRadius: 10, cursor: 'pointer'
                    }}>🗑 Clear All</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 24, alignItems: 'start' }}>

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {items.map((item, i) => (
                            <div key={item._id} className="fade-in" style={{
                                animationDelay: `${i * 60}ms`,
                                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
                                borderRadius: 16, background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                transition: 'border-color .2s'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>

                                {/* Image */}
                                <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <img src={item.foodId?.image || FOOD_PH} alt={item.foodId?.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={e => { e.target.src = FOOD_PH; }} />
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.foodId?.name || 'Item'}
                                    </h4>
                                    <p style={{ color: '#f97316', fontWeight: 800, fontSize: '1rem', margin: 0 }}>₹{item.foodId?.price}</p>
                                </div>

                                {/* Qty */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <button onClick={() => updateQuantity(item.foodId?._id, item.quantity - 1)} style={{
                                        width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                                        background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '1.1rem',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>−</button>
                                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.foodId?._id, item.quantity + 1)} style={{
                                        width: 32, height: 32, borderRadius: 8, border: 'none',
                                        background: 'linear-gradient(135deg,#f97316,#ef4444)', color: '#fff', fontSize: '1.1rem',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>+</button>
                                </div>

                                {/* Subtotal + Remove */}
                                <div style={{ textAlign: 'right', minWidth: 64, flexShrink: 0 }}>
                                    <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 4px', fontSize: '0.95rem' }}>₹{(item.foodId?.price || 0) * item.quantity}</p>
                                    <button onClick={() => removeFromCart(item.foodId?._id)} style={{
                                        background: 'none', border: 'none', color: '#444', fontSize: '0.75rem',
                                        cursor: 'pointer', padding: 0
                                    }}
                                        onMouseEnter={e => { e.target.style.color = '#f87171'; }}
                                        onMouseLeave={e => { e.target.style.color = '#444'; }}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div style={{
                        position: 'sticky', top: 80,
                        borderRadius: 20, padding: '24px',
                        background: 'rgba(249,115,22,0.07)',
                        border: '1px solid rgba(249,115,22,0.22)',
                        boxShadow: '0 0 60px rgba(249,115,22,0.08)'
                    }}>
                        <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', margin: '0 0 20px' }}>Order Summary</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                            {[['Subtotal', `₹${subtotal}`], ['Delivery', 'FREE'], ['Tax (5%)', `₹${tax}`]].map(([label, val]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                                    <span style={{ color: '#777' }}>{label}</span>
                                    <span style={{ color: label === 'Delivery' ? '#4ade80' : '#ddd', fontWeight: label === 'Delivery' ? 700 : 500 }}>{val}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                            <span style={{ color: '#f97316', fontWeight: 900, fontSize: '2rem', textShadow: '0 0 20px rgba(249,115,22,0.5)' }}>₹{grandTotal}</span>
                        </div>

                        <button onClick={() => navigate('/checkout')} disabled={loading} style={{
                            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                            background: 'linear-gradient(135deg,#f97316,#ef4444)',
                            color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                            boxShadow: '0 4px 24px rgba(249,115,22,0.45)', transition: 'transform .2s',
                            opacity: loading ? 0.6 : 1
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                            Proceed to Checkout →
                        </button>
                        <Link to="/" style={{ display: 'block', textAlign: 'center', color: '#555', fontSize: '0.82rem', marginTop: 14, textDecoration: 'none' }}
                            onMouseEnter={e => { e.target.style.color = '#888'; }}
                            onMouseLeave={e => { e.target.style.color = '#555'; }}>
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
