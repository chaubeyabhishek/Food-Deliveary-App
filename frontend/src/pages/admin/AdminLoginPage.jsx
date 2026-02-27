import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(form.email, form.password);
            if (data.role !== 'admin') { toast.error('Admin access only'); return; }
            toast.success('Welcome back, Admin! 🛡️');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, background: '#080810',
            backgroundImage: 'radial-gradient(ellipse 70% 55% at 15% 0%, rgba(249,115,22,0.16) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 85% 100%, rgba(239,68,68,0.1) 0%, transparent 55%)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* BG blobs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />

            <div className="fade-in" style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div className="float" style={{ display: 'inline-flex', width: 70, height: 70, borderRadius: 20, alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', background: 'linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.2))', border: '1px solid rgba(249,115,22,0.4)', boxShadow: '0 0 40px rgba(249,115,22,0.25)', marginBottom: 16 }}>
                        🔐
                    </div>
                    <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px' }}>Admin Panel</h1>
                    <p style={{ color: '#555', fontSize: '0.88rem', margin: 0 }}>FoodRush Administration Console</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '5px 14px', borderRadius: 99, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316', fontSize: '0.75rem', fontWeight: 700 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', animation: 'pulse 2s infinite' }} />
                        Admin Access Only
                    </div>
                </div>

                {/* Card */}
                <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: '30px 26px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[{ key: 'email', type: 'email', label: 'Admin Email', ph: 'admin@foodrush.com' },
                        { key: 'password', type: 'password', label: 'Password', ph: '••••••••' }].map(({ key, type, label, ph }) => (
                            <div key={key}>
                                <label style={{ display: 'block', color: '#666', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</label>
                                <input type={type} required value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    placeholder={ph} className="input-dark" />
                            </div>
                        ))}
                        <button type="submit" disabled={loading} className="btn-gradient" style={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
                            {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span className="spinner" />Signing in...</span> : '🛡️ Admin Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: 18, color: '#333', fontSize: '0.8rem' }}>
                    Not an admin?{' '}
                    <Link to="/login" style={{ color: '#666', textDecoration: 'underline' }}>User login</Link>
                </p>
            </div>
        </div>
    );
}
