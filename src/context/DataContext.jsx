/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);

const initialProducts = [
  { id: 1, name: 'Nasi Goreng', price: 15000, stock: 50, category: 'Makanan' },
  { id: 2, name: 'Mie Goreng', price: 13000, stock: 40, category: 'Makanan' },
  { id: 3, name: 'Es Teh', price: 5000, stock: 100, category: 'Minuman' },
  { id: 4, name: 'Kopi Hitam', price: 7000, stock: 80, category: 'Minuman' },
];

export function DataProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState([]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const updateProduct = (id, data) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const checkout = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const trx = {
      id: Date.now(),
      items: cartItems,
      total,
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [...prev, trx]);
    // reduce stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = cartItems.find((c) => c.id === p.id);
        return item ? { ...p, stock: p.stock - item.qty } : p;
      })
    );
    return trx;
  };

  return (
    <DataContext.Provider value={{ products, transactions, addProduct, updateProduct, deleteProduct, checkout }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
