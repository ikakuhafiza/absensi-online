import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function POS() {
  const { products, checkout } = useData();
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [lastTrx, setLastTrx] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((c) => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    const product = products.find((p) => p.id === id);
    if (qty > product.stock) return;
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty } : c));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const trx = checkout(cart);
    setLastTrx(trx);
    setCart([]);
    setShowReceipt(true);
  };

  return (
    <div className="container-fluid py-4">
      <h5 className="mb-4 fw-bold">🛒 Point of Sale</h5>

      {showReceipt && lastTrx && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✅ Transaksi Berhasil</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReceipt(false)}
                />
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-2">
                  {new Date(lastTrx.date).toLocaleString('id-ID')}
                </p>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastTrx.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-end">
                          Rp {(item.price * item.qty).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold">
                      <td colSpan="2">Total</td>
                      <td className="text-end">Rp {lastTrx.total.toLocaleString('id-ID')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setShowReceipt(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3">
        {/* Product Grid */}
        <div className="col-12 col-lg-8">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="row g-2">
            {filtered.map((p) => (
              <div key={p.id} className="col-6 col-md-4 col-xl-3">
                <div
                  className={`card h-100 ${p.stock <= 0 ? 'opacity-50' : 'cursor-pointer'}`}
                  style={{ cursor: p.stock > 0 ? 'pointer' : 'not-allowed' }}
                  onClick={() => addToCart(p)}
                >
                  <div className="card-body p-2 text-center">
                    <div style={{ fontSize: '2rem' }}>📦</div>
                    <div className="fw-semibold small">{p.name}</div>
                    <div className="text-primary small fw-bold">
                      Rp {p.price.toLocaleString('id-ID')}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                      Stok: {p.stock}
                    </div>
                    {p.stock <= 0 && (
                      <span className="badge bg-danger mt-1">Habis</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-muted text-center py-4">Produk tidak ditemukan.</p>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
            <div className="card-header bg-primary text-white fw-semibold">
              🛒 Keranjang ({cart.length})
            </div>
            <div className="card-body p-2" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <p className="text-muted text-center py-3">Keranjang kosong</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center gap-2 mb-2 border-bottom pb-2"
                  >
                    <div className="flex-grow-1">
                      <div className="small fw-semibold">{item.name}</div>
                      <div className="small text-muted">
                        Rp {item.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <button
                        className="btn btn-outline-secondary btn-sm py-0 px-1"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="small fw-bold px-1">{item.qty}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm py-0 px-1"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm py-0 px-1"
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="card-footer bg-white">
              <div className="d-flex justify-content-between fw-bold mb-2">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <button
                className="btn btn-success w-100"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
