import { Business } from './types';

/**
 * Mock data for development and UI testing
 */

type MockBusinessInput = Pick<
  Business,
  | 'id'
  | 'name'
  | 'category'
  | 'status'
  | 'is_provider'
  | 'is_buyer'
  | 'created_at'
  | 'updated_at'
> &
  Partial<
    Pick<
      Business,
      | 'user_id'
      | 'description'
      | 'address'
      | 'phone'
      | 'email'
      | 'website'
      | 'logo_path'
      | 'service_ids'
    >
  >;

function createMockBusiness(business: MockBusinessInput): Business {
  return {
    user_id: null,
    description: null,
    address: null,
    phone: null,
    email: null,
    website: null,
    logo_path: null,
    service_ids: [],
    ...business,
  };
}

export const mockBusinesses: Business[] = [
  createMockBusiness({
    id: 1,
    name: 'ABC Retail Store',
    category: 'Retail',
    status: 'approved',
    is_provider: true,
    is_buyer: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:22:00Z',
  }),
  createMockBusiness({
    id: 2,
    name: 'XYZ Food & Beverage',
    category: 'Food & Beverage',
    status: 'pending',
    is_provider: false,
    is_buyer: true,
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-18T09:15:00Z',
  }),
  createMockBusiness({
    id: 3,
    name: 'Tech Solutions Inc',
    category: 'Technology',
    status: 'approved',
    is_provider: true,
    is_buyer: false,
    created_at: '2024-01-10T11:45:00Z',
    updated_at: '2024-01-12T16:30:00Z',
  }),
  createMockBusiness({
    id: 4,
    name: 'Fitness Center Plus',
    category: 'Health & Fitness',
    status: 'rejected',
    is_provider: false,
    is_buyer: true,
    created_at: '2024-01-05T08:20:00Z',
    updated_at: '2024-01-07T13:10:00Z',
  }),
  createMockBusiness({
    id: 5,
    name: 'Beauty Salon Pro',
    category: 'Beauty & Salon',
    status: 'suspended',
    is_provider: true,
    is_buyer: true,
    created_at: '2023-12-20T15:00:00Z',
    updated_at: '2024-01-22T10:00:00Z',
  }),
  createMockBusiness({
    id: 6,
    name: 'Auto Repair Shop',
    category: 'Automotive',
    status: 'approved',
    is_provider: true,
    is_buyer: true,
    created_at: '2024-01-12T12:30:00Z',
    updated_at: '2024-01-14T09:45:00Z',
  }),
  createMockBusiness({
    id: 7,
    name: 'Education Hub',
    category: 'Education',
    status: 'pending',
    is_provider: false,
    is_buyer: true,
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-20T14:00:00Z',
  }),
  createMockBusiness({
    id: 8,
    name: 'Real Estate Agency',
    category: 'Real Estate',
    status: 'approved',
    is_provider: true,
    is_buyer: false,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-10T11:20:00Z',
  }),
];

/**
 * Get business statistics from mock data
 */
export const getBusinessStatistics = () => {
  const total = mockBusinesses.length;
  const pending = mockBusinesses.filter((b) => b.status === 'pending').length;
  const approved = mockBusinesses.filter((b) => b.status === 'approved').length;
  const rejected = mockBusinesses.filter((b) => b.status === 'rejected').length;
  const suspended = mockBusinesses.filter((b) => b.status === 'suspended').length;

  return {
    total,
    pending,
    approved,
    rejected,
    suspended,
  };
};











