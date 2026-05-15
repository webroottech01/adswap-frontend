export function BookingsEmptyState() {
  return (
    <div className="card">
      <div className="card-body text-center py-5">
        <h5 className="text-muted mb-3">No bookings yet</h5>
        <p className="text-muted mb-0">
          Once a collaboration request is accepted, it will appear here as a booking.
        </p>
      </div>
    </div>
  );
}

