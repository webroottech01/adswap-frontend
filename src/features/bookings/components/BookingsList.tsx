'use client';

import type { Booking } from '../types';
import { BookingCard } from './BookingCard';
import { BookingsEmptyState } from './BookingsEmptyState';

interface BookingsListProps {
  bookings: Booking[];
  loading: boolean;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export function BookingsList({ bookings, loading, pagination, onPageChange }: BookingsListProps) {
  if (loading && bookings.length === 0) {
    return (
      <div className="row g-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-8" />
                </div>
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-4" />
                </div>
                <div className="placeholder-glow">
                  <span className="placeholder col-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && bookings.length === 0) {
    return <BookingsEmptyState />;
  }

  return (
    <>
      <div className="row g-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="col-md-6 col-lg-4">
            <BookingCard booking={booking} />
          </div>
        ))}
      </div>

      {pagination.last_page > 1 && (
        <div className="mt-4">
          <nav aria-label="Bookings pagination">
            <ul className="pagination justify-content-center mb-0">
              <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: pagination.last_page }).map((_, index) => {
                const page = index + 1;
                return (
                  <li
                    key={page}
                    className={`page-item ${page === pagination.current_page ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                );
              })}
              <li
                className={`page-item ${
                  pagination.current_page === pagination.last_page ? 'disabled' : ''
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => onPageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Next
                </button>
              </li>
            </ul>
            <div className="text-center mt-2">
              <small className="text-muted">
                Page {pagination.current_page} of {pagination.last_page} ({pagination.total} total
                bookings)
              </small>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

