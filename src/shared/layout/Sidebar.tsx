'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  Store,
  Package,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Users,
  Shield,
  CreditCard,
  Handshake,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthSession, useLogout } from '@/features/auth/public';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Marketplace',
    href: '/marketplace',
    icon: Store,
  },
  {
    title: 'My Business',
    href: '/business',
    icon: Building2,
  },
  {
    title: 'My Inventory',
    href: '/inventory',
    icon: Package,
    children: [
      {
        title: 'All Inventory',
        href: '/inventory/all',
        icon: Package,
      },
      {
        title: 'Create New',
        href: '/inventory/create',
        icon: Package,
      },
    ],
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: Calendar,
    badge: '3',
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    badge: '5',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Connections',
    href: '/connections',
    icon: Users,
  },
  {
    title: 'Collaborations',
    href: '/collaborations',
    icon: Handshake,
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const adminItems: NavItem[] = [
  {
    title: 'Admin Dashboard',
    href: '/admin',
    icon: Shield,
  },
  {
    title: 'All Businesses',
    href: '/admin/businesses',
    icon: Building2,
  },
  {
    title: 'Service Catalog',
    href: '/admin/service-catalog',
    icon: Package,
  },
  {
    title: 'Collaborations',
    href: '/admin/collaborations',
    icon: Handshake,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user: authUser, isAuthenticated } = useAuthSession();
  const { logout } = useLogout();

  // Check if user is admin (check roles array)
  const isAdmin = authUser?.roles?.includes('super_admin') || authUser?.roles?.includes('admin') || false;
  
  // Get user display info
  const user = authUser
    ? {
        business_name: authUser.name || 'User',
        email: authUser.email || '',
        plan: 'Pro', // TODO: Get from user data when available
        isAdmin,
      }
    : null;

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="sidebar d-flex flex-column">
      {/* Logo & Brand */}
      <div className="p-4">
        <Link href="/dashboard" className="d-flex align-items-center gap-3 text-decoration-none">
          <div className="bg-primary text-white p-2 rounded">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="h5 mb-0 fw-bold text-dark">AdSwap</h1>
            <p className="small text-muted mb-0">B2B Ad Platform</p>
          </div>
        </Link>
      </div>

      <hr className="my-0" />

      {/* Business Info */}
      <div className="mx-3 my-3 p-3 bg-light rounded">
        <p className="small mb-1 text-truncate fw-medium">{user.business_name}</p>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary">{user.plan}</span>
          <span className="small text-muted">Plan</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 px-3" style={{ overflowY: 'auto' }}>
        <ul className="sidebar-nav">
          {navigationItems.map((item) => (
            <li key={item.href} className="sidebar-nav-item">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.href)}
                    className={`sidebar-nav-link w-100 border-0 bg-transparent d-flex align-items-center justify-content-between ${
                      isActive(item.href) ? 'active' : ''
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <item.icon className="sidebar-nav-icon" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: expandedItems.includes(item.href) ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>
                  {expandedItems.includes(item.href) && (
                    <ul className="list-unstyled ms-5 mt-1">
                      {item.children.map((child) => (
                        <li key={child.href} className="mb-1">
                          <Link
                            href={child.href}
                            className={`sidebar-nav-link ${
                              isActive(child.href) ? 'active' : ''
                            }`}
                          >
                            <span>{child.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`sidebar-nav-link d-flex align-items-center justify-content-between ${
                    isActive(item.href) ? 'active' : ''
                  }`}
                >
                  <div className="d-flex align-items-center">
                    <item.icon className="sidebar-nav-icon" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="badge bg-danger rounded-pill">{item.badge}</span>
                  )}
                </Link>
              )}
            </li>
          ))}

          {user.isAdmin && (
            <>
              <li className="my-3">
                <hr />
              </li>
              {adminItems.map((item) => (
                <li key={item.href} className="sidebar-nav-item">
                  <Link
                    href={item.href}
                    className={`sidebar-nav-link ${
                      isActive(item.href) ? 'active' : ''
                    }`}
                  >
                    <item.icon className="sidebar-nav-icon" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-top">
        <button
          className="btn btn-link text-danger text-decoration-none w-100 text-start d-flex align-items-center"
          onClick={handleLogout}
        >
          <LogOut size={20} className="me-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

