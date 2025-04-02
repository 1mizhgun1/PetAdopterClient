import React, { useState } from "react";
import { useUser } from "../hooks/useUser";
import { useApi } from "../api/api";
import { useNavigate } from "react-router-dom";
import DropdownSelect from "../components/DropdownSelect";

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
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Создать объявление</h2>
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" type="text" placeholder="Заголовок" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                <textarea name="description" placeholder="Описание" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

                {/* Выпадающий список животных */}
                <DropdownSelect endpoint="/animals" label="Животное" onChange={(id) => setForm({ ...form, animal_id: id, breed_id: "" })} />

                {/* Выпадающий список пород (зависит от animal_id) */}
                <DropdownSelect
                    endpoint="/breeds"
                    param={form.animal_id}
                    label="Порода"
                    onChange={(id) => setForm({ ...form, breed_id: id })}
                    disabled={!form.animal_id}
                />

                <input name="price" type="number" placeholder="Цена" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })} required />
                <input name="contacts" type="text" placeholder="Контакты" className="input" value={form.contacts} onChange={(e) => setForm({ ...form, contacts: e.target.value })} required />
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} required />

                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">Создать</button>
            </form>
        </div>
    );
};

export default CreateAdForm;
