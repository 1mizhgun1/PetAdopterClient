import React from 'react';
import { Link } from 'react-router-dom';
import './AdCard.css';

interface AdCardProps {
  id: string;
  title: string;
  photoUrl: string;
  description: string;
  price: number;
  locality: string;
}

const AdCard: React.FC<AdCardProps> = ({ id, title, photoUrl, description, price, locality }) => {
    return (
        <Link to={`/ads/${id}`} className="ad-card-link">
            <div className="ad-card">
                <div className="ad-card-image">
                    <img
                        src={`http://localhost/pet_adopter_photos/${photoUrl}`}
                        alt={title}
                    />
                </div>
                <div className="ad-card-body">
                    <h3 className="ad-card-title">{title}</h3>
                    <p className="ad-card-description">{description}</p>
                    <div className="ad-card-meta">
                        <span className="ad-card-price">{price === 0 ? "Бесплатно" : `${price} ₽`}</span>
                        <span className="ad-card-location">📍{locality === "" ? "не указано" : locality}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
