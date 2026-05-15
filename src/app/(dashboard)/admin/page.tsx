'use client';

import Link from 'next/link';
import { BusinessList } from '@/features/admin/components/BusinessList';
import { BusinessFilters as BusinessFiltersType, Business } from '@/features/admin/types';
import { BusinessFilters as BusinessFiltersComponent } from '@/features/admin/components/BusinessFilters';
import { adminApi, BusinessStatistics } from '@/features/admin/api';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/Button';
import { Plus, Building2, Clock, CheckCircle, XCircle } from 'lucide-react';

/**
 * Super Admin Dashboard Page
 * Displays business statistics and recent business listings
 */
export default function AdminDashboard() {
  const [filters, setFilters] = useState<BusinessFiltersType>({});
  const [statistics, setStatistics] = useState<BusinessStatistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
  });
  const [recentBusinesses, setRecentBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevFiltersRef = useRef<BusinessFiltersType>({});
  const isInitialMount = useRef(true);

  // Fetch statistics and businesses when filters change
  useEffect(() => {
    // Reset to page 1 when filters change (but not on initial mount)
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    if (filtersChanged && !isInitialMount.current) {
      prevFiltersRef.current = filters;
      fetchData();
      return;
    }
    
    prevFiltersRef.current = filters;
    isInitialMount.current = false;
    
    // Fetch data on mount and filter changes
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch statistics and businesses in parallel
      const [statsResponse, businessesResponse] = await Promise.all([
        adminApi.getStatistics(filters),
        adminApi.getBusinesses(1, filters),
      ]);
      
      setStatistics(statsResponse);
      // Show only first 5 businesses for dashboard
      setRecentBusinesses(businessesResponse.data.slice(0, 5));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
      // Set empty defaults on error
      setStatistics({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
      });
      setRecentBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Super Admin Dashboard</h1>
          <p className="text-muted mb-0">Manage all businesses in the system</p>
        </div>
        <Link href="/admin/businesses/new">
          <Button variant="primary" icon={Plus}>
            Create Business
          </Button>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Total Businesses</p>
                  <h3 className="mb-0">{loading ? '...' : statistics.total}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <Building2 size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Pending</p>
                  <h3 className="mb-0">{loading ? '...' : statistics.pending}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <Clock size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Approved</p>
                  <h3 className="mb-0">{loading ? '...' : statistics.approved}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <CheckCircle size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Rejected</p>
                  <h3 className="mb-0">{loading ? '...' : statistics.rejected}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <XCircle size={24} className="text-danger" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <BusinessFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Recent Businesses */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Businesses</h5>
          <Link href="/admin/businesses" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="card-body">
          <BusinessList businesses={recentBusinesses} loading={loading} />
        </div>
      </div>
    </div>
  );
}
