import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) { setError('Nama tidak boleh kosong.'); return; }

    if (form.password) {
      if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return; }
      if (form.password !== form.confirm) { setError('Konfirmasi password tidak cocok.'); return; }
    }

    const updates = { name: form.name.trim() };
    if (form.password) updates.password = form.password;

    updateProfile(updates);
    setSuccess('Profil berhasil diperbarui!');
    setForm((prev) => ({ ...prev, password: '', confirm: '' }));
  };

  return (
    <div className="container py-4" style={{ maxWidth: 540 }}>
      <h5 className="fw-bold mb-4">👤 Profil Saya</h5>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body text-center py-4">
          <div
            className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 72, height: 72, fontSize: '1.8rem' }}
          >
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <h6 className="fw-bold mb-0">{currentUser?.name}</h6>
          <p className="text-muted small mb-1">{currentUser?.email}</p>
          <span className="badge bg-primary text-capitalize">{currentUser?.role}</span>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 fw-semibold">Edit Profil</div>
        <div className="card-body">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                disabled
              />
              <div className="form-text">Email tidak dapat diubah.</div>
            </div>
            <hr />
            <p className="text-muted small">Kosongkan jika tidak ingin mengubah password.</p>
            <div className="mb-3">
              <label className="form-label">Password Baru</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Min. 6 karakter"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirm"
                className="form-control"
                placeholder="Ulangi password baru"
                value={form.confirm}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
