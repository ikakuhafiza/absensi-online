import { useState } from 'react';
import { useData } from '../context/DataContext';

const CATEGORIES = ['Makanan', 'Minuman', 'Snack', 'Lainnya'];

const emptyForm = { name: '', price: '', stock: '', category: 'Makanan' };

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Nama produk wajib diisi.'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('Harga harus lebih dari 0.'); return; }
    if (!form.stock || Number(form.stock) < 0) { setError('Stok tidak boleh negatif.'); return; }

    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
    };

    if (editId !== null) {
      updateProduct(editId, data);
    } else {
      addProduct(data);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold mb-0">📦 Manajemen Produk</h5>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          + Tambah Produk
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between">
          <span>Hapus produk ini?</span>
          <div className="d-flex gap-2">
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deleteConfirm)}>
              Ya, Hapus
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th className="text-end">Harga</th>
                <th className="text-center">Stok</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Produk tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{p.name}</td>
                    <td>
                      <span className="badge bg-secondary">{p.category}</span>
                    </td>
                    <td className="text-end">Rp {p.price.toLocaleString('id-ID')}</td>
                    <td className="text-center">
                      <span className={`badge ${p.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-1"
                        onClick={() => openEdit(p)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setDeleteConfirm(p.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId !== null ? '✏️ Edit Produk' : '+ Tambah Produk'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  <div className="mb-3">
                    <label className="form-label">Nama Produk</label>
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
                    <label className="form-label">Kategori</label>
                    <select
                      name="category"
                      className="form-select"
                      value={form.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label">Harga (Rp)</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        min="1"
                        value={form.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Stok</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        min="0"
                        value={form.stock}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
