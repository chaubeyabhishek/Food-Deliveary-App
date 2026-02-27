import { useState, useEffect } from 'react';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';
import Navbar from '../components/Navbar';

const CUISINES = [
    { label: 'All', emoji: '🍽️' },
    { label: 'Indian', emoji: '🍛' },
    { label: 'Biryani', emoji: '🍚' },
    { label: 'Burger', emoji: '🍔' },
    { label: 'Pizza', emoji: '🍕' },
    { label: 'Snacks', emoji: '🥪' },
];

export default function HomePage() {
    const [restaurants, setRestaurants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/restaurants')
            .then(({ data }) => { setRestaurants(data); setFiltered(data); })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = restaurants;
        if (activeFilter !== 'All') {
            result = result.filter(r =>
                r.name.toLowerCase().includes(activeFilter.toLowerCase()) ||
                r.description?.toLowerCase().includes(activeFilter.toLowerCase())
            );
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(r =>
                r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, activeFilter, restaurants]);

    return (
        <div style={{ minHeight: '100vh', background: '#050505', backgroundImage: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(255,94,0,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 110%, rgba(229,46,113,0.15) 0%, transparent 60%)' }}>
            <Navbar />

            {/* ── HERO ── */}
            <div style={{ paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
                <div style={{ textAlign: 'center', padding: '72px 24px 60px', maxWidth: 900, margin: '0 auto' }}>

                    {/* Badge */}
                    <div className="motion-badge" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '8px 18px', borderRadius: 99,
                        background: 'rgba(255,138,0,0.1)',
                        border: '1px solid rgba(255,138,0,0.3)',
                        color: '#ff8a00', fontSize: '0.85rem', fontWeight: 600,
                        marginBottom: 28, transition: 'all 0.3s ease', cursor: 'pointer'
                    }}>
                        <span style={{ animation: 'pulse 2s infinite' }}>🔥</span>
                        Fast Delivery · Fresh Food · Best Restaurants
                    </div>

                    {/* Headline */}
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 20 }}>
                        Food Delivered<br />
                        <span style={{ background: 'linear-gradient(90deg, #ff8a00, #e52e71)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Swadist</span>
                    </h1>
                    <p style={{ color: '#a0a0a0', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.65 }}>
                        Order from top restaurants near you and track delivery in real-time. Hot & fresh, always.
                    </p>

                    {/* Search */}
                    <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
                        <div className="motion-search" style={{
                            display: 'flex', alignItems: 'center',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,138,0,0.2)',
                            borderRadius: 16,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            overflow: 'hidden', backdropFilter: 'blur(10px)'
                        }}>
                            <span className="motion-search-icon" style={{ padding: '0 16px', fontSize: '1.2rem', color: '#888' }}>🔍</span>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search restaurants, cuisines..."
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                    color: '#fff', fontSize: '0.95rem', padding: '16px 0',
                                }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="hover-close" style={{
                                    background: 'transparent', border: 'none', color: '#888',
                                    fontSize: '1rem', padding: '0 16px', cursor: 'pointer', transition: 'all 0.3s'
                                }}>✕</button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 40, flexWrap: 'wrap' }}>
                        {[['🍽️', '6+', 'Restaurants'], ['🍕', '48+', 'Dishes'], ['⚡', '30 min', 'Avg Delivery'], ['⭐', '4.8', 'Rating']].map(([icon, val, label]) => (
                            <div key={label} className="motion-stat" style={{ textAlign: 'center', cursor: 'default' }}>
                                <div className="stat-icon" style={{ fontSize: '1.5rem', marginBottom: 4 }}>{icon}</div>
                                <div style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', lineHeight: 1 }}>{val}</div>
                                <div style={{ color: '#888', fontSize: '0.75rem', marginTop: 3, fontWeight: 500 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CUISINE FILTERS ── */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', marginBottom: 32 }}>
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }} className="scrollbar-hide">
                    {CUISINES.map(({ label, emoji }) => (
                        <button key={label} onClick={() => setActiveFilter(label)} className="cuisine-btn"
                            style={{
                                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 20px', borderRadius: 99,
                                fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                                background: activeFilter === label ? 'linear-gradient(135deg, #ff8a00, #e52e71)' : 'rgba(255,255,255,0.03)',
                                border: activeFilter === label ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                                color: activeFilter === label ? '#fff' : '#aaa',
                                boxShadow: activeFilter === label ? '0 6px 20px rgba(229,46,113,0.3)' : 'none',
                                transform: activeFilter === label ? 'scale(1.05)' : 'scale(1)',
                            }}>
                            <span className="cuisine-emoji">{emoji}</span> {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── RESTAURANT GRID ── */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        {search || activeFilter !== 'All' ? 'Search Results' : 'All Restaurants'}
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>
                        {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="shimmer" style={{ height: 280, borderRadius: 16, background: 'rgba(255,255,255,0.02)' }} />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                        {filtered.map((r, i) => (
                            <div key={r._id} className="fade-in motion-card" style={{ animationDelay: `${i * 60}ms` }}>
                                <RestaurantCard restaurant={r} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 16 }} className="float">🍽️</div>
                        <h3 style={{ color: '#888', fontSize: '1.25rem', fontWeight: 700 }}>No restaurants found</h3>
                        <p style={{ color: '#555', marginTop: 8, fontSize: '0.9rem' }}>Try a different search or filter</p>
                        <button onClick={() => { setSearch(''); setActiveFilter('All'); }} className="clear-btn"
                            style={{
                                marginTop: 20, padding: '10px 24px', borderRadius: 12, cursor: 'pointer',
                                background: 'transparent', border: '1px solid rgba(255,138,0,0.4)',
                                color: '#ff8a00', fontWeight: 600, fontSize: '0.875rem'
                            }}>
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Hover and Motion Styles */}
            <style>{`
                .motion-badge:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 6px 20px rgba(255,138,0,0.25); border-color: rgba(255,138,0,0.6) !important; }
                .motion-search { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .motion-search:hover { border-color: rgba(255,138,0,0.5) !important; box-shadow: 0 8px 30px rgba(255,138,0,0.15) !important; background: rgba(255,255,255,0.06) !important; transform: translateY(-1px); }
                .motion-search-icon { transition: transform 0.3s ease; }
                .motion-search:hover .motion-search-icon { transform: scale(1.15) rotate(-10deg); color: #ff8a00 !important; }
                .hover-close:hover { color: #fff !important; transform: rotate(90deg); }
                .motion-stat { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .motion-stat:hover { transform: translateY(-8px); filter: drop-shadow(0 10px 20px rgba(255,138,0,0.15)); }
                .stat-icon { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); display: inline-block; }
                .motion-stat:hover .stat-icon { transform: scale(1.3) rotate(12deg); }
                .cuisine-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
                .cuisine-btn:hover { transform: translateY(-3px) scale(1.05) !important; border-color: rgba(255,138,0,0.4) !important; background: rgba(255,255,255,0.06) !important; }
                .cuisine-emoji { transition: transform 0.3s ease; display: inline-block; }
                .cuisine-btn:hover .cuisine-emoji { transform: scale(1.2); }
                .motion-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: block; border-radius: inherit; }
                .motion-card:hover { transform: translateY(-8px); z-index: 10; position: relative; }
                .motion-card:hover > div { box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,138,0,0.15); border-color: rgba(255,138,0,0.3) !important; }
                .clear-btn { transition: all 0.3s ease !important; }
                .clear-btn:hover { background: rgba(255,138,0,0.15) !important; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,138,0,0.2); }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
}
