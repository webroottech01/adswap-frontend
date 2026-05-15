'use client';

import { BusinessFormData } from '../types';
import { Building2, MapPin, Briefcase } from 'lucide-react';

interface BusinessCardPreviewProps {
  data: BusinessFormData;
}

/**
 * Business Card Preview Component
 * Displays a preview of the business profile
 */
export function BusinessCardPreview({ data }: BusinessCardPreviewProps) {
  const getBusinessTypeLabel = (type: string) => {
    switch (type) {
      case 'individual':
        return 'Individual';
      case 'partnership':
        return 'Partnership';
      case 'company':
        return 'Company';
      default:
        return type;
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-start mb-3">
          <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
            <Building2 size={32} className="text-primary" />
          </div>
          <div className="flex-grow-1">
            <h4 className="card-title mb-1">{data.name || 'Business Name'}</h4>
            {data.category && (
              <span className="badge bg-primary mb-2">{data.category}</span>
            )}
          </div>
        </div>

        <div className="mb-3">
          {data.location && (
            <div className="d-flex align-items-center text-muted mb-2">
              <MapPin size={16} className="me-2" />
              <small>{data.location}</small>
            </div>
          )}
          {data.businessType && (
            <div className="d-flex align-items-center text-muted mb-2">
              <Briefcase size={16} className="me-2" />
              <small>{getBusinessTypeLabel(data.businessType)}</small>
            </div>
          )}
        </div>

        {data.description && (
          <p className="card-text text-muted small mb-3">{data.description}</p>
        )}

        {data.providesAdServices && (
          <div className="border-top pt-3">
            <h6 className="small fw-bold mb-2">Ad Services Offered:</h6>
            <div className="d-flex flex-wrap gap-2">
              {data.paidPromotion && (
                <span className="badge bg-info">
                  Paid Promotion
                  {data.paidPromotionTypes && data.paidPromotionTypes.length > 0 && (
                    <span className="ms-1">
                      ({data.paidPromotionTypes.join(', ')})
                    </span>
                  )}
                </span>
              )}
              {data.crossMarketing && (
                <span className="badge bg-success">
                  Cross Marketing
                  {data.crossMarketingTypes && data.crossMarketingTypes.length > 0 && (
                    <span className="ms-1">
                      ({data.crossMarketingTypes.join(', ')})
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        )}

        {data.promotionalMedia && data.promotionalMedia.length > 0 && (
          <div className="border-top pt-3 mt-3">
            <h6 className="small fw-bold mb-2">Promotional Media:</h6>
            <small className="text-muted">
              {data.promotionalMedia.length} file(s) uploaded
            </small>
          </div>
        )}
      </div>
    </div>
  );
}









