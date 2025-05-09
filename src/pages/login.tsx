import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useApi } from "../api/api";
import BackButton from "../components/BackButton.tsx";
import "./login.css"; // не забудь создать этот файл и подключить

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { authenticate } = useUser();
    const { post } = useApi();
    const navigate = useNavigate();

    const validateUsername = (username: string) => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (username.length < 3 || username.length > 20) {
            return "Логин должен быть от 3 до 20 символов";
        }
        if (!usernameRegex.test(username)) {
            return "Логин может содержать только английские буквы, цифры и символ _";
        }
        return "";
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^[a-zA-Z0-9!_-]+$/;
        if (password.length < 8 || password.length > 20) {
            return "Пароль должен быть от 8 до 20 символов";
        }
        if (!passwordRegex.test(password)) {
            return "Пароль может содержать только английские буквы, цифры и символы: !, -, _";
        }
        return "";
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setUsernameError("");
        setPasswordError("");

        const usernameValidationError = validateUsername(username);
        const passwordValidationError = validatePassword(password);

        if (usernameValidationError || passwordValidationError) {
            setUsernameError(usernameValidationError);
            setPasswordError(passwordValidationError);
            return;
        }

        try {
            const response = await post("/user/login", `{"username":"${username}","password":"${password}"}`);

            if (response.status === 200) {
                const token = response.headers["authorization"]?.replace("Bearer ", "");
                if (!token) throw new Error("Токен не найден в заголовке");

                // @ts-ignore
                const locality = response.data.locality

                authenticate(username, locality, token);
                navigate("/ads");
            } else {
                setError("Неверный логин или пароль");
            }
        } catch (err) {
            console.error("Ошибка авторизации:", err);
            setError("Ошибка авторизации");
        }
    };

    return (
        <div className="login-container">
            <BackButton />
            <h2 className="login-title">Вход</h2>
            {error && <p className="login-error">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
                {usernameError && <p className="login-field-error">{usernameError}</p>}

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                {passwordError && <p className="login-field-error">{passwordError}</p>}

                <button type="submit" className="login-button">Войти</button>
            </form>
        </div>
    );
}
