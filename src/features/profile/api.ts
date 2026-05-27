import api from '@/lib/api';

// Types matching backend DTOs
export interface Profile {
  id: number;
  name: string;
  email: string;
}

export interface UpdateProfileData {
  name: string;
}

export interface ChangeEmailData {
  email: string;
  current_password: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

/**
 * Feature-level API wrapper for profile endpoints.
 * This abstraction allows easy migration to microservices later.
 */
export const profileApi = {
  /**
   * Update user profile (name only)
   */
  async updateProfile(data: UpdateProfileData): Promise<Profile> {
    const response = await api.put<Profile>('/api/v1/profile', data);
    return response.data;
  },

  /**
   * Change user email address
   */
  async changeEmail(data: ChangeEmailData): Promise<Profile> {
    const response = await api.put<Profile>('/api/v1/profile/email', data);
    return response.data;
  },

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/api/v1/profile/password', data);
  },
};

