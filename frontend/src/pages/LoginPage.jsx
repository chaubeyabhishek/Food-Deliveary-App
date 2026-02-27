import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back! 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const pageStyle = {
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        background: '#080810',
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 15% 0%, rgba(249,115,22,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 85% 100%, rgba(239,68,68,0.12) 0%, transparent 55%)',
        position: 'relative', overflow: 'hidden'
    };

    return (
        <div style={pageStyle}>
            {/* Animated blobs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'float 7s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'float 9s ease-in-out infinite reverse', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }} className="fade-in">
                {/* Logo / Icon */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div className="float" style={{
                        display: 'inline-flex', width: 68, height: 68, borderRadius: 18,
                        alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                        background: 'linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.2))',
                        border: '1px solid rgba(249,115,22,0.35)',
                        boxShadow: '0 0 40px rgba(249,115,22,0.25)',
                        marginBottom: 16
                    }}>🍔</div>
                    <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
                        Welcome back
                    </h1>
                    <p style={{ color: '#555', fontSize: '0.9rem', marginTop: 8 }}>Sign in to order great food</p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20, padding: '32px 28px',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label style={{ display: 'block', color: '#777', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Email</label>
                            <input type="email" required value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="input-dark" />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#777', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Password</label>
                            <input type="password" required value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className="input-dark" />
                        </div>
                        <button type="submit" disabled={loading} className="btn-gradient" style={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <span className="spinner" /> Signing in...
                                </span>
                            ) : '🚀 Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                        <span style={{ color: '#444', fontSize: '0.8rem' }}>or</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    </div>

                    <p style={{ textAlign: 'center', color: '#555', fontSize: '0.875rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#f97316', fontWeight: 700, textDecoration: 'none' }}>
                            Sign up free →
                        </Link>
                    </p>
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, color: '#333', fontSize: '0.8rem' }}>
                    Admin?{' '}
                    <Link to="/admin/login" style={{ color: '#666', textDecoration: 'underline' }}>Admin login</Link>
                </p>
            </div>
        </div>
    );
}
