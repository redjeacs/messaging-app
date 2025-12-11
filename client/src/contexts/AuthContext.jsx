import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth must be used within a AuthProvider");

  return authContext;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        async () => {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
              headers: { Authorizatoin: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Sessuib fetcg failed");
            const data = await res.json();
            setUser(data.user);
          } catch {
            setUser(null);
          }
        };
        api;
      }
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, useAuth };
