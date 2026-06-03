'use client';

import { useBookings } from '@/features/bookings/hooks';
import { BookingsList } from '@/features/bookings/components/BookingsList';

export default function BookingsPage() {
  const { data, pagination, loading, error, refetch } = useBookings();

  const handlePageChange = (page: number) => {
    refetch({ page });
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Bookings / Accepted Promotions</h1>
        <p className="text-muted mb-0">
          Confirmed promotion deals from accepted collaborations. Track your 30-day schedule,
          deliverables, and leave a review when complete.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" aria-label="Close" />
        </div>
      )}

      <BookingsList
        bookings={data}
        loading={loading}
        pagination={{
          current_page: pagination.current_page,
          last_page: pagination.last_page,
          per_page: pagination.per_page,
          total: pagination.total,
        }}
        onPageChange={handlePageChange}
        onReviewSubmitted={() => refetch()}
      />
    </div>
  );
}
