'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface BusinessProfileSectionProps {
  id?: string;
  title: string;
  icon?: LucideIcon;
  emphasized?: boolean;
  children: ReactNode;
}

export function BusinessProfileSection({
  id,
  title,
  icon: Icon,
  emphasized = false,
  children,
}: BusinessProfileSectionProps) {
  const cardClass = emphasized
    ? 'card mb-4 border border-primary border-2 bg-primary bg-opacity-10'
    : 'card mb-4';

  return (
    <section id={id} className={cardClass}>
      <div className="card-header d-flex align-items-center bg-transparent border-bottom">
        {Icon && <Icon className="me-2" size={20} />}
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}
