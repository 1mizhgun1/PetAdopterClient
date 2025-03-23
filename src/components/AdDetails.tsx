import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from '../api/api';

interface Ad {
    info: {
        id: string;
        title: string;
        description: string;
        price: number;
        photo_url: string;
        contacts: string;
    };
    extra_info: {
        animal_name: string;
        breed_name: string;
        locality_name: string;
        username: string;
    };
}

const AdDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { get } = useApi();
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        get(`/ads/${id}`)
            .then((response) => {
                const data = response.data as { ad: Ad };
                setAd(data.ad);
            })
            .catch((error) => {
                console.error("Ошибка загрузки объявления:", error);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-center">Загрузка...</p>;
    if (!ad) return <p className="text-center">Объявление не найдено</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <img
                src={`http://localhost/pet_adopter_photos/${ad.info.photo_url}`}
                alt={ad.info.title}
                className="w-full h-64 object-cover rounded-lg"
            />
            <h1 className="text-2xl font-bold mt-4">{ad.info.title}</h1>
            <p className="text-gray-600">{ad.info.description}</p>
            <p className="text-xl font-semibold mt-2">{ad.info.price} ₽</p>
            <p className="text-sm text-gray-500">
                {ad.extra_info.animal_name} • {ad.extra_info.breed_name} •{" "}
                {ad.extra_info.locality_name}
            </p>
            <p className="mt-4 text-blue-600">Контакты: {ad.info.contacts}</p>
        </div>
    );
}

export default AdDetails;
