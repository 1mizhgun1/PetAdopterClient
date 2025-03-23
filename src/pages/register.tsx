import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/api";
import { useUser } from "../hooks/useUser";
import BackButton from "../components/BackButton.tsx";

export default function Register() {
    const { post } = useApi();
    const { authenticate } = useUser();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            const response = await post("/user/signup", `{"username":"${username}","password":"${password}"}`);

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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <BackButton />
            <h2 className="text-xl font-bold mb-4">Регистрация</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)}
                       className="w-full p-2 border rounded" required />
                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
                       className="w-full p-2 border rounded" required />
                <input type="password" placeholder="Повторите пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                       className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Зарегистрироваться</button>
            </form>
        </div>
    );
}
