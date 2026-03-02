/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Seed one default admin user
const initialUsers = [
  { id: 1, name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Email atau password salah.' };
    setCurrentUser(user);
    return { success: true };
  };

  const register = (name, email, password) => {
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }
    const newUser = { id: Date.now(), name, email, password, role: 'user' };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => setCurrentUser(null);

  const updateProfile = (data) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
