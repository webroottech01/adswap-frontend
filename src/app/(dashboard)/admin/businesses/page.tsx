'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { BusinessList } from '@/features/admin/components/BusinessList';
import { BusinessFilters as BusinessFiltersComponent } from '@/features/admin/components/BusinessFilters';
import { BusinessFilters as BusinessFiltersType, Business } from '@/features/admin/types';
import { adminApi, PaginatedResponse } from '@/features/admin/api';
import { Button } from '@/ui/Button';
import { Plus, CheckCircle, XCircle, Ban } from 'lucide-react';

/**
 * Business List Page
 * Full CRUD interface for managing businesses
 */
export default function BusinessesPage() {
  const [filters, setFilters] = useState<BusinessFiltersType>({});
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const prevFiltersRef = useRef<BusinessFiltersType>({});
  const isInitialMount = useRef(true);

  // Fetch businesses when filters or page changes
  useEffect(() => {
    // Reset to page 1 when filters change (but not on initial mount)
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    if (filtersChanged && !isInitialMount.current && pagination.current_page !== 1) {
      setPagination((prev) => ({ ...prev, current_page: 1 }));
      prevFiltersRef.current = filters;
      return; // Will trigger another effect when page changes
    }
    
    prevFiltersRef.current = filters;
    isInitialMount.current = false;
    
    // Fetch businesses
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.current_page]);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Business> = await adminApi.getBusinesses(
        pagination.current_page,
        filters
      );
      
      // Ensure data is always an array
      setBusinesses(Array.isArray(response.data) ? response.data : []);
      setPagination({
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
        per_page: response.per_page || 15,
        total: response.total || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load businesses');
      console.error('Error fetching businesses:', err);
      // Ensure businesses is still an array even on error
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (business: Business) => {
    setActionLoading(business.id);
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.approveBusiness(business.id);
      setSuccessMessage(`Business "${business.name}" has been approved.`);
      await fetchBusinesses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve business');
      console.error('Error approving business:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (business: Business) => {
    setActionLoading(business.id);
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.rejectBusiness(business.id);
      setSuccessMessage(`Business "${business.name}" has been rejected.`);
      await fetchBusinesses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject business');
      console.error('Error rejecting business:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (business: Business) => {
    setActionLoading(business.id);
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.suspendBusiness(business.id);
      setSuccessMessage(`Business "${business.name}" has been suspended.`);
      await fetchBusinesses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to suspend business');
      console.error('Error suspending business:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Business Management</h1>
          <p className="text-muted mb-0">Manage all businesses in the system</p>
        </div>
        <Link href="/admin/businesses/new">
          <Button variant="primary" icon={Plus}>
            Create Business
          </Button>
        </Link>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          />
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Filters */}
      <BusinessFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Business List */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            Businesses ({pagination.total})
          </h5>
        </div>
        <div className="card-body">
          <BusinessList
            businesses={businesses}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
            onSuspend={handleSuspend}
            actionLoading={actionLoading}
          />
        </div>
        {pagination.last_page > 1 && (
          <div className="card-footer">
            <nav aria-label="Business pagination">
              <ul className="pagination mb-0">
                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${pagination.current_page === page ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    pagination.current_page === pagination.last_page ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}




