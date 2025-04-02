import React, { useEffect, useState } from "react";
import { useApi } from "../api/api";

interface DropdownSelectProps {
    endpoint: string;
    param?: string;
    label: string;
    onChange: (id: string) => void;
    disabled?: boolean;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({ endpoint, param, label, onChange, disabled }) => {
    const { get } = useApi();
    const [items, setItems] = useState<{ id: string; name: string }[]>([]);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        let url = param ? `${endpoint}?animal_id=${param}` : endpoint;
        get(url)
            .then((res) => setItems(res.data as { id: string; name: string }[] ))
            .catch((err) => console.error(`Ошибка загрузки ${label}:`, err));
    }, [endpoint, param]);

    return (
        <div>
            <label className="block font-medium">{label}</label>
            <select
                className="input"
                onChange={(e) => {
                    setSelected(e.target.value);
                    onChange(e.target.value);
                }}
                value={selected || ""}
                disabled={disabled}
            >
                <option value="" disabled>
                    Выберите {label.toLowerCase()}
                </option>
                {items.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownSelect;
