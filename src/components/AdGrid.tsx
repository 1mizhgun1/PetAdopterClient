import React from 'react';
import AdCard from './AdCard';

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
        <div className="container-xl p-4">
            <div className="d-flex flex-wrap" style={{ gap: '1rem' }}>
                {ads.map((ad) => (
                    <div key={ad.info.id} className="ad-card-container">
                        <AdCard
                            id={ad.info.id}
                            title={ad.info.title}
                            photoUrl={ad.info.photo_url}
                            description={ad.info.description}
                            price={ad.info.price}
                            locality={ad.extra_info.locality_name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdGrid;
