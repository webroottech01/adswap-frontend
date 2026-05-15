'use client';

import Link from 'next/link';
import { Clock, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

export function VerificationPendingPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="w-100" style={{ maxWidth: '450px' }}>
        <div className="card shadow-sm">
          <div className="card-body text-center p-4">
            <div className="d-flex justify-content-center mb-4">
              <div className="bg-warning bg-opacity-25 text-warning p-4 rounded-circle">
                <Clock size={40} />
              </div>
            </div>
            <h3 className="card-title mb-2">Application Submitted!</h3>
            <p className="card-text text-muted mb-4">
              Your business registration is under review
            </p>

            <div className="vstack gap-3 text-start mb-4">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-success bg-opacity-25 text-success p-1 rounded-circle mt-1">
                  <CheckCircle2 size={16} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="small mb-1">Application Received</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                    We&apos;ve received your business registration
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="bg-primary bg-opacity-25 text-primary p-1 rounded-circle mt-1">
                  <Clock size={16} className="spinner-grow-sm" />
                </div>
                <div className="flex-grow-1">
                  <h6 className="small mb-1">Under Review</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                    Our team is verifying your documents
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 opacity-50">
                <div className="bg-secondary bg-opacity-25 text-secondary p-1 rounded-circle mt-1">
                  <Mail size={16} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="small mb-1">Email Notification</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                    You&apos;ll receive an email once approved
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-light-blue p-4 rounded mb-4 text-start">
              <h6 className="mb-3">What happens next?</h6>
              <ul className="text-muted small mb-0">
                <li>Review typically takes 24-48 hours</li>
                <li>You&apos;ll receive an email at your registered address</li>
                <li>Check your spam folder if you don&apos;t see it</li>
                <li>After approval, you can start using AdSwap</li>
              </ul>
            </div>

            <div className="mb-4">
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: '33%' }}
                  aria-valuenow={33}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <p className="text-muted text-center mb-0" style={{ fontSize: '0.75rem' }}>
                Verification in progress
              </p>
            </div>

            <div className="vstack gap-2">
              <Link href="/login" className="btn btn-outline-secondary w-100">
                <ArrowLeft size={16} className="me-2" />
                Back to Login
              </Link>
              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                Need help?{' '}
                <a href="mailto:support@adswap.com" className="text-primary text-decoration-none">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

