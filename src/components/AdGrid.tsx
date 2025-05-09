import React from 'react';
import AdCard from './AdCard';
import './AdGrid.css';

interface Ad {
    info: {
        id: string;
        title: string;
        photo_url: string;
        description: string;
        price: number;
    };
    extra_info: {
        locality_name: string;
    };
}

interface AdGridProps {
    ads: Ad[];
}


const AdGrid: React.FC<AdGridProps> = ({ ads }) => {
    return (
        <div className="ad-grid-container">
            {ads.map((ad) => (
                <AdCard
                    key={ad.info.id}
                    id={ad.info.id}
                    title={ad.info.title}
                    photoUrl={ad.info.photo_url}
                    description={ad.info.description}
                    price={ad.info.price}
                    locality={ad.extra_info.locality_name}
                />
            ))}
        </div>
    );
};

export default AdGrid;
