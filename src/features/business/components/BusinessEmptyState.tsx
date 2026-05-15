'use client';

import { Building2 } from 'lucide-react';
import { Button } from '@/ui/Button';

interface BusinessEmptyStateProps {
  onCreateClick: () => void;
}

/**
 * Empty State Component
 * Displayed when user has no business profile
 */
export function BusinessEmptyState({ onCreateClick }: BusinessEmptyStateProps) {
  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle" style={{ width: '120px', height: '120px' }}>
                  <Building2 size={64} className="text-primary" />
                </div>
              </div>
              
              <h2 className="h3 mb-3">Create Your Business Profile</h2>
              <p className="text-muted mb-4">
                Get started by creating your business profile. This will help you connect with other businesses
                and start monetizing your footfall through advertising opportunities.
              </p>
              
              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Building2}
                  onClick={onCreateClick}
                >
                  Create Your Business Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

