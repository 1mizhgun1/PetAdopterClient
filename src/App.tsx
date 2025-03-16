import React, { useState, useEffect } from 'react';
import { UserProvider } from './contexts/UserContext';
import { useApi } from './api/api';
import { useUser } from './hooks/useUser';

const App: React.FC = () => {
    const { get, post } = useApi();
    const { isAuthenticated, authenticate, logout } = useUser();
    const [data, setData] = useState<any>(null);

    useEffect(() => {2
        // Пример GET запроса
        if (isAuthenticated) {
            get('/user')
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    console.error('GET request error:', error);
                });
        }
    }, [get, isAuthenticated]);

    const handleRegister = () => {
        // Пример POST запроса для регистрации
        post('/user/signup', { username: 'testuser3', password: 'testpassword' })
            .then(response => {
                console.log('Registration response:', response);
                // Обработка ответа и вызов authenticate
                const token = response.headers.authorization?.split(' ')[1];
                if (token) {
                    authenticate('testuser', token);
                }
            })
            .catch(error => {
                console.error('Registration request error:', error);
            });
    };

    const handleLogin = () => {
        // Пример POST запроса для авторизации
        post('/user/login', { username: 'testuser3', password: 'testpassword' })
            .then(response => {
                console.log('Login response:', response);
                // Обработка ответа и вызов authenticate
                const token = response.headers.authorization?.split(' ')[1];
                if (token) {
                    authenticate('testuser', token);
                }
            })
            .catch(error => {
                console.error('Login request error:', error);
            });
    };

    return (
        <UserProvider>
            <div>
                <button onClick={handleRegister} disabled={isAuthenticated}>
                    Register
                </button>
                <button onClick={handleLogin} disabled={isAuthenticated}>
                    Login
                </button>
                <button onClick={logout} disabled={!isAuthenticated}>
                    Logout
                </button>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </UserProvider>
    );
};

export default App;