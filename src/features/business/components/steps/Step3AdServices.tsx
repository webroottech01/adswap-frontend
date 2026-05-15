'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { useServices } from '../../hooks/useServices';
import { Service } from '@/features/serviceCatalog/api';

interface Step3AdServicesProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 3: Ad Services Offered
 */
export function Step3AdServices({ form }: Step3AdServicesProps) {
  const {
    register,
    watch,
    setValue,
  } = form;

  const { enabledServices, loading: servicesLoading, error: servicesError, getServicesByCategory } = useServices();

  const providesAdServices = watch('providesAdServices');
  const paidPromotion = watch('paidPromotion');
  const crossMarketing = watch('crossMarketing');
  const paidPromotionTypes = watch('paidPromotionTypes') || [];
  const crossMarketingTypes = watch('crossMarketingTypes') || [];

  // Get services by category
  const paidPromotionServices = getServicesByCategory('Paid Promotion');
  const crossMarketingServices = getServicesByCategory('Cross Marketing');

  const handlePaidPromotionChange = (checked: boolean) => {
    setValue('paidPromotion', checked);
    if (!checked) {
      setValue('paidPromotionTypes', []);
    }
  };

  const handleCrossMarketingChange = (checked: boolean) => {
    setValue('crossMarketing', checked);
    if (!checked) {
      setValue('crossMarketingTypes', []);
    }
  };

  const handlePaidPromotionTypeChange = (serviceSlug: string, checked: boolean) => {
    const current = paidPromotionTypes || [];
    if (checked) {
      setValue('paidPromotionTypes', [...current, serviceSlug]);
    } else {
      setValue('paidPromotionTypes', current.filter((t) => t !== serviceSlug));
    }
  };

  const handleCrossMarketingTypeChange = (serviceSlug: string, checked: boolean) => {
    const current = crossMarketingTypes || [];
    if (checked) {
      setValue('crossMarketingTypes', [...current, serviceSlug]);
    } else {
      setValue('crossMarketingTypes', current.filter((t) => t !== serviceSlug));
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Ad Services Offered</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="providesAdServices"
              {...register('providesAdServices')}
            />
            <label className="form-check-label" htmlFor="providesAdServices">
              <strong>Do you want to provide advertising services?</strong>
            </label>
          </div>
        </div>

        {providesAdServices && (
          <div className="border-top pt-4">
            <div className="mb-4">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="paidPromotion"
                  checked={paidPromotion || false}
                  onChange={(e) => handlePaidPromotionChange(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="paidPromotion">
                  <strong>Paid Promotion</strong>
                </label>
              </div>

              {paidPromotion && (
                <div className="ms-4">
                  <label className="form-label small">Select promotion types:</label>
                  {servicesLoading ? (
                    <div className="text-muted small">Loading services...</div>
                  ) : servicesError ? (
                    <div className="text-danger small">{servicesError}</div>
                  ) : paidPromotionServices.length === 0 ? (
                    <div className="text-muted small">No paid promotion services available</div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {paidPromotionServices.map((service: Service) => (
                        <div key={service.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`paidPromotion-${service.slug}`}
                            checked={paidPromotionTypes.includes(service.slug)}
                            onChange={(e) => handlePaidPromotionTypeChange(service.slug, e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={`paidPromotion-${service.slug}`}>
                            {service.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="crossMarketing"
                  checked={crossMarketing || false}
                  onChange={(e) => handleCrossMarketingChange(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="crossMarketing">
                  <strong>Cross Marketing</strong>
                </label>
              </div>

              {crossMarketing && (
                <div className="ms-4">
                  <label className="form-label small">Select marketing types:</label>
                  {servicesLoading ? (
                    <div className="text-muted small">Loading services...</div>
                  ) : servicesError ? (
                    <div className="text-danger small">{servicesError}</div>
                  ) : crossMarketingServices.length === 0 ? (
                    <div className="text-muted small">No cross marketing services available</div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {crossMarketingServices.map((service: Service) => (
                        <div key={service.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`crossMarketing-${service.slug}`}
                            checked={crossMarketingTypes.includes(service.slug)}
                            onChange={(e) => handleCrossMarketingTypeChange(service.slug, e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={`crossMarketing-${service.slug}`}>
                            {service.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


