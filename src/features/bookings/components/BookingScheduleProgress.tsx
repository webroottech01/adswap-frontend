'use client';

interface BookingScheduleProgressProps {
  daysRemaining: number;
  scheduleProgressPercent: number;
  periodEndsAt: string;
}

export function BookingScheduleProgress({
  daysRemaining,
  scheduleProgressPercent,
  periodEndsAt,
}: BookingScheduleProgressProps) {
  const endLabel = new Date(periodEndsAt).toLocaleDateString();
  const periodEnded = daysRemaining === 0;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="fw-medium">Collaboration period (30 days)</small>
        <small className="text-muted">
          {periodEnded ? 'Period ended' : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`}
        </small>
      </div>
      <div className="progress" style={{ height: 8 }}>
        <div
          className={`progress-bar ${periodEnded ? 'bg-secondary' : 'bg-primary'}`}
          role="progressbar"
          style={{ width: `${scheduleProgressPercent}%` }}
          aria-valuenow={scheduleProgressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <small className="text-muted d-block mt-1">Valid until {endLabel}</small>
    </div>
  );
}
