'use client';

import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { EmailChangeForm } from '@/features/profile/components/EmailChangeForm';
import { PasswordChangeForm } from '@/features/profile/components/PasswordChangeForm';

/**
 * Settings/Profile Page
 * Manage user profile: name, email, and password
 */
export default function SettingsPage() {
  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Settings</h1>
        <p className="text-muted mb-0">Manage your account settings and preferences</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Profile Information */}
          <div className="mb-4">
            <ProfileForm />
          </div>

          {/* Email Change */}
          <div className="mb-4">
            <EmailChangeForm />
          </div>

          {/* Password Change */}
          <div className="mb-4">
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </div>
  );
}
