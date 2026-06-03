'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { useServices } from '../../hooks/useServices';

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

  const { enabledServices, loading: servicesLoading, error: servicesError } = useServices();

  const providesAdServices = watch('providesAdServices');
  const serviceSlugs = watch('serviceSlugs') || [];

  const groupedByCategory = enabledServices.reduce<Record<string, typeof enabledServices>>((acc, service) => {
    const key = service.category_name || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(service);
    return acc;
  }, {});

  const categories = Object.keys(groupedByCategory).sort((a, b) => a.localeCompare(b));

  const handleServiceToggle = (slug: string, checked: boolean) => {
    const current = serviceSlugs || [];
    if (checked) {
      setValue('serviceSlugs', [...current, slug]);
    } else {
      setValue('serviceSlugs', current.filter((t) => t !== slug));
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
              onChange={(e) => {
                const checked = e.target.checked;
                setValue('providesAdServices', checked);
                if (!checked) {
                  setValue('serviceSlugs', []);
                }
              }}
            />
            <label className="form-check-label" htmlFor="providesAdServices">
              <strong>Do you want to provide advertising services?</strong>
            </label>
          </div>
        </div>

        {providesAdServices && (
          <div className="border-top pt-4">
            <label className="form-label small mb-3">Select service types:</label>
            {servicesLoading ? (
              <div className="text-muted small">Loading services...</div>
            ) : servicesError ? (
              <div className="text-danger small">{servicesError}</div>
            ) : categories.length === 0 ? (
              <div className="text-muted small">No services available</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {categories.map((category) => (
                  <div key={category} className="border rounded p-3 bg-light bg-opacity-25">
                    <div className="fw-semibold mb-2">{category}</div>
                    <div className="d-flex flex-column gap-2">
                      {groupedByCategory[category].map((service) => (
                        <div key={service.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`service-${service.slug}`}
                            checked={serviceSlugs.includes(service.slug)}
                            onChange={(e) => handleServiceToggle(service.slug, e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={`service-${service.slug}`}>
                            {service.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


