import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-blue-500 hover:underline">
            <ArrowLeft size={20} />
            <span>Назад</span>
        </button>
    );
};

export default BackButton;
