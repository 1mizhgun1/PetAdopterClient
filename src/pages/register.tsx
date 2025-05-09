import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/api";
import { useUser } from "../hooks/useUser";
import BackButton from "../components/BackButton.tsx";
import "./register.css";

export default function Register() {
    const { post } = useApi();
    const { authenticate } = useUser();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const validateUsername = (username: string) => {
        const regex = /^[a-zA-Z0-9_]+$/;
        if (username.length < 3 || username.length > 20) {
            return "Логин должен быть от 3 до 20 символов";
        }
        if (!regex.test(username)) {
            return "Логин может содержать только английские буквы, цифры и символ _";
        }
        return "";
    };

    const validatePassword = (password: string) => {
        const regex = /^[a-zA-Z0-9!_-]+$/;
        if (password.length < 8 || password.length > 20) {
            return "Пароль должен быть от 8 до 20 символов";
        }
        if (!regex.test(password)) {
            return "Пароль может содержать только английские буквы, цифры и символы: !, -, _";
        }
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setUsernameError("");
        setPasswordError("");
        setConfirmError("");

        const uError = validateUsername(username);
        const pError = validatePassword(password);
        const cError = password !== confirmPassword ? "Пароли не совпадают" : "";

        if (uError || pError || cError) {
            setUsernameError(uError);
            setPasswordError(pError);
            setConfirmError(cError);
            return;
        }

        try {
            const response = await post("/user/signup", `{"username":"${username}","password":"${password}"}`);

            if (response.status === 200) {
                const token = response.headers["authorization"]?.replace("Bearer ", "");
                if (!token) throw new Error("Токен не найден в заголовке");

                // @ts-ignore
                const locality = response.data.locality

                authenticate(username, locality, token);
                navigate("/ads");
            } else {
                setError("Пользователь с таким логином уже существует");
            }
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            setError("Ошибка регистрации");
        }
    };

    return (
        <div className="register-container">
            <BackButton />
            <h2 className="register-title">Регистрация</h2>
            {error && <p className="register-error">{error}</p>}
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                />
                {usernameError && <p className="register-field-error">{usernameError}</p>}

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                {passwordError && <p className="register-field-error">{passwordError}</p>}

                <input
                    type="password"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="register-input"
                />
                {confirmError && <p className="register-field-error">{confirmError}</p>}

                <button type="submit" className="register-button">Зарегистрироваться</button>
            </form>
        </div>
    );
}
