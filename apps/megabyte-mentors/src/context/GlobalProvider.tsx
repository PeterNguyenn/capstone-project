/* eslint-disable @typescript-eslint/no-empty-function */
import { useContext, useState, useEffect, createContext } from 'react';
import { useApiQuery } from '../api/hooks';
import authService, { AuthUser } from '../api/services/auth.service';

export type GlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
};

const GlobalContext = createContext<GlobalContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  loading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const { data, loading, error } = useApiQuery(authService.getProfile);

  useEffect(() => {
    if (data) {
      setUser(data.data.user);
      setIsLoggedIn(true);
    }

    if(error) {
      setIsLoggedIn(false);
      setUser(null);
      console.error('Error fetching profile:', error);
    }
    
  }, [data, error]);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, loading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
