import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80';

const CAT_COLORS = {
    'Biryani': { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: 'rgba(251,191,36,0.35)' },
    'Burger': { bg: 'rgba(249,115,22,0.15)', color: '#fb923c', border: 'rgba(249,115,22,0.35)' },
    'Pizza': { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.35)' },
    'Snacks': { bg: 'rgba(52,211,153,0.15)', color: '#34d399', border: 'rgba(52,211,153,0.35)' },
    'Drinks': { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: 'rgba(96,165,250,0.35)' },
    'Indian': { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: 'rgba(167,139,250,0.35)' },
};
const DEF_CAT = { bg: 'rgba(255,255,255,0.08)', color: '#aaa', border: 'rgba(255,255,255,0.15)' };

export default function FoodItemCard({ food }) {
    const { addToCart } = useCart();
    const cat = CAT_COLORS[food.category] || DEF_CAT;

    const handleAdd = async () => {
        try {
            await addToCart(food._id, 1);
            toast.success(`Added ${food.name} 🛒`, { icon: '✅' });
        } catch {
            toast.error('Please log in to add items');
        }
    };

    return (
        <div className="food-card" style={{
            borderRadius: 16, overflow: 'hidden',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', flexDirection: 'column',
        }}>
            {/* Image */}
            <div style={{ position: 'relative', height: 172, overflow: 'hidden' }}>
                <img src={food.image || PLACEHOLDER} alt={food.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease' }}
                    onMouseEnter={e => { e.target.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                    onError={e => { e.target.src = PLACEHOLDER; }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(8,8,16,0.9) 0%, transparent 55%)'
                }} />

                {/* Category badge */}
                {food.category && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        padding: '3px 10px', borderRadius: 99,
                        background: cat.bg, border: `1px solid ${cat.border}`,
                        color: cat.color, fontSize: '0.7rem', fontWeight: 700,
                        backdropFilter: 'blur(8px)'
                    }}>
                        {food.category}
                    </div>
                )}

                {/* Veg/Non-veg indicator */}
                {food.isVeg !== undefined && (
                    <div style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 22, height: 22, borderRadius: 4,
                        border: `2px solid ${food.isVeg ? '#4ade80' : '#f87171'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(8px)'
                    }}>
                        <div style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: food.isVeg ? '#4ade80' : '#f87171'
                        }} />
                    </div>
                )}

                {/* Price overlay at bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px' }}>
                    <span style={{
                        color: '#f97316', fontWeight: 900, fontSize: '1.2rem',
                        textShadow: '0 0 20px rgba(249,115,22,0.5)'
                    }}>₹{food.price}</span>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '14px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, letterSpacing: '-0.01em', margin: 0 }}>
                    {food.name}
                </h4>
                {food.description && (
                    <p style={{
                        color: '#555', fontSize: '0.8rem', lineHeight: 1.5, margin: 0,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                        {food.description}
                    </p>
                )}

                <button onClick={handleAdd}
                    style={{
                        marginTop: 'auto', padding: '10px 0', borderRadius: 12, cursor: 'pointer',
                        background: 'linear-gradient(135deg, #f97316, #ef4444)',
                        border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                        boxShadow: '0 4px 18px rgba(249,115,22,0.35)',
                        transition: 'all .2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(249,115,22,0.35)'; }}>
                    + Add to Cart
                </button>
            </div>
        </div>
    );
}
