import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import AdminNavbar from '../../components/AdminNavbar';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', address: '', isActive: true, imageUrl: '' };
const PLACEHOLDER = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80';

const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12, padding: '11px 16px', color: '#fff', fontSize: '0.88rem',
    outline: 'none', transition: 'border-color .2s', fontFamily: 'Inter, sans-serif',
};

const focusStyle = { borderColor: 'rgba(249,115,22,0.55)' };

function ImagePicker({ imageFile, setImageFile, imageUrl, setImageUrl }) {
    const fileInputRef = useRef();
    const [dragging, setDragging] = useState(false);
    const [tab, setTab] = useState('file'); // 'file' | 'url'

    const preview = imageFile
        ? URL.createObjectURL(imageFile)
        : imageUrl || null;

    const handleDrop = (e) => {
        e.preventDefault(); setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) { setImageFile(file); setImageUrl(''); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); setImageUrl(''); }
    };

    const clear = () => { setImageFile(null); setImageUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

    return (
        <div>
            {/* Tab row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[{ val: 'file', icon: '📁', label: 'Upload file' }, { val: 'url', icon: '🔗', label: 'Image URL' }].map(t => (
                    <button key={t.val} type="button" onClick={() => setTab(t.val)} style={{
                        padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 700, transition: 'all .2s',
                        background: tab === t.val ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${tab === t.val ? 'rgba(249,115,22,0.45)' : 'rgba(255,255,255,0.1)'}`,
                        color: tab === t.val ? '#f97316' : '#666',
                    }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 12 }}>
                {/* Upload or URL */}
                <div>
                    {tab === 'file' ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            style={{
                                border: `2px dashed ${dragging ? '#f97316' : 'rgba(255,255,255,0.14)'}`,
                                borderRadius: 14, padding: '24px 16px', textAlign: 'center',
                                cursor: 'pointer', transition: 'all .25s',
                                background: dragging ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.03)',
                                boxShadow: dragging ? '0 0 24px rgba(249,115,22,0.18)' : 'none'
                            }}
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{dragging ? '📥' : '🖼️'}</div>
                            <p style={{ color: dragging ? '#f97316' : '#666', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 4px' }}>
                                {dragging ? 'Drop image here' : 'Drag & drop or click to browse'}
                            </p>
                            <p style={{ color: '#444', fontSize: '0.72rem', margin: 0 }}>JPG, PNG, WebP</p>
                            {imageFile && (
                                <p style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: 8, fontWeight: 600 }}>
                                    ✅ {imageFile.name}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={e => { setImageUrl(e.target.value); setImageFile(null); }}
                                placeholder="https://example.com/image.jpg"
                                style={inputStyle}
                                onFocus={e => { e.target.style.borderColor = focusStyle.borderColor; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                            />
                            <p style={{ color: '#444', fontSize: '0.72rem', marginTop: 6 }}>Paste any direct image URL from Unsplash, Google etc.</p>
                        </div>
                    )}
                </div>

                {/* Preview */}
                {preview && (
                    <div style={{ position: 'relative' }}>
                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}
                            onError={e => { e.target.style.display = 'none'; }} />
                        <button type="button" onClick={clear} style={{
                            position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%',
                            background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: '0.8rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                        }}>✕</button>
                        <p style={{ color: '#555', fontSize: '0.7rem', marginTop: 6, textAlign: 'center' }}>Preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

    const fetch = () => api.get('/restaurants').then(({ data }) => setRestaurants(data));
    useEffect(() => { fetch(); }, []);

    const resetForm = () => {
        setForm(EMPTY); setImageFile(null); setImageUrl('');
        setEditingId(null); setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { toast.error('Restaurant name is required'); return; }
        if (!form.address.trim()) { toast.error('Address is required'); return; }

        setLoading(true);
        try {
            let response;

            if (imageFile) {
                // Only use FormData (multipart) when actually uploading a file
                const fd = new FormData();
                fd.append('name', form.name);
                fd.append('description', form.description);
                fd.append('address', form.address);
                fd.append('isActive', form.isActive);
                fd.append('image', imageFile);

                if (editingId) {
                    response = await api.put(`/restaurants/${editingId}`, fd);
                } else {
                    response = await api.post('/restaurants', fd);
                }
            } else {
                // No file — send plain JSON (bypasses multer middleware entirely)
                const payload = {
                    name: form.name,
                    description: form.description,
                    address: form.address,
                    isActive: form.isActive,
                    imageUrl: imageUrl || '',
                };
                if (editingId) {
                    response = await api.put(`/restaurants/${editingId}`, payload);
                } else {
                    response = await api.post('/restaurants', payload);
                }
            }

            toast.success(editingId ? 'Restaurant updated! ✅' : 'Restaurant added! 🎉');
            await fetch();
            resetForm();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Error saving restaurant';
            toast.error(msg);
            console.error('Save error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (r) => {
        setForm({ name: r.name, description: r.description || '', address: r.address, isActive: r.isActive, imageUrl: '' });
        setEditingId(r._id);
        setImageFile(null);
        setImageUrl(r.image || '');
        setShowForm(true);
        // Scroll to form accounting for fixed navbar
        setTimeout(() => {
            if (formRef.current) {
                const top = formRef.current.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }, 100);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this restaurant and all its food items?')) return;
        try {
            await api.delete(`/restaurants/${id}`);
            toast.success('Restaurant deleted');
            fetch();
        } catch { toast.error('Failed to delete'); }
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
        setTimeout(() => {
            if (formRef.current) {
                const top = formRef.current.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }, 100);
    };

    const label = (text, required = false) => (
        <label style={{ display: 'block', color: '#666', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
            {text}{required && <span style={{ color: '#f97316', marginLeft: 3 }}>*</span>}
        </label>
    );

    const onFocus = e => { e.target.style.borderColor = focusStyle.borderColor; };
    const onBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; };

    return (
        <div style={{ minHeight: '100vh', background: '#080810', paddingBottom: 60 }}>
            <AdminNavbar />
            <div style={{ paddingTop: 88, maxWidth: 1280, margin: '0 auto', padding: '88px 24px 60px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>🍽️ Restaurants</h1>
                        <p style={{ color: '#555', fontSize: '0.83rem', marginTop: 6 }}>{restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} registered</p>
                    </div>
                    <button onClick={showForm ? resetForm : handleAddNew} style={{
                        padding: '10px 22px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
                        background: showForm ? 'rgba(239,68,68,0.12)' : 'linear-gradient(135deg,#f97316,#ef4444)',
                        border: showForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
                        color: showForm ? '#f87171' : '#fff',
                        boxShadow: showForm ? 'none' : '0 4px 20px rgba(249,115,22,0.4)'
                    }}>
                        {showForm ? '✕ Cancel' : '+ Add Restaurant'}
                    </button>
                </div>

                {/* ── FORM ── */}
                {showForm && (
                    <div ref={formRef}>
                        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.22)', borderRadius: 20, padding: '28px 24px', marginBottom: 28, boxShadow: '0 0 50px rgba(249,115,22,0.08)' }}>
                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.8)', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                                {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {/* Name */}
                                <div>
                                    {label('Restaurant Name', true)}
                                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Punjab Grill" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                {/* Address */}
                                <div>
                                    {label('Address', true)}
                                    <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                                        placeholder="Sector 12, Connaught Place, Delhi" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                {/* Description */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    {label('Description')}
                                    <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                        placeholder="Briefly describe the restaurant's specialty..." style={{ ...inputStyle, resize: 'none', lineHeight: 1.55 }}
                                        onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                {/* Image Picker */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    {label('Restaurant Image')}
                                    <ImagePicker imageFile={imageFile} setImageFile={setImageFile} imageUrl={imageUrl} setImageUrl={setImageUrl} />
                                </div>

                                {/* Status toggle */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div>
                                        {label('Status')}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })} style={{
                                                width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
                                                background: form.isActive ? 'linear-gradient(135deg,#4ade80,#22c55e)' : 'rgba(255,255,255,0.1)',
                                                position: 'relative', transition: 'background .25s', boxShadow: form.isActive ? '0 0 10px rgba(74,222,128,0.4)' : 'none'
                                            }}>
                                                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.isActive ? 23 : 3, transition: 'left .25s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
                                            </button>
                                            <span style={{ color: form.isActive ? '#4ade80' : '#555', fontSize: '0.82rem', fontWeight: 600 }}>
                                                {form.isActive ? 'Open for orders' : 'Currently closed'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 10, marginTop: 22, alignItems: 'center' }}>
                                <button type="submit" disabled={loading} style={{
                                    padding: '11px 28px', borderRadius: 12, border: 'none',
                                    background: 'linear-gradient(135deg,#f97316,#ef4444)',
                                    color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.65 : 1, boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
                                    fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8,
                                    transition: 'transform .15s'
                                }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.03)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                                    {loading ? <><span className="spinner" /> Saving...</> : editingId ? '✅ Update Restaurant' : '🎉 Add Restaurant'}
                                </button>
                                <button type="button" onClick={resetForm} style={{
                                    padding: '11px 18px', borderRadius: 12,
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#555', cursor: 'pointer', fontSize: '0.875rem',
                                }}>Cancel</button>
                                {!imageFile && !imageUrl && (
                                    <span style={{ color: '#444', fontSize: '0.75rem', marginLeft: 8 }}>💡 Image is optional — the restaurant will be saved without one</span>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* ── GRID ── */}
                {restaurants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: 14 }} className="float">🍽️</div>
                        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No restaurants yet</p>
                        <p style={{ fontSize: '0.85rem', marginTop: 6 }}>Click "Add Restaurant" above to get started!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(278px,1fr))', gap: 18 }}>
                        {restaurants.map((r, i) => (
                            <div key={r._id} className="fade-in food-card" style={{
                                animationDelay: `${i * 50}ms`,
                                borderRadius: 18, overflow: 'hidden',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}>
                                <div style={{ position: 'relative', height: 165 }}>
                                    <img src={r.image || PLACEHOLDER} alt={r.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={e => { e.target.src = PLACEHOLDER; }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,16,.85) 0%, transparent 60%)' }} />
                                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700,
                                            backdropFilter: 'blur(8px)',
                                            background: r.isActive ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                                            border: `1px solid ${r.isActive ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                                            color: r.isActive ? '#4ade80' : '#f87171'
                                        }}>
                                            {r.isActive ? '● Open' : '● Closed'}
                                        </span>
                                    </div>
                                    <h3 style={{ position: 'absolute', bottom: 10, left: 14, color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0 }}>{r.name}</h3>
                                </div>

                                <div style={{ padding: '12px 14px 14px' }}>
                                    <p style={{ color: '#555', fontSize: '0.8rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', marginBottom: 8 }}>{r.description || 'No description'}</p>
                                    <p style={{ color: '#3d3d3d', fontSize: '0.75rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span style={{ color: 'rgba(249,115,22,0.5)' }}>📍</span>{r.address}
                                    </p>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Link to={`/admin/restaurants/${r._id}/foods`} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#999', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', transition: 'all .2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#999'; }}>
                                            🍕 Foods
                                        </Link>
                                        <button onClick={() => handleEdit(r)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}>
                                            ✏️ Edit
                                        </button>
                                        <button onClick={() => handleDelete(r._id)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}>
                                            🗑️ Delete
                                        </button>
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
