import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';

export default function RestaurantCard({ restaurant }) {
    return (
        <Link to={`/restaurant/${restaurant._id}`} style={{ textDecoration: 'none', display: 'block' }}
            className="food-card hover-border">
            <div style={{
                borderRadius: 16, overflow: 'hidden',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                transition: 'all .3s ease',
            }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <img
                        src={restaurant.image || PLACEHOLDER}
                        alt={restaurant.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s ease', display: 'block' }}
                        onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                        onError={e => { e.target.src = PLACEHOLDER; }}
                    />
                    {/* Gradient overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(8,8,16,.95) 0%, rgba(8,8,16,.35) 55%, transparent 100%)'
                    }} />
                    {/* Status badge */}
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                        {restaurant.isActive ? (
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '4px 10px', borderRadius: 99,
                                background: 'rgba(34,197,94,0.18)',
                                border: '1px solid rgba(34,197,94,0.4)',
                                color: '#4ade80', fontSize: '0.72rem', fontWeight: 700,
                                backdropFilter: 'blur(8px)'
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                                Open
                            </span>
                        ) : (
                            <span style={{
                                padding: '4px 10px', borderRadius: 99,
                                background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.4)',
                                color: '#f87171', fontSize: '0.72rem', fontWeight: 700,
                                backdropFilter: 'blur(8px)'
                            }}>Closed</span>
                        )}
                    </div>
                    {/* Name */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px' }}>
                        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                            {restaurant.name}
                        </h3>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 16px 16px' }}>
                    <p style={{
                        color: '#666', fontSize: '0.82rem', lineHeight: 1.55, marginBottom: 12, minHeight: 40,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                        {restaurant.description || 'Fresh and delicious food delivered fast.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#555', fontSize: '0.78rem', overflow: 'hidden' }}>
                            <span style={{ color: '#f97316', opacity: 0.7 }}>📍</span>
                            <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 130 }}>
                                {restaurant.address}
                            </span>
                        </div>
                        <span style={{ color: '#f97316', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            View Menu →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
