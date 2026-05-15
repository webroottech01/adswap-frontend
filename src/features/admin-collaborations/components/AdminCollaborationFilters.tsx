'use client';

import { useState } from 'react';
import type { AdminCollaborationsQueryParams } from '../api';

interface Props {
  onChange: (params: AdminCollaborationsQueryParams) => void;
}

export function AdminCollaborationFilters({ onChange }: Props) {
  const [status, setStatus] = useState<string>('all');
  const [business, setBusiness] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const apply = () => {
    onChange({
      status,
      business: business || undefined,
      from: from || undefined,
      to: to || undefined,
      page: 1,
    });
  };

  return (
    <div className="mb-3 d-flex flex-wrap gap-2 align-items-end">
      <div>
        <label className="form-label mb-1">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div>
        <label className="form-label mb-1">Business name</label>
        <input
          type="text"
          className="form-control"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="Search by business"
        />
      </div>
      <div>
        <label className="form-label mb-1">From</label>
        <input
          type="date"
          className="form-control"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div>
        <label className="form-label mb-1">To</label>
        <input
          type="date"
          className="form-control"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={apply}>
        Apply
      </button>
    </div>
  );
}

