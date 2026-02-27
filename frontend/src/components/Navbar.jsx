import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
            background: 'rgba(8,8,16,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(249,115,22,0.18)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.4)'
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

                    {/* ── Logo ── */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: 'linear-gradient(135deg,#f97316,#ef4444)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, boxShadow: '0 0 20px rgba(249,115,22,0.5)'
                        }}>🍔</div>
                        <span style={{
                            fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.03em',
                            background: 'linear-gradient(135deg,#f97316,#ef4444,#ec4899)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>FoodRush</span>
                    </Link>

                    {/* ── Right ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {user ? (
                            <>
                                {/* User pill */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '6px 12px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '0.85rem'
                                }}>
                                    <div style={{
                                        width: 26, height: 26, borderRadius: '50%',
                                        background: 'linear-gradient(135deg,#f97316,#ef4444)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem', fontWeight: 800, color: '#fff', flexShrink: 0
                                    }}>
                                        {user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span style={{ color: '#ccc', fontWeight: 500, maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {user.name}
                                    </span>
                                </div>

                                {/* Orders */}
                                <Link to="/orders" style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '8px 14px', borderRadius: 10, textDecoration: 'none',
                                    color: '#aaa', fontSize: '0.875rem', fontWeight: 500,
                                    transition: 'all .2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; }}>
                                    📦 <span>Orders</span>
                                </Link>

                                {/* Cart */}
                                <Link to="/cart" style={{
                                    display: 'flex', alignItems: 'center', gap: 8, position: 'relative',
                                    padding: '8px 18px', borderRadius: 12, textDecoration: 'none',
                                    background: 'linear-gradient(135deg,#f97316,#ef4444)',
                                    color: '#fff', fontSize: '0.875rem', fontWeight: 700,
                                    boxShadow: '0 4px 18px rgba(249,115,22,0.45)',
                                    transition: 'all .2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                    🛒 Cart
                                    {cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: -8, right: -8,
                                            minWidth: 20, height: 20, borderRadius: '50%',
                                            background: '#ef4444', border: '2px solid #080810',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', fontWeight: 900, color: '#fff',
                                            boxShadow: '0 0 10px rgba(239,68,68,0.7)'
                                        }} className="pulse-badge">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Logout */}
                                <button onClick={() => { logout(); navigate('/login'); }} style={{
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    color: '#555', fontSize: '0.875rem', padding: '8px 12px',
                                    borderRadius: 10, transition: 'all .2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'transparent'; }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{
                                    padding: '8px 16px', borderRadius: 10, textDecoration: 'none',
                                    color: '#aaa', fontSize: '0.875rem', fontWeight: 500
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = 'transparent'; }}>
                                    Login
                                </Link>
                                <Link to="/register" style={{
                                    padding: '8px 20px', borderRadius: 12, textDecoration: 'none',
                                    background: 'linear-gradient(135deg,#f97316,#ef4444)',
                                    color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                                    boxShadow: '0 4px 18px rgba(249,115,22,0.45)',
                                    transition: 'all .2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
