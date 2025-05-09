import React, { useState } from "react";
import { useUser } from "../hooks/useUser";
import { useApi } from "../api/api";
import { useNavigate } from "react-router-dom";
import DropdownSelect from "../components/DropdownSelect";
import "./CreateAdForm.css";

const CreateAdForm: React.FC = () => {
    const { username } = useUser();
    const { post } = useApi();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        animal_id: "",
        breed_id: "",
        price: 0,
        contacts: "",
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !photo) {
            setError("Заполните все поля!");
            return;
        }

        const formData = new FormData();
        formData.append("form", JSON.stringify(form));
        formData.append("photo", photo);

        try {
            await post(`/ads/create?username=${username}`, formData);
            navigate("/ads");
        } catch (err) {
            setError("Ошибка при создании объявления.");
        }
    };

    return (
        <div className="ad-form-container">
            <h2 className="ad-form-title">Создать объявление</h2>
            {error && <p className="ad-form-error">{error}</p>}

            <form onSubmit={handleSubmit} className="ad-form">
                <input name="title" type="text" placeholder="Заголовок" className="ad-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

                <textarea name="description" placeholder="Описание" className="ad-input ad-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

                <DropdownSelect
                    endpoint="/animals"
                    label="Выберите животное"
                    onChange={(id) => setForm({ ...form, animal_id: id, breed_id: "" })}
                />
                <DropdownSelect
                    endpoint="/breeds"
                    param={form.animal_id}
                    label="Выберите породу животного"
                    onChange={(id) => setForm({ ...form, breed_id: id })}
                    disabled={!form.animal_id}
                />

                <input name="price" type="number" placeholder="Цена" className="ad-input" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })} required />
                <input name="contacts" type="text" placeholder="Контакты" className="ad-input" value={form.contacts} onChange={(e) => setForm({ ...form, contacts: e.target.value })} required />

                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="ad-input" required />

                <button type="submit" className="ad-submit-button">Создать</button>
            </form>
        </div>
    );
};

export default CreateAdForm;
