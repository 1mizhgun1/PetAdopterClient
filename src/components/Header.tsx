import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import React from "react";
import { useApi } from "../api/api.ts";
import './Header.css';
import GeoLocationSelector from "./GeoLocationSelector.tsx";

const Header: React.FC = () => {
    const { isAuthenticated, username, logout } = useUser();
    const { post } = useApi();

    const handleLogout = async () => {
        if (!username) return;

        try {
            const response = await post(`/user/logout?username=${username}`);

            if (response.status === 200) {
                logout()
            } else {
                console.error("Ошибка выхода");
            }
        } catch (error) {
            console.error("Ошибка сети при выходе", error);
        }
    }

    return (
        <header className="header">
            <Link to="/ads" className="logo">🐾 Pet Adopter</Link>

            <nav className="nav">
                {isAuthenticated ? (
                    <>
                        <span className="username">Привет, {username}!</span>
                        <GeoLocationSelector />
                        <Link to="/ads/create" className="button create">+ Объявление</Link>
                        <button onClick={handleLogout} className="button logout">Выйти</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="button login">Войти</Link>
                        <Link to="/register" className="button register">Регистрация</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
