/**
 * TypeScript types for Profile module
 */

export interface ProfileFormData {
  name: string;
}

export interface EmailChangeFormData {
  email: string;
  confirm_email: string;
  current_password: string;
}

export interface PasswordChangeFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}



