'use client';

import { Business } from '../api';
import { BusinessStatusBadge } from '@/features/admin/components/BusinessStatusBadge';
import { BusinessStatus } from '@/features/admin/types';
import { Button } from '@/ui/Button';
import { Edit, AlertCircle, XCircle, Ban, Building2, MapPin, Briefcase, Users, TrendingUp, Target, Globe, FileText, Image as ImageIcon } from 'lucide-react';

interface BusinessProfileProps {
  business: Business;
  onEdit?: () => void;
}

/**
 * Business Profile Component
 * Displays business information step-wise matching the 8-step form structure
 */
export function BusinessProfile({ business, onEdit }: BusinessProfileProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getBusinessTypeLabel = (type?: string) => {
    switch (type) {
      case 'individual':
        return 'Individual';
      case 'partnership':
        return 'Partnership';
      case 'company':
        return 'Company';
      default:
        return type || 'Not specified';
    }
  };

  const renderStatusMessage = () => {
    switch (business.status) {
      case 'pending':
        return (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <AlertCircle className="me-2" size={20} />
            <div>
              <strong>Awaiting Approval</strong>
              <p className="mb-0 small">
                Your business profile is pending review. We'll notify you once it's been reviewed.
              </p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <XCircle className="me-2" size={20} />
            <div>
              <strong>Business Rejected</strong>
              <p className="mb-0 small">
                Your business profile has been rejected. Please review your information and
                resubmit if needed.
              </p>
            </div>
          </div>
        );
      case 'suspended':
        return (
          <div className="alert alert-secondary d-flex align-items-center" role="alert">
            <Ban className="me-2" size={20} />
            <div>
              <strong>Business Suspended</strong>
              <p className="mb-0 small">
                Your business profile has been suspended. Please contact support for more
                information.
              </p>
            </div>
          </div>
        );
      case 'approved':
        return (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <AlertCircle className="me-2" size={20} />
            <div>
              <strong>Business Approved</strong>
              <p className="mb-0 small">Your business profile is active and visible to other users.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">My Business</h3>
            {onEdit && (
              <Button variant="primary" outline size="sm" icon={Edit} onClick={onEdit}>
                Edit Profile
              </Button>
            )}
          </div>

          {/* Status Message */}
          {renderStatusMessage()}

          {/* Step 1: Basic Account Info */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <Building2 className="me-2" size={20} />
              <h5 className="mb-0">Step 1: Basic Account Info</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Business Name</label>
                  <p className="mb-0 fw-semibold">{business.name}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Category</label>
                  <p className="mb-0">
                    <span className="badge bg-primary">{business.category}</span>
                  </p>
                </div>
                {business.address && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small d-flex align-items-center">
                      <MapPin size={14} className="me-1" />
                      Location
                    </label>
                    <p className="mb-0">{business.address}</p>
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Status</label>
                  <p className="mb-0">
                    <BusinessStatusBadge status={business.status as BusinessStatus} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Business Identity */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <Briefcase className="me-2" size={20} />
              <h5 className="mb-0">Step 2: Business Identity</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Business Type</label>
                  <p className="mb-0">{getBusinessTypeLabel(business.business_type)}</p>
                </div>
                {business.registration_number && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Registration Number</label>
                    <p className="mb-0">{business.registration_number}</p>
                  </div>
                )}
                {business.founded_year && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Founded Year</label>
                    <p className="mb-0">{business.founded_year}</p>
                  </div>
                )}
                {business.description && (
                  <div className="col-12 mb-3">
                    <label className="form-label text-muted small">Description</label>
                    <p className="mb-0">{business.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Collaboration Preference */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <Users className="me-2" size={20} />
              <h5 className="mb-0">Step 3: Collaboration Preference</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Provides Ad Services</label>
                  <p className="mb-0">
                    {business.is_provider ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Is Buyer</label>
                  <p className="mb-0">
                    {business.is_buyer ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </p>
                </div>
                {business.service_ids && business.service_ids.length > 0 && (
                  <div className="col-12 mb-3">
                    <label className="form-label text-muted small">Services</label>
                    <div className="d-flex flex-wrap gap-2">
                      {business.service_ids.map((id) => (
                        <span key={id} className="badge bg-info">Service #{id}</span>
                      ))}
                    </div>
                  </div>
                )}
                {business.collaboration_preferences && Object.keys(business.collaboration_preferences).length > 0 && (
                  <div className="col-12 mb-3">
                    <label className="form-label text-muted small">Collaboration Preferences</label>
                    <pre className="bg-light p-2 rounded small">
                      {JSON.stringify(business.collaboration_preferences, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Business Profile Info */}
          {(business.profile || business.employee_count || business.annual_revenue_range || business.target_audience) && (
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center">
                <TrendingUp className="me-2" size={20} />
                <h5 className="mb-0">Step 4: Business Profile Info</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {business.profile?.scale && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Business Scale</label>
                      <p className="mb-0">
                        <span className="badge bg-primary text-capitalize">{business.profile.scale}</span>
                      </p>
                    </div>
                  )}
                  {business.employee_count && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Employee Count</label>
                      <p className="mb-0">{business.employee_count}</p>
                    </div>
                  )}
                  {business.annual_revenue_range && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Annual Revenue Range</label>
                      <p className="mb-0">{business.annual_revenue_range}</p>
                    </div>
                  )}
                  {business.target_audience && business.target_audience.length > 0 && (
                    <div className="col-12 mb-3">
                      <label className="form-label text-muted small d-flex align-items-center">
                        <Target size={14} className="me-1" />
                        Target Audience
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {business.target_audience.map((audience, index) => (
                          <span key={index} className="badge bg-primary">{audience}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {business.profile?.industry_experience_years && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Industry Experience</label>
                      <p className="mb-0">{business.profile.industry_experience_years} years</p>
                    </div>
                  )}
                  {business.profile?.key_products_services && business.profile.key_products_services.length > 0 && (
                    <div className="col-12 mb-3">
                      <label className="form-label text-muted small">Key Products/Services</label>
                      <div className="d-flex flex-wrap gap-2">
                        {business.profile.key_products_services.map((item, index) => (
                          <span key={index} className="badge bg-secondary">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {business.profile?.geographic_reach && business.profile.geographic_reach.length > 0 && (
                    <div className="col-12 mb-3">
                      <label className="form-label text-muted small d-flex align-items-center">
                        <Globe size={14} className="me-1" />
                        Geographic Reach
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {business.profile.geographic_reach.map((location, index) => (
                          <span key={index} className="badge bg-info">{location}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {business.profile?.social_media_handles && Object.keys(business.profile.social_media_handles).length > 0 && (
                    <div className="col-12 mb-3">
                      <label className="form-label text-muted small">Social Media Handles</label>
                      <div className="d-flex flex-column gap-1">
                        {Object.entries(business.profile.social_media_handles).map(([platform, handle]) => (
                          <div key={platform} className="d-flex align-items-center">
                            <span className="text-capitalize fw-semibold me-2">{platform}:</span>
                            <span>{handle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {business.profile?.additional_info && (
                    <div className="col-12 mb-3">
                      <label className="form-label text-muted small">Additional Information</label>
                      <p className="mb-0">{business.profile.additional_info}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Collaboration Preferences */}
          {business.collaboration_preferences && 
           (business.collaboration_preferences.preferred_collaboration_types || 
            business.collaboration_preferences.budget_range || 
            business.collaboration_preferences.collaboration_notes) && (
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center">
                <Users className="me-2" size={20} />
                <h5 className="mb-0">Step 5: Collaboration Preferences</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {business.collaboration_preferences.preferred_collaboration_types && 
                   Array.isArray(business.collaboration_preferences.preferred_collaboration_types) &&
                   business.collaboration_preferences.preferred_collaboration_types.length > 0 && (
                    <div className="col-12 mb-3">
                      <label className="form-label text-muted small">Preferred Collaboration Types</label>
                      <div className="d-flex flex-wrap gap-2">
                        {business.collaboration_preferences.preferred_collaboration_types.map((type: string, index: number) => (
                          <span key={index} className="badge bg-success">{type}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {business.collaboration_preferences.budget_range && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Budget Range</label>
                      <p className="mb-0">{business.collaboration_preferences.budget_range}</p>
                    </div>
                  )}
                  {business.collaboration_preferences.collaboration_notes && (
                    <div className="col-12 mb-3">
                      <label className="form-label text-muted small">Collaboration Notes</label>
                      <p className="mb-0">{business.collaboration_preferences.collaboration_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Brand Proof */}
          {business.assets && business.assets.length > 0 && (
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center">
                <ImageIcon className="me-2" size={20} />
                <h5 className="mb-0">Step 6: Brand Proof</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {business.assets.map((asset) => (
                    <div key={asset.id} className="col-md-6 col-lg-4">
                      <div className="card border">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-start">
                            <ImageIcon size={20} className="text-muted me-2" />
                            <div className="flex-grow-1">
                              <p className="mb-1 fw-semibold small">{asset.file_name}</p>
                              <p className="mb-1 small text-muted text-capitalize">{asset.asset_type}</p>
                              {asset.file_size && (
                                <p className="mb-0 small text-muted">
                                  {(asset.file_size / 1024).toFixed(2)} KB
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Business Documents */}
          {business.documents && business.documents.length > 0 && (
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center">
                <FileText className="me-2" size={20} />
                <h5 className="mb-0">Step 7: Business Documents</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {business.documents.map((document) => (
                    <div key={document.id} className="col-md-6">
                      <div className="card border">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-start">
                              <FileText size={20} className="text-muted me-2" />
                              <div>
                                <p className="mb-1 fw-semibold small">{document.file_name}</p>
                                <p className="mb-1 small">
                                  <span className="badge bg-primary text-uppercase">{document.document_type}</span>
                                  <span className={`badge ms-2 ${
                                    document.status === 'verified' ? 'bg-success' :
                                    document.status === 'rejected' ? 'bg-danger' :
                                    'bg-warning'
                                  }`}>
                                    {document.status}
                                  </span>
                                </p>
                                {document.file_size && (
                                  <p className="mb-0 small text-muted">
                                    {(document.file_size / 1024).toFixed(2)} KB
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Additional Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {business.phone && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Phone</label>
                    <p className="mb-0">
                      <a href={`tel:${business.phone}`}>{business.phone}</a>
                    </p>
                  </div>
                )}
                {business.email && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Email</label>
                    <p className="mb-0">
                      <a href={`mailto:${business.email}`}>{business.email}</a>
                    </p>
                  </div>
                )}
                {business.website && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Website</label>
                    <p className="mb-0">
                      <a href={business.website} target="_blank" rel="noopener noreferrer">
                        {business.website}
                      </a>
                    </p>
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Created</label>
                  <p className="mb-0">{formatDate(business.created_at)}</p>
                </div>
                {business.updated_at && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Last Updated</label>
                    <p className="mb-0">{formatDate(business.updated_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
