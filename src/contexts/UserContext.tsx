import React, { createContext, ReactNode } from 'react';

interface UserContextType {
    isAuthenticated: boolean;
    username: string | null;
    locality: string | null;
    token: string | null;
    updateLocality: (locality: string) => void;
    authenticate: (username: string, locality: string, token: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({
    updateLocality: () => {},
    isAuthenticated: false,
    username: null,
    locality: null,
    token: null,
    authenticate: () => {},
    logout: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [username, setUsername] = React.useState<string | null>(null);
    const [locality, setLocality] = React.useState<string | null>(null);
    const [token, setToken] = React.useState<string | null>(null);

    React.useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedLocality = localStorage.getItem('locality');
        const storedToken = localStorage.getItem('token');
        if (storedUsername && storedToken) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            setLocality(storedLocality);
            setToken(storedToken);
        }
    }, []);

    const updateLocality = (locality: string) => {
        setLocality(locality)
        localStorage.setItem('locality', locality);
    };

    const authenticate = (username: string, locality: string, token: string) => {
        setIsAuthenticated(true);
        setUsername(username);
        setLocality(locality);
        setToken(token);
        localStorage.setItem('username', username);
        localStorage.setItem('locality', locality);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername(null);
        setLocality(null);
        setToken(null);
        localStorage.removeItem('username');
        localStorage.removeItem('locality');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ isAuthenticated, username, locality, token, updateLocality, authenticate, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
