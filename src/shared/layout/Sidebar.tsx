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
  // BarChart3,
  Settings,
  LogOut,
  Users,
  Shield,
  // CreditCard,
  Handshake,
  Megaphone,
} from 'lucide-react';
import { useAuthSession, useLogout } from '@/features/auth/public';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Discover Businesses',
    href: '/marketplace',
    icon: Store,
  },
  {
    title: 'My Business',
    href: '/business',
    icon: Building2,
  },
  {
    title: 'Promotions',
    href: '/inventory',
    icon: Megaphone,
  },
  {
    title: 'Bookings / Accepted Promotions',
    href: '/bookings',
    icon: Calendar,
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
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
  // {
  //   title: 'Analytics',
  //   href: '/analytics',
  //   icon: BarChart3,
  // },
  // {
  //   title: 'Billing',
  //   href: '/billing',
  //   icon: CreditCard,
  // },
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
  const { user: authUser } = useAuthSession();
  const { logout } = useLogout();

  const isAdmin =
    authUser?.roles?.includes('super_admin') ||
    authUser?.roles?.includes('admin') ||
    false;

  const user = authUser
    ? {
        business_name: authUser.name || 'User',
        email: authUser.email || '',
        plan: 'Pro',
        isAdmin,
      }
    : null;

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
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

      <div className="mx-3 my-3 p-3 bg-light rounded">
        <p className="small mb-1 text-truncate fw-medium">{user.business_name}</p>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary">{user.plan}</span>
          <span className="small text-muted">Plan</span>
        </div>
      </div>

      <nav className="flex-grow-1 px-3" style={{ overflowY: 'auto' }}>
        <ul className="sidebar-nav">
          {navigationItems.map((item) => (
            <li key={item.href} className="sidebar-nav-item">
              <Link
                href={item.href}
                className={`sidebar-nav-link d-flex align-items-center ${
                  isActive(item.href) ? 'active' : ''
                }`}
              >
                <item.icon className="sidebar-nav-icon" />
                <span>{item.title}</span>
              </Link>
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
