'use client';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <TopBar />
      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
        <Sidebar />
        <main className="dashboard-content flex-grow-1" style={{ overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

