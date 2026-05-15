'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Eye,
  Calendar,
  MessageSquare,
  ArrowRight,
  Store,
  Package,
  BarChart3,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/ui/Progress';

// Mock data - in production, this would come from hooks/API
const statsData = [
  {
    title: 'Total Revenue',
    value: '₹45,231',
    change: '+20.1%',
    trend: 'up' as const,
    icon: IndianRupee,
    description: 'from last month',
  },
  {
    title: 'Profile Views',
    value: '2,345',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Eye,
    description: 'this month',
  },
  {
    title: 'Active Bookings',
    value: '12',
    change: '-2',
    trend: 'down' as const,
    icon: Calendar,
    description: 'ongoing campaigns',
  },
  {
    title: 'Conversion Rate',
    value: '24.5%',
    change: '+4.2%',
    trend: 'up' as const,
    icon: BarChart3,
    description: 'booking success',
  },
];

const recentBookings = [
  {
    id: 1,
    business: 'Urban Fitness Hub',
    type: 'Banner Space',
    duration: '30 days',
    amount: 8500,
    status: 'confirmed',
    startDate: '2026-02-05',
  },
  {
    id: 2,
    business: 'TechStart Academy',
    type: 'Digital Screen',
    duration: '15 days',
    amount: 12000,
    status: 'pending',
    startDate: '2026-02-10',
  },
  {
    id: 3,
    business: 'Café Mocha',
    type: 'Receipt Branding',
    duration: '60 days',
    amount: 5500,
    status: 'confirmed',
    startDate: '2026-02-01',
  },
];

const recentMessages = [
  {
    id: 1,
    business: 'Metro Mall',
    message: 'Interested in your standee space for March',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    business: 'Digital Plus',
    message: 'Can we discuss pricing for long-term booking?',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: 3,
    business: 'Local Mart',
    message: 'Thank you for the collaboration!',
    time: '1 day ago',
    unread: false,
  },
];

const inventoryPerformance = [
  {
    name: 'Banner Space - Entrance',
    bookings: 8,
    revenue: 24500,
    utilization: 85,
  },
  {
    name: 'Digital Screen - Lobby',
    bookings: 12,
    revenue: 48000,
    utilization: 92,
  },
  {
    name: 'Receipt Branding',
    bookings: 5,
    revenue: 15000,
    utilization: 60,
  },
];

export function DashboardPage() {
  // Get user from localStorage
  const [user, setUser] = React.useState<{ business_name: string; verified: boolean } | null>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('adswap_user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser({
          business_name: userData.business_name || 'Demo Business',
          verified: userData.verified !== false,
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="display-6 mb-2">Welcome back, {user.business_name}!</h1>
        <p className="text-muted">Here&apos;s what&apos;s happening with your business today</p>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-4">
        {statsData.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="card-subtitle text-muted mb-0">{stat.title}</h6>
                  <stat.icon size={20} className="text-muted" />
                </div>
                <h3 className="card-title mb-2">{stat.value}</h3>
                <div className="d-flex align-items-center">
                  {stat.trend === 'up' ? (
                    <>
                      <TrendingUp size={16} className="trend-up me-1" />
                      <span className="text-success me-2">{stat.change}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={16} className="trend-down me-1" />
                      <span className="text-danger me-2">{stat.change}</span>
                    </>
                  )}
                  <span className="text-muted small">{stat.description}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card bg-light-blue border-primary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h5 className="card-title">Create Ad Inventory</h5>
                  <p className="card-text text-muted mb-3">
                    List new advertising spaces and start earning
                  </p>
                  <Link href="/inventory/create" className="btn btn-primary">
                    Create Now
                    <ArrowRight size={16} className="ms-2" />
                  </Link>
                </div>
                <Package size={32} className="text-blue ms-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card bg-light-green border-success h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h5 className="card-title">Browse Marketplace</h5>
                  <p className="card-text text-muted mb-3">
                    Discover local businesses to advertise with
                  </p>
                  <Link href="/marketplace" className="btn btn-outline-success">
                    Explore
                    <ArrowRight size={16} className="ms-2" />
                  </Link>
                </div>
                <Store size={32} className="text-green ms-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card bg-light-purple border-secondary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h5 className="card-title">View Analytics</h5>
                  <p className="card-text text-muted mb-3">
                    Track performance and optimize campaigns
                  </p>
                  <Link href="/analytics" className="btn btn-outline-secondary">
                    View Report
                    <ArrowRight size={16} className="ms-2" />
                  </Link>
                </div>
                <BarChart3 size={32} className="text-purple ms-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings and Messages */}
      <div className="row g-4 mb-4">
        {/* Recent Bookings */}
        <div className="col-12 col-lg-8">
          <div className="card h-100">
            <div className="card-header bg-white d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title mb-1">Recent Bookings</h5>
                <p className="card-text text-muted small mb-0">Latest advertising bookings</p>
              </div>
              <Link href="/bookings" className="btn btn-sm btn-link">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="vstack gap-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 bg-light rounded d-flex align-items-center justify-content-between"
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className="mb-0">{booking.business}</h6>
                        {booking.status === 'confirmed' ? (
                          <span className="badge bg-success d-inline-flex align-items-center">
                            <CheckCircle2 size={12} className="me-1" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark d-inline-flex align-items-center">
                            <Clock size={12} className="me-1" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-muted small mb-0">
                        {booking.type} · {booking.duration} · Starts {booking.startDate}
                      </p>
                    </div>
                    <div className="text-end">
                      <h5 className="mb-0">₹{booking.amount.toLocaleString()}</h5>
                      <p className="text-muted small mb-0">Total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title mb-1">Messages</h5>
                <p className="card-text text-muted small mb-0">Recent conversations</p>
              </div>
              <Link href="/messages" className="btn btn-sm btn-link">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="vstack gap-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded border ${
                      msg.unread ? 'bg-light-blue border-primary' : 'bg-white'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-start justify-content-between mb-1">
                      <h6 className="small mb-0">{msg.business}</h6>
                      {msg.unread && <div className="unread-dot"></div>}
                    </div>
                    <p
                      className="text-muted small mb-1"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {msg.message}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: 0 }}>
                      {msg.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Performance */}
      <div className="card">
        <div className="card-header bg-white">
          <h5 className="card-title mb-1">Inventory Performance</h5>
          <p className="card-text text-muted small mb-0">
            How your ad spaces are performing this month
          </p>
        </div>
        <div className="card-body">
          <div className="vstack gap-4">
            {inventoryPerformance.map((item, index) => (
              <div key={index}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="flex-grow-1">
                    <h6 className="small mb-1">{item.name}</h6>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: 0 }}>
                      {item.bookings} bookings · ₹{item.revenue.toLocaleString()} revenue
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="small mb-0">{item.utilization}%</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: 0 }}>
                      Utilization
                    </p>
                  </div>
                </div>
                <Progress value={item.utilization} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

