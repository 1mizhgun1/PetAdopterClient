import AdsList from "../components/AdsList";
import React from "react";

const AdsPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold p-4">Объявления</h1>
            <AdsList />
        </div>
    );
}

export default AdsPage;
