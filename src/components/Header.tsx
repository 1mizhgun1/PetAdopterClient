import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import React from "react";
import {useApi} from "../api/api.ts";

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
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <Link to="/ads" className="text-xl font-bold">Pet Adopter</Link>

            <div>
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <span className="text-lg">{username}</span>
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
                            Выйти
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="bg-blue-500 px-4 py-2 rounded">Войти</Link>
                        <Link to="/register" className="bg-green-500 px-4 py-2 rounded">Регистрация</Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
