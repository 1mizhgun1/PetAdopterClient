import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useApi } from "../api/api.ts";

const GeoLocationSelector: React.FC = () => {
    const { locality, updateLocality } = useUser();
    const { post } = useApi();
    const [ loading, setLoading ] = useState(false);

    const handleClick = () => {
        if (!navigator.geolocation) {
            alert('Геолокация не поддерживается вашим браузером.');
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log(position);
                const { latitude, longitude } = position.coords;
                try {
                    const response = await post('/user/set_locality', `{"latitude":"${latitude}","longitude":"${longitude}"}`);
                    // @ts-ignore
                    const locality = response.data.locality;
                    updateLocality(locality);
                } catch (error) {
                    console.error('Ошибка при отправке геолокации:', error);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error('Ошибка получения геолокации:', error);
                setLoading(false);
            }
        );
    };

    return (
        <button onClick={handleClick} disabled={loading} className="geo-button">
            {locality
                ? `📍 ${locality}`
                : loading
                    ? 'Определяем...'
                    : 'Указать местоположение'
            }
        </button>
    );
};

export default GeoLocationSelector;
