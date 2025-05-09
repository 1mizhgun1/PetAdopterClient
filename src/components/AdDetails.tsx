import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from '../api/api';
import './AdDetails.css';

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
        <div className="ad-details-page">
            <h1 className="ad-title">{ad.info.title}</h1>

            <div className="ad-content">
                <div className="ad-photo">
                    <img
                        src={`http://localhost/pet_adopter_photos/${ad.info.photo_url}`}
                        alt={ad.info.title}
                    />
                </div>

                <div className="ad-info">
                    <table>
                        <tbody>
                        <tr>
                            <th>Животное:</th>
                            <td>{ad.extra_info.animal_name}</td>
                        </tr>
                        <tr>
                            <th>Порода:</th>
                            <td>{ad.extra_info.breed_name}</td>
                        </tr>
                        <tr>
                            <th>Цена:</th>
                            <td>{ad.info.price === 0 ? "Бесплатно" : `${ad.info.price} ₽`}</td>
                        </tr>
                        <tr>
                            <th>Местоположение:</th>
                            <td>{ad.extra_info.locality_name === "" ? "не указано" : ad.extra_info.locality_name}</td>
                        </tr>
                        <tr>
                            <th>Контакты:</th>
                            <td>{ad.info.contacts}</td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="ad-description">
                        <h2>Описание</h2>
                        <p>{ad.info.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdDetails;
