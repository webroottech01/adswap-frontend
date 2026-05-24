// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { LoginPage } from './components/LoginPage';
export { RegisterPage } from './components/RegisterPage';
export { VerificationPendingPage } from './components/VerificationPendingPage';

// Public API (use this instead of hooks)
export {
  useAuthSession,
  useLogin,
  useRegister,
  useLogout,
  useRestoreSession,
  type User,
  type LoginCredentials,
  type RegisterData,
} from './public';

// Legacy hooks (deprecated - use public API instead)
/**
 * @deprecated Use useAuthSession from './public' instead
 */
export { useAuth } from './hooks/useAuth';
/**
 * @deprecated Use useLogin from './public' instead
 */
export { useLogin as useLoginLegacy } from './hooks/useLogin';
/**
 * @deprecated Use useRegister from './public' instead
 */
export { useRegister as useRegisterLegacy } from './hooks/useRegister';
