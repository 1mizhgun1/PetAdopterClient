import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from '../api/api';

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

const AdsList: React.FC = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {ads.map((ad) => (
                <div key={ad.info.id} className="border rounded-lg shadow-lg p-4">
                    <div className="p-4">
                        <img
                            src={`http://localhost/pet_adopter_photos/${ad.info.photo_url}`} // Учитываем путь к фото
                            alt={ad.info.title}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <Link to={`/ads/${ad.info.id}`} className="text-lg font-bold mt-2 text-blue-600 hover:underline">
                            {ad.info.title}
                        </Link>
                        <p className="text-gray-600">{ad.info.description}</p>
                        <p className="text-sm text-gray-500">
                            {ad.extra_info.animal_name} • {ad.extra_info.breed_name} •{" "}
                            {ad.extra_info.locality_name}
                        </p>
                        <p className="text-xl font-semibold mt-2">{ad.info.price} ₽</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AdsList;
