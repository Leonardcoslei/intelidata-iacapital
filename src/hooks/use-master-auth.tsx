import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const MASTER_PASSWORD = "BERNARDO";
const STORAGE_KEY = "motor_master_auth";

type MasterAuthCtx = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const Ctx = createContext<MasterAuthCtx>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export function MasterAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") setIsAuthenticated(true);
  }, []);

  const login = (password: string): boolean => {
    if (password === MASTER_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <Ctx.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useMasterAuth = () => useContext(Ctx);
