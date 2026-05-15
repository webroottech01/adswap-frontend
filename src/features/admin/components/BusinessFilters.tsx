import { BusinessFilters as BusinessFiltersType, BusinessStatus } from '../types';

interface BusinessFiltersProps {
  filters: BusinessFiltersType;
  onFiltersChange: (filters: BusinessFiltersType) => void;
}

/**
 * Business Filters Component
 * Provides search and filter controls for business listing
 */
export function BusinessFilters({ filters, onFiltersChange }: BusinessFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : (value as BusinessStatus),
    });
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      is_provider: value === 'all' ? undefined : value === 'true',
    });
  };

  const handleBuyerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      is_buyer: value === 'all' ? undefined : value === 'true',
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: undefined,
      status: undefined,
      is_provider: undefined,
      is_buyer: undefined,
    });
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="search" className="form-label">
              Search
            </label>
            <input
              id="search"
              type="text"
              className="form-control"
              placeholder="Search by name or category..."
              value={filters.search || ''}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              value={filters.status || 'all'}
              onChange={handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="is_provider" className="form-label">
              Provider
            </label>
            <select
              id="is_provider"
              className="form-select"
              value={filters.is_provider === undefined ? 'all' : filters.is_provider.toString()}
              onChange={handleProviderChange}
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="is_buyer" className="form-label">
              Buyer
            </label>
            <select
              id="is_buyer"
              className="form-select"
              value={filters.is_buyer === undefined ? 'all' : filters.is_buyer.toString()}
              onChange={handleBuyerChange}
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}











