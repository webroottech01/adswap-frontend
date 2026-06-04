'use client';

import { MarketplaceFilters as MarketplaceFiltersType, MarketplaceFilterMetadata } from '../types';

interface MarketplaceFiltersProps {
  filters: MarketplaceFiltersType;
  metadata: MarketplaceFilterMetadata | null;
  metadataLoading: boolean;
  onFiltersChange: (filters: MarketplaceFiltersType) => void;
  onClearFilters: () => void;
}

/**
 * Marketplace Filters Component
 * Provides filter controls for marketplace discovery
 */
export function MarketplaceFilters({
  filters,
  metadata,
  metadataLoading,
  onFiltersChange,
  onClearFilters,
}: MarketplaceFiltersProps) {
  const handleFilterChange = (key: keyof MarketplaceFiltersType, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const hasActiveFilters = Boolean(
    filters.city ||
    filters.category ||
    filters.provider_type ||
    filters.promotion_format ||
    filters.brand_size ||
    filters.revenue_range
  );

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              id="city"
              type="text"
              className="form-control"
              placeholder="Filter by city..."
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              disabled={metadataLoading}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              className="form-select"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={metadataLoading}
            >
              <option value="">All Categories</option>
              {metadata?.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="provider_type" className="form-label">
              Promotion type
            </label>
            <select
              id="provider_type"
              className="form-select"
              value={filters.provider_type || ''}
              onChange={(e) => handleFilterChange('provider_type', e.target.value as any)}
            >
              <option value="">All Types</option>
              <option value="paid">Paid Promotion</option>
              <option value="cross">Cross Marketing</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="brand_size" className="form-label">
              Brand Size
            </label>
            <select
              id="brand_size"
              className="form-select"
              value={filters.brand_size || ''}
              onChange={(e) => handleFilterChange('brand_size', e.target.value as any)}
            >
              <option value="">All Sizes</option>
              <option value="micro">Micro</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="revenue_range" className="form-label">
              Revenue Range
            </label>
            <select
              id="revenue_range"
              className="form-select"
              value={filters.revenue_range || ''}
              onChange={(e) => handleFilterChange('revenue_range', e.target.value)}
              disabled={metadataLoading}
            >
              <option value="">All Ranges</option>
              {metadata?.revenue_ranges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




