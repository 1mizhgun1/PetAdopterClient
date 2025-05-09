import React, { useEffect, useState } from "react";
import { useApi } from '../api/api.ts';
import AdGrid from "../components/AdGrid.tsx";
import DropdownSelect from "../components/DropdownSelect.tsx";
import {useUser} from "../hooks/useUser.ts";
import "./ads.css"

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
    const { username, locality } = useUser();

    const [selectedAnimal, setSelectedAnimal] = useState("");
    const [selectedBreed, setSelectedBreed] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [radius, setRadius] = useState("");

    const fetchAds = () => {
        const params = new URLSearchParams();
        if (selectedAnimal) params.append("animal_id", selectedAnimal);
        if (selectedBreed) params.append("breed_id", selectedBreed);
        if (minPrice) params.append("min_price", minPrice);
        if (maxPrice) params.append("max_price", maxPrice);
        if (radius) params.append("radius", radius);
        if (radius) params.append("username", username);
        get(`/ads?${params.toString()}`)
            .then((response) => {
                const data = response.data as { ads: Ad[] };
                setAds(data.ads);
            })
            .catch((error) => {
                console.error("Ошибка загрузки объявлений:", error);
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchAds()
    }, []);

    return (
        <div className="ads-container">
            <h1>Объявления</h1>
            <div className="filters">
                <DropdownSelect
                    endpoint="/animals"
                    label="Животное"
                    onChange={(id) => {setSelectedAnimal(id); setSelectedBreed("");}}
                />
                <DropdownSelect
                    endpoint="/breeds"
                    param={selectedAnimal}
                    label="Порода"
                    onChange={(id) => setSelectedBreed(id)}
                    disabled={!selectedAnimal}
                />
                <input
                    type="number"
                    placeholder="Цена от"
                    maxLength={8}
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value.replace(/\D/g, ''))}
                />
                <input
                    type="number"
                    placeholder="Цена до"
                    maxLength={8}
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                />
                {locality === "" ? (
                    <></>
                ) : (
                    <input
                        type="number"
                        placeholder="Радиус поиска (км)"
                        maxLength={3}
                        value={radius}
                        onChange={e => setRadius(e.target.value.replace(/\D/g, ''))}
                    />
                )}

                <button className="search-button" onClick={fetchAds}>Поиск</button>
            </div>

            {loading ? <p>Загрузка...</p> : <AdGrid ads={ads}/>}
        </div>
    );
}

export default Ads;
