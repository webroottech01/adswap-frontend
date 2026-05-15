'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/ui/Button';
import { Plus, Package, Tag } from 'lucide-react';

/**
 * Service Catalog Admin Page
 * Main page for managing service categories and services
 */
export default function ServiceCatalogPage() {
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Service Catalog</h1>
          <p className="text-muted mb-0">Manage service categories and services</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Service Categories Card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <Tag className="me-2" size={20} />
                Service Categories
              </h5>
              <Link href="/admin/service-catalog/categories">
                <Button variant="primary" size="sm" icon={Plus}>
                  Manage
                </Button>
              </Link>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Create and manage service categories like "Paid Promotion" and "Cross Marketing"
              </p>
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <Package className="me-2" size={20} />
                Services
              </h5>
              <Link href="/admin/service-catalog/services">
                <Button variant="primary" size="sm" icon={Plus}>
                  Manage
                </Button>
              </Link>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">
                Create and manage individual services like "Hoardings", "Coupons", etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




