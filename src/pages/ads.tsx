import React, { useEffect, useState } from "react";
import { useApi } from '../api/api.ts';
import AdGrid from "../components/AdGrid.tsx";

interface Ad {
    info: {
        id: string;
        title: string;
        description: string;
        price: number;
        photo_url: string;
    };
    extra_info: {
        animal_name: string;
        breed_name: string;
        locality_name: string;
    };
}

const Ads: React.FC = () => {
    const { get } = useApi();
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        get("/ads")
            .then((response) => {
                const data = response.data as { ads: Ad[] };
                setAds(data.ads);
            })
            .catch((error) => {
                console.error("Ошибка загрузки объявлений:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center">Загрузка...</p>;

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Объявления</h1>
            <AdGrid ads={ads} />
        </div>
    );
}

export default Ads;
