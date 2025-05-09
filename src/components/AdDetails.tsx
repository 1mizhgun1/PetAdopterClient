import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useApi } from '../api/api';
import './AdDetails.css';
import {useUser} from "../hooks/useUser.ts";
import AdGrid from "./AdGrid.tsx";

interface Ad {
    info: {
        id: string;
        title: string;
        description: string;
        price: number;
        photo_url: string;
        contacts: string;
        status: "A" | "R" | "C";
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
    const { get, post } = useApi();
    const [ ad, setAd ] = useState<Ad | null>(null);
    const [ sameAds, setSameAds ] = useState<Ad[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ loadingSame, setLoadingSame ] = useState(true);
    const { username } = useUser();
    const navigate = useNavigate();
    const [ showPopup, setShowPopup ] = useState(false);

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

        get(`/ads/${id}/same`)
            .then((response) => {
                const data = response.data as {ads: Ad[]};
                setSameAds(data.ads)
            })
            .catch((error) => {
                console.log("Ошибка загрузки похожих объявлений", error);
            })
            .finally(() => setLoadingSame(false));
    }, [id]);

    const handleClose = async (status: "R" | "C") => {
        try {
            await post(`/ads/${ad?.info.id}/close?username=${username}`, { status });
            navigate("/ads");
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) return <p className="text-center">Загрузка...</p>;
    if (!ad) return <p className="text-center">Объявление не найдено</p>;

    return (
        <div className="ad-details-page">
            <div className="ad-header">
                <h1 className="ad-title">{ad.info.title}</h1>
                {username === ad.extra_info.username && (
                    <div className="ad-actions">
                        {ad.info.status === "R" ? (
                            <span className="ad-status-label realized">Объявление реализовано</span>
                        ) : ad.info.status === "C" ? (
                            <span className="ad-status-label revoked">Объявление отозвано</span>
                        ) : (
                            <>
                                <button
                                    className="edit-button"
                                    onClick={() => navigate(`/ads/${ad.info.id}/edit`, { state: { ad } })}
                                >
                                    ✏️ Редактировать
                                </button>
                                <button className="close-button" onClick={() => setShowPopup(true)}>
                                    ❌ Закрыть
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Выберите статус:</p>
                        <div className="popup-actions">
                            <button className="popup-button realized" onClick={() => handleClose("R")}>Реализовано</button>
                            <button className="popup-button revoked" onClick={() => handleClose("C")}>Отозвано</button>
                        </div>
                        <button className="popup-cancel" onClick={() => setShowPopup(false)}>Отмена</button>
                    </div>
                </div>
            )}

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

            <h1 className="ad-same">Похожие объявления</h1>

            {loadingSame ? <p>Загрузка...</p> : sameAds.length > 0 ? <AdGrid ads={sameAds}/> : <p>Ничего не найдено :(</p>}
        </div>
    );
}

export default AdDetails;
