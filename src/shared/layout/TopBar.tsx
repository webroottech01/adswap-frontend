'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuthSession, useLogout } from '@/features/auth/public';
import { Avatar } from '@/ui/Avatar';

/**
 * TopBar Component
 * Displays top navigation bar with notifications, profile, and logout
 */
export function TopBar() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthSession();
  const { logout, isLoading: logoutLoading } = useLogout();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isLoading = authLoading || logoutLoading;

  // Mock notification count
  const notificationCount = 5;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid px-4">
        {/* Spacer to push content to right */}
        <div className="flex-grow-1"></div>

        {/* Right side items */}
        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="position-relative">
            <button
              className="btn btn-link text-dark p-2 position-relative border-0"
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                setShowProfileDropdown(false);
              }}
              aria-label="Notifications"
              disabled={isLoading}
            >
              <Bell size={20} />
              {notificationCount > 0 && !isLoading && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.65rem', padding: '0.2em 0.4em' }}
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1040 }}
                  onClick={() => setShowNotificationsDropdown(false)}
                ></div>
                <div
                  className="dropdown-menu dropdown-menu-end show"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    minWidth: '320px',
                    zIndex: 1050,
                  }}
                >
                  <div className="dropdown-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Notifications</h6>
                    <button className="btn btn-sm btn-link text-primary p-0">Mark all as read</button>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="px-3 py-4 text-center text-muted">
                    <Bell size={32} className="mb-2 opacity-50" />
                    <p className="small mb-0">No new notifications</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="position-relative">
            <button
              className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotificationsDropdown(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <Avatar
                  name={user?.name || 'User'}
                  size="sm"
                  className="border border-2"
                />
              )}
              <span className="d-none d-md-inline">{user?.name || 'User'}</span>
              <ChevronDown size={16} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1040 }}
                  onClick={() => setShowProfileDropdown(false)}
                ></div>
                <div
                  className="dropdown-menu dropdown-menu-end show"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    minWidth: '200px',
                    zIndex: 1050,
                  }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <Avatar
                        name={user?.name || 'User'}
                        size="sm"
                      />
                      <div>
                        <div className="fw-medium small">{user?.name || 'User'}</div>
                        <div className="text-muted small">{user?.email || ''}</div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/settings"
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 text-danger"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    {logoutLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm text-danger" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut size={16} />
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

