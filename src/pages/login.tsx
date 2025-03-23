import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useApi } from '../api/api';
import BackButton from "../components/BackButton.tsx";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { authenticate } = useUser();
    const { post } = useApi();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await post("/user/login", `{"username":"${username}","password":"${password}"}`);

            if (response.status === 200) {
                const token = response.headers["authorization"]?.replace("Bearer ", "");
                if (!token) throw new Error("Токен не найден в заголовке");

                authenticate(username, token); // Сохраняем пользователя в контексте
                navigate("/ads"); // Перенаправляем на страницу объявлений
            } else {
                setError("Неверный логин или пароль");
            }
        } catch (err) {
            console.error("Ошибка авторизации:", err);
            setError("Ошибка авторизации");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <BackButton />
            <h2 className="text-2xl font-bold mb-4">Вход</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Войти
                </button>
            </form>
        </div>
    );
}
