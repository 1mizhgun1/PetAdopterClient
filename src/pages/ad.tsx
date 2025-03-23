import React from "react";
import AdDetails from "../components/AdDetails";
import BackButton from "../components/BackButton.tsx";

const AdPage: React.FC = () => {
    return (
        <div>
            <BackButton />
            <h1 className="text-2xl font-bold p-4">Детали объявления</h1>
            <AdDetails />
        </div>
    );
}

export default AdPage;
