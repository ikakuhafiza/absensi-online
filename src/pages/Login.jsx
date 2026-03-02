import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(form.email, form.password);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-4">
          <h4 className="card-title text-center mb-1 fw-bold text-primary">🏪 Absensi Online</h4>
          <p className="text-center text-muted mb-4 small">Masuk ke akun Anda</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <hr />
          <p className="text-center mb-0 small">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary fw-semibold">
              Daftar sekarang
            </Link>
          </p>
          <p className="text-center mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
            Demo: admin@example.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
