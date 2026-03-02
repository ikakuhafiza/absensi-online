import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

function StatCard({ title, value, icon, color }) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className={`card border-0 text-white bg-${color} h-100`}>
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <div className="small text-white-50">{title}</div>
            <div className="fs-3 fw-bold">{value}</div>
          </div>
          <div style={{ fontSize: '2.5rem', opacity: 0.5 }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { products, transactions } = useData();

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 10);

  const recent = [...transactions].reverse().slice(0, 5);

  return (
    <div className="container-fluid py-4">
      <h5 className="mb-1 fw-bold">Dashboard</h5>
      <p className="text-muted mb-4">Selamat datang, {currentUser?.name}! 👋</p>

      <div className="row g-3 mb-4">
        <StatCard title="Total Produk" value={products.length} icon="📦" color="primary" />
        <StatCard title="Total Stok" value={totalStock.toLocaleString()} icon="🗂️" color="success" />
        <StatCard title="Total Transaksi" value={transactions.length} icon="🧾" color="warning" />
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
          icon="💰"
          color="danger"
        />
      </div>

      <div className="row g-3">
        {/* Recent Transactions */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 fw-semibold">🧾 Transaksi Terbaru</div>
            <div className="card-body p-0">
              {recent.length === 0 ? (
                <p className="text-muted text-center py-4">Belum ada transaksi.</p>
              ) : (
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Tanggal</th>
                      <th>Item</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((t, i) => (
                      <tr key={t.id}>
                        <td>{transactions.length - i}</td>
                        <td className="small">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                        <td className="small">{t.items.length} item</td>
                        <td className="text-end fw-semibold">
                          Rp {t.total.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 fw-semibold">⚠️ Stok Menipis</div>
            <div className="card-body">
              {lowStock.length === 0 ? (
                <p className="text-muted text-center py-2">Semua stok aman ✅</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {lowStock.map((p) => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between px-0">
                      <span>{p.name}</span>
                      <span className="badge bg-danger">{p.stock} tersisa</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 d-flex gap-2">
                <Link to="/pos" className="btn btn-primary btn-sm">
                  Buka POS
                </Link>
                <Link to="/products" className="btn btn-outline-secondary btn-sm">
                  Kelola Produk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
