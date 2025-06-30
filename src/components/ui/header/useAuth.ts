import { useState } from 'react';

// Custom hook to handle authentication state
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Mock login/logout functions
  const login = () => {
    setIsLoggedIn(true);
    setUser({ name: 'Abdelrahman Magdy', email: 'abdelrahman@example.com' });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
};
