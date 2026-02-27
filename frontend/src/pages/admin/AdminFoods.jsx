import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import toast from 'react-hot-toast';

const EMPTY = { name: '', price: '', category: 'General', description: '', isAvailable: true };
const PLACEHOLDER = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80';

const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12, padding: '11px 16px', color: '#fff', fontSize: '0.88rem',
    outline: 'none', transition: 'border-color .2s', fontFamily: 'Inter, sans-serif',
};
const onFocus = e => { e.target.style.borderColor = 'rgba(249,115,22,0.55)'; };
const onBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; };

/* ── Shared Image Picker ── */
function ImagePicker({ imageFile, setImageFile, imageUrl, setImageUrl }) {
    const ref = useRef();
    const [drag, setDrag] = useState(false);
    const [tab, setTab] = useState('file');
    const preview = imageFile ? URL.createObjectURL(imageFile) : imageUrl || null;

    const onDrop = e => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith('image/')) { setImageFile(f); setImageUrl(''); }
    };
    const onChange = e => { const f = e.target.files[0]; if (f) { setImageFile(f); setImageUrl(''); } };
    const clear = () => { setImageFile(null); setImageUrl(''); if (ref.current) ref.current.value = ''; };

    return (
        <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[{ val: 'file', icon: '📁', label: 'Upload file' }, { val: 'url', icon: '🔗', label: 'Image URL' }].map(t => (
                    <button key={t.val} type="button" onClick={() => setTab(t.val)} style={{
                        padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, transition: 'all .2s',
                        background: tab === t.val ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${tab === t.val ? 'rgba(249,115,22,0.45)' : 'rgba(255,255,255,0.1)'}`,
                        color: tab === t.val ? '#f97316' : '#666',
                    }}>{t.icon} {t.label}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 12 }}>
                <div>
                    {tab === 'file' ? (
                        <div onClick={() => ref.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDrag(true); }}
                            onDragLeave={() => setDrag(false)} onDrop={onDrop}
                            style={{ border: `2px dashed ${drag ? '#f97316' : 'rgba(255,255,255,0.14)'}`, borderRadius: 14, padding: '20px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all .25s', background: drag ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.03)', boxShadow: drag ? '0 0 24px rgba(249,115,22,0.18)' : 'none' }}>
                            <input ref={ref} type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
                            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{drag ? '📥' : '🖼️'}</div>
                            <p style={{ color: drag ? '#f97316' : '#666', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 3px' }}>
                                {drag ? 'Drop to upload' : 'Drag & drop or click to browse'}
                            </p>
                            <p style={{ color: '#444', fontSize: '0.7rem', margin: 0 }}>JPG, PNG, WebP</p>
                            {imageFile && <p style={{ color: '#4ade80', fontSize: '0.72rem', marginTop: 6, fontWeight: 600 }}>✅ {imageFile.name}</p>}
                        </div>
                    ) : (
                        <div>
                            <input type="url" value={imageUrl} onChange={e => { setImageUrl(e.target.value); setImageFile(null); }}
                                placeholder="https://example.com/food.jpg" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                            <p style={{ color: '#444', fontSize: '0.72rem', marginTop: 6 }}>Paste any direct image URL</p>
                        </div>
                    )}
                </div>
                {preview && (
                    <div style={{ position: 'relative' }}>
                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', maxHeight: 110, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} onError={e => { e.target.style.display = 'none'; }} />
                        <button type="button" onClick={clear} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
                        <p style={{ color: '#444', fontSize: '0.68rem', marginTop: 4, textAlign: 'center' }}>Preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Main Page ── */
export default function AdminFoods() {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    const fetchData = () => Promise.all([
        api.get(`/restaurants/${restaurantId}`),
        api.get(`/foods/${restaurantId}`),
    ]).then(([rRes, fRes]) => { setRestaurant(rRes.data); setFoods(fRes.data); });

    useEffect(() => { fetchData(); }, [restaurantId]);

    const resetForm = () => { setForm(EMPTY); setImageFile(null); setImageUrl(''); setEditingId(null); setShowForm(false); };

    const scrollToForm = () => {
        setTimeout(() => {
            if (formRef.current) {
                const top = formRef.current.getBoundingClientRect().top + window.scrollY - 84;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }, 80);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { toast.error('Name is required'); return; }
        if (!form.price || isNaN(form.price)) { toast.error('Enter a valid price'); return; }
        setLoading(true);
        try {
            let response;

            if (imageFile) {
                // Use FormData only when a file is selected (multipart upload)
                const fd = new FormData();
                fd.append('name', form.name);
                fd.append('price', form.price);
                fd.append('category', form.category);
                fd.append('description', form.description);
                fd.append('isAvailable', form.isAvailable);
                fd.append('image', imageFile);

                if (editingId) {
                    response = await api.put(`/foods/${editingId}`, fd);
                } else {
                    response = await api.post(`/foods/${restaurantId}`, fd);
                }
            } else {
                // No file — send plain JSON (bypasses multer entirely)
                const payload = {
                    name: form.name,
                    price: form.price,
                    category: form.category,
                    description: form.description,
                    isAvailable: form.isAvailable,
                    imageUrl: imageUrl || '',
                };
                if (editingId) {
                    response = await api.put(`/foods/${editingId}`, payload);
                } else {
                    response = await api.post(`/foods/${restaurantId}`, payload);
                }
            }

            toast.success(editingId ? 'Food item updated! ✅' : 'Food item added! 🎉');
            await fetchData(); resetForm();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Error saving food item';
            toast.error(msg);
            console.error('Save error:', err.response?.data || err.message);
        } finally { setLoading(false); }
    };

    const handleEdit = (f) => {
        setForm({ name: f.name, price: f.price, category: f.category, description: f.description || '', isAvailable: f.isAvailable });
        setEditingId(f._id);
        setImageFile(null);
        setImageUrl(f.image || '');
        setShowForm(true);
        scrollToForm();
    };

    const handleAddNew = () => { resetForm(); setShowForm(true); scrollToForm(); };

    const handleDelete = async (id) => {
        if (!confirm('Delete this food item?')) return;
        try { await api.delete(`/foods/${id}`); toast.success('Deleted'); fetchData(); }
        catch { toast.error('Failed to delete'); }
    };

    const label = (text, required = false) => (
        <label style={{ display: 'block', color: '#666', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
            {text}{required && <span style={{ color: '#f97316', marginLeft: 3 }}>*</span>}
        </label>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#080810', paddingBottom: 60 }}>
            <AdminNavbar />
            <div style={{ paddingTop: 88, maxWidth: 1280, margin: '0 auto', padding: '88px 24px 60px' }}>

                {/* Breadcrumb */}
                <div style={{ marginBottom: 18 }}>
                    <Link to="/admin/restaurants" style={{ color: '#555', fontSize: '0.82rem', textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#f97316'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}>
                        ← Restaurants
                    </Link>
                    {restaurant && <span style={{ color: '#333', fontSize: '0.82rem' }}> / {restaurant.name}</span>}
                </div>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>🍕 Food Items</h1>
                        {restaurant && <p style={{ color: '#555', fontSize: '0.83rem', marginTop: 4 }}>{restaurant.name} · {foods.length} item{foods.length !== 1 ? 's' : ''}</p>}
                    </div>
                    <button onClick={showForm ? resetForm : handleAddNew} style={{
                        padding: '10px 22px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
                        background: showForm ? 'rgba(239,68,68,0.12)' : 'linear-gradient(135deg,#f97316,#ef4444)',
                        border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
                        color: showForm ? '#f87171' : '#fff',
                        boxShadow: showForm ? 'none' : '0 4px 20px rgba(249,115,22,0.4)'
                    }}>
                        {showForm ? '✕ Cancel' : '+ Add Food Item'}
                    </button>
                </div>

                {/* ── FORM ── */}
                {showForm && (
                    <div ref={formRef}>
                        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.22)', borderRadius: 20, padding: '28px 24px', marginBottom: 28, boxShadow: '0 0 50px rgba(249,115,22,0.07)' }}>
                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.8)', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                                {editingId ? 'Edit Food Item' : 'Add New Food Item'}
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    {label('Item Name', true)}
                                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Butter Chicken" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>
                                <div>
                                    {label('Price (₹)', true)}
                                    <input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 299" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>
                                <div>
                                    {label('Category')}
                                    <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Biryani, Snacks, Drinks" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>
                                <div>
                                    {label('Description')}
                                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                {/* Image Picker */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    {label('Food Image')}
                                    <ImagePicker imageFile={imageFile} setImageFile={setImageFile} imageUrl={imageUrl} setImageUrl={setImageUrl} />
                                </div>

                                {/* Availability toggle */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {label('Availability')}
                                    <button type="button" onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })} style={{ width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', background: form.isAvailable ? 'linear-gradient(135deg,#4ade80,#22c55e)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background .25s', boxShadow: form.isAvailable ? '0 0 10px rgba(74,222,128,0.4)' : 'none' }}>
                                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.isAvailable ? 23 : 3, transition: 'left .25s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
                                    </button>
                                    <span style={{ color: form.isAvailable ? '#4ade80' : '#555', fontSize: '0.8rem', fontWeight: 600 }}>
                                        {form.isAvailable ? 'Available' : 'Sold Out'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 22, alignItems: 'center' }}>
                                <button type="submit" disabled={loading} style={{ padding: '11px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#f97316,#ef4444)', color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1, boxShadow: '0 4px 20px rgba(249,115,22,0.4)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform .15s' }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.03)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                    {loading ? <><span className="spinner" /> Saving...</> : editingId ? '✅ Update Item' : '🎉 Add Food Item'}
                                </button>
                                <button type="button" onClick={resetForm} style={{ padding: '11px 18px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#555', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── FOOD GRID ── */}
                {foods.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: 14 }} className="float">🍕</div>
                        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No food items yet</p>
                        <p style={{ fontSize: '0.85rem', marginTop: 6 }}>Click "Add Food Item" above to get started!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 }}>
                        {foods.map((f, i) => (
                            <div key={f._id} className="fade-in food-card" style={{ animationDelay: `${i * 40}ms`, borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ position: 'relative', height: 140 }}>
                                    <img src={f.image || PLACEHOLDER} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = PLACEHOLDER; }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,16,.85) 0%, transparent 55%)' }} />
                                    <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 700, backdropFilter: 'blur(6px)', background: f.isAvailable ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)', border: `1px solid ${f.isAvailable ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`, color: f.isAvailable ? '#4ade80' : '#f87171' }}>
                                        {f.isAvailable ? 'Available' : 'Sold Out'}
                                    </span>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px' }}>
                                        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 2px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{f.name}</h4>
                                        <span style={{ color: '#f97316', fontWeight: 900, fontSize: '0.95rem' }}>₹{f.price}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '10px 12px' }}>
                                    {f.category && <span style={{ fontSize: '0.72rem', color: '#555', fontWeight: 600 }}>{f.category}</span>}
                                    <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
                                        <button onClick={() => handleEdit(f)} style={{ flex: 1, padding: '8px 0', borderRadius: 9, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}>✏️ Edit</button>
                                        <button onClick={() => handleDelete(f._id)} style={{ flex: 1, padding: '8px 0', borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}>🗑️ Delete</button>
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
