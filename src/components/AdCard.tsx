import React from 'react';
import { Link } from 'react-router-dom';

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
      <div className="card shadow-lg border rounded-lg mb-4">
        <div className="position-relative" style={{ height: '200px' }}>
          <img
              src={`http://localhost/pet_adopter_photos/${photoUrl}`}
              alt={title}
              className="card-img-top position-absolute top-50 start-50 translate-middle"
              style={{ maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">
            <Link to={`/ads/${id}`} className="text-primary text-decoration-none">
              {title}
            </Link>
          </h5>
          <p className="card-text text-muted text-truncate" style={{ maxWidth: '100%' }}>
            {description}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="font-weight-bold">{price} ₽</span>
            <span className="text-muted small">{locality}</span>
          </div>
        </div>
      </div>
  );
};

export default AdCard;
