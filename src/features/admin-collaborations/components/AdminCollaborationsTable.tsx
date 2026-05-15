'use client';

import Link from 'next/link';
import type { AdminCollaboration } from '../types';

interface Props {
  items: AdminCollaboration[];
  loading: boolean;
}

export function AdminCollaborationsTable({ items, loading }: Props) {
  if (loading) {
    return <p className="text-muted">Loading collaborations...</p>;
  }

  if (!items.length) {
    return <p className="text-muted">No collaborations found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Sender Business</th>
            <th>Receiver Business</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.sender_business_name ?? `#${item.sender_business_id}`}</td>
              <td>{item.receiver_business_name ?? `#${item.receiver_business_id}`}</td>
              <td className="text-capitalize">{item.status}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>
                <Link href={`/admin/collaborations/${item.id}`} className="btn btn-sm btn-outline-primary">
                  View details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

