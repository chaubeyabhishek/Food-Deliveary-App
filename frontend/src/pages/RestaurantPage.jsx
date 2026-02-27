import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import FoodItemCard from '../components/FoodItemCard';
import Navbar from '../components/Navbar';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80';

const S = {
    page: { minHeight: '100vh', background: '#080810' },
    skeletonBanner: { height: 280, background: 'linear-gradient(90deg,#111120 25%,#1c1c35 50%,#111120 75%)', backgroundSize: '1000px 100%', animation: 'shimmer 2s infinite' },
    banner: { position: 'relative', height: 280, overflow: 'hidden' },
    bannerImg: { width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)' },
    bannerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080810 0%, rgba(8,8,16,.65) 55%, rgba(8,8,16,.15) 100%)' },
    bannerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 32px' },
    restaurantName: { color: '#fff', fontWeight: 900, fontSize: 'clamp(1.75rem,5vw,3rem)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 },
    desc: { color: '#aaa', fontSize: '0.9rem', marginTop: 6, maxWidth: 520, lineHeight: 1.6 },
    statusRow: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' },
    address: { color: '#666', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 },
    tabBar: { position: 'sticky', top: 64, zIndex: 40, background: 'rgba(8,8,16,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 32px' },
    tabScroll: { display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' },
    content: { maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 18 },
    empty: { textAlign: 'center', padding: '80px 0', color: '#555' },
};

export default function RestaurantPage() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get(`/restaurants/${id}`), api.get(`/foods/${id}`)])
            .then(([rRes, fRes]) => {
                setRestaurant(rRes.data);
                setFoods(fRes.data);
                setCategories(['All', ...new Set(fRes.data.map(f => f.category).filter(Boolean))]);
            }).finally(() => setLoading(false));
    }, [id]);

    const filtered = activeCategory === 'All' ? foods : foods.filter(f => f.category === activeCategory);

    if (loading) return (
        <div style={S.page}><Navbar />
            <div style={{ paddingTop: 64 }}>
                <div style={S.skeletonBanner} />
                <div style={S.content}><div style={S.grid}>
                    {[...Array(8)].map((_, i) => <div key={i} style={{ height: 260, borderRadius: 16 }} className="shimmer" />)}
                </div></div>
            </div>
        </div>
    );

    if (!restaurant) return (
        <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '4rem' }}>🍽️</div><p style={{ color: '#555', marginTop: 12 }}>Restaurant not found</p></div>
        </div>
    );

    const isOpen = restaurant.isActive;

    return (
        <div style={S.page}>
            <Navbar />
            <div style={{ paddingTop: 64 }}>
                {/* Banner */}
                <div style={S.banner}>
                    <img src={restaurant.image || PLACEHOLDER} alt={restaurant.name} style={S.bannerImg}
                        onError={e => { e.target.src = PLACEHOLDER; }} />
                    <div style={S.bannerOverlay} />
                    <div style={S.bannerContent}>
                        <h1 style={S.restaurantName}>{restaurant.name}</h1>
                        <p style={S.desc}>{restaurant.description}</p>
                        <div style={S.statusRow}>
                            <span style={S.address}><span style={{ color: '#f97316' }}>📍</span> {restaurant.address}</span>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
                                background: isOpen ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                border: `1px solid ${isOpen ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                                color: isOpen ? '#4ade80' : '#f87171'
                            }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isOpen ? '#4ade80' : '#f87171', animation: isOpen ? 'pulse 2s infinite' : 'none' }} />
                                {isOpen ? 'Open Now' : 'Closed'}
                            </span>
                            <span style={{ color: '#555', fontSize: '0.78rem' }}>{foods.length} items on menu</span>
                        </div>
                    </div>
                </div>

                {/* Category tabs */}
                <div style={S.tabBar}>
                    <div style={S.tabScroll} className="scrollbar-hide">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                                flexShrink: 0, padding: '8px 18px', borderRadius: 99, fontSize: '0.85rem', fontWeight: 600,
                                cursor: 'pointer', transition: 'all .2s',
                                background: activeCategory === cat ? 'linear-gradient(135deg,#f97316,#ef4444)' : 'rgba(255,255,255,0.05)',
                                border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                color: activeCategory === cat ? '#fff' : '#777',
                                boxShadow: activeCategory === cat ? '0 4px 18px rgba(249,115,22,0.4)' : 'none',
                            }}>{cat}</button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div style={S.content}>
                    {filtered.length > 0 ? (
                        <>
                            <p style={{ color: '#444', fontSize: '0.82rem', marginBottom: 20 }}>
                                {filtered.length} item{filtered.length !== 1 ? 's' : ''} · <span style={{ color: '#f97316' }}>{activeCategory === 'All' ? 'Full menu' : activeCategory}</span>
                            </p>
                            <div style={S.grid}>
                                {filtered.map((food, i) => (
                                    <div key={food._id} className="fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                                        <FoodItemCard food={food} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={S.empty}>
                            <div style={{ fontSize: '3.5rem', marginBottom: 12 }} className="float">🍽️</div>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No items in this category</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
