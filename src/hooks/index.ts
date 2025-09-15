// Hooks personnalisés

export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useTheme } from './useTheme';
export { useApi } from './useApi';

// Hooks d'authentification
export { useAuth } from './useAuth';
export { useLogin } from './useLogin';
export { useRegister } from './useRegister';

// Hooks utilitaires d'authentification
export { useAuthContext, useRequireAuth, useCurrentUser, useRoleCheck, usePermissions } from './useAuthHelpers';
