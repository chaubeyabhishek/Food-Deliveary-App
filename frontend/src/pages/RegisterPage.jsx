import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Account created! Welcome 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const PERKS = [
        { icon: '🚀', text: 'Free delivery on first order' },
        { icon: '⭐', text: 'Exclusive member deals' },
        { icon: '📦', text: 'Real-time order tracking' },
    ];

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', background: '#080810',
            backgroundImage: 'radial-gradient(ellipse 80% 60% at 85% 0%, rgba(236,72,153,0.15) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 15% 100%, rgba(249,115,22,0.12) 0%, transparent 55%)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Blobs */}
            <div style={{ position: 'absolute', top: '-8%', left: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'float 8s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-8%', right: '-5%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'float 10s ease-in-out infinite reverse', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }} className="fade-in">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div className="float" style={{
                        display: 'inline-flex', width: 68, height: 68, borderRadius: 18,
                        alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                        background: 'linear-gradient(135deg,rgba(236,72,153,0.2),rgba(249,115,22,0.2))',
                        border: '1px solid rgba(236,72,153,0.35)',
                        boxShadow: '0 0 40px rgba(236,72,153,0.2)',
                        marginBottom: 16
                    }}>🎉</div>
                    <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
                        Create account
                    </h1>
                    <p style={{ color: '#555', fontSize: '0.9rem', marginTop: 8 }}>Join thousands of happy food lovers</p>

                    {/* Perks */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                        {PERKS.map(({ icon, text }) => (
                            <span key={text} style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '5px 10px', borderRadius: 99,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#666', fontSize: '0.72rem'
                            }}>
                                {icon} {text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20, padding: '32px 28px',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { key: 'name', type: 'text', label: 'Full Name', placeholder: 'John Doe' },
                            { key: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com' },
                            { key: 'password', type: 'password', label: 'Password', placeholder: '6+ characters' },
                        ].map(({ key, type, label, placeholder }) => (
                            <div key={key}>
                                <label style={{ display: 'block', color: '#777', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                                    {label}
                                </label>
                                <input type={type} required value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    placeholder={placeholder}
                                    className="input-dark" />
                            </div>
                        ))}

                        <button type="submit" disabled={loading} className="btn-gradient" style={{ width: '100%', textAlign: 'center', marginTop: 6 }}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <span className="spinner" /> Creating account...
                                </span>
                            ) : '🎉 Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 20, color: '#555', fontSize: '0.875rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#f97316', fontWeight: 700, textDecoration: 'none' }}>
                            Sign in →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
