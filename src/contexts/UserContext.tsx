import React, { createContext, ReactNode } from 'react';

interface UserContextType {
    isAuthenticated: boolean;
    username: string | null;
    token: string | null;
    authenticate: (username: string, token: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({
    isAuthenticated: false,
    username: null,
    token: null,
    authenticate: () => {},
    logout: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [username, setUsername] = React.useState<string | null>(null);
    const [token, setToken] = React.useState<string | null>(null);

    React.useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedToken = localStorage.getItem('token');
        if (storedUsername && storedToken) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            setToken(storedToken);
        }
    }, []);

    const authenticate = (username: string, token: string) => {
        setIsAuthenticated(true);
        setUsername(username);
        setToken(token);
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername(null);
        setToken(null);
        localStorage.removeItem('username');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ isAuthenticated, username, token, authenticate, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
