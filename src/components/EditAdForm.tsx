import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../api/api";
import DropdownSelect from "../components/DropdownSelect";
import "./CreateAdForm.css";
import {useUser} from "../hooks/useUser.ts";

const EditAdForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { post } = useApi();
    const { username } = useUser();

    const ad = location.state?.ad;

    const [form, setForm] = useState({
        title: ad.info.title || "",
        description: ad.info.description || "",
        animal_id: ad.info.animal_id || "",
        breed_id: ad.info.breed_id || "",
        price: ad.info.price || 0,
        contacts: ad.info.contacts || "",
    });

    const [photo, setPhoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        const fieldsToUpdate = Object.keys(form).filter((key) => form[key] !== ad.info[key]);

        try {
            if (fieldsToUpdate.length > 0) {
                await post(`/ads/${ad.info.id}/update?username=${username}`, {
                    form,
                    fields_to_update: fieldsToUpdate,
                });
            }

            if (photo) {
                const formData = new FormData();
                formData.append("photo", photo);
                await post(`/ads/${ad.info.id}/update_photo?username=${username}`, formData);
            }

            navigate(`/ads/${ad.info.id}`);
        } catch (err) {
            console.error("Ошибка при обновлении объявления:", err);
            setError("Ошибка при обновлении объявления");
        }
    };

    return (
        <div className="ad-form-container">
            <h2 className="ad-form-title">Редактировать объявление</h2>
            {error && <p className="ad-form-error">{error}</p>}

            <form onSubmit={handleSubmit} className="ad-form">
                <label className="create-ad-form-label">Название объявления - будет отображаться в общем списке</label>
                <input name="title" type="text" placeholder="Заголовок" className="ad-input" value={form.title}
                       onChange={(e) => setForm({...form, title: e.target.value})} required/>

                <label className="create-ad-form-label">Расскажите о питомце</label>
                <textarea name="description" placeholder="Описание" className="ad-input ad-textarea"
                          value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                          required/>

                <DropdownSelect
                    endpoint="/animals"
                    label="Выберите животное"
                    onChange={(id) => setForm({...form, animal_id: id, breed_id: null})}
                    initialState={form.animal_id}
                />
                <DropdownSelect
                    endpoint="/breeds"
                    param={form.animal_id}
                    label="Выберите породу животного"
                    onChange={(id) => setForm({...form, breed_id: id})}
                    disabled={!form.animal_id}
                    initialState={form.breed_id}
                />

                <label className="create-ad-form-label">Укажите цену в российских рублях, либо оставьте 0 (отдать в
                    добрые руки 😊)</label>
                <input name="price" type="number" placeholder="Цена" className="ad-input" value={form.price}
                       onChange={(e) => setForm({...form, price: parseInt(e.target.value)})} required/>
                <label className="create-ad-form-label">Как с Вами можно связаться</label>
                <input name="contacts" type="text" placeholder="Контакты" className="ad-input" value={form.contacts}
                       onChange={(e) => setForm({...form, contacts: e.target.value})} required/>
                <label className="create-ad-form-label">Можете обновить фотографию животного</label>
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                       className="ad-input"/>

                <button type="submit" className="ad-submit-button">Сохранить</button>
            </form>
        </div>
    );
};

export default EditAdForm;
