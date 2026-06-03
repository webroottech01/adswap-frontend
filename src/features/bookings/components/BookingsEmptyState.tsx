import Link from 'next/link';

export function BookingsEmptyState() {
  return (
    <div className="card">
      <div className="card-body text-center py-5">
        <h5 className="text-muted mb-3">No accepted promotions yet</h5>
        <p className="text-muted mb-3">
          When a collaboration request is accepted, it will appear here as a confirmed deal.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <Link href="/collaborations" className="btn btn-outline-primary btn-sm">
            View collaborations
          </Link>
          <Link href="/marketplace" className="btn btn-primary btn-sm">
            Discover businesses
          </Link>
        </div>
      </div>
    </div>
  );
}

