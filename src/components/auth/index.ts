// Export des composants d'authentification
export { AuthProvider } from './AuthProvider';
export { ProtectedRoute, PublicRoute } from './ProtectedRoute';
export { default as RoleBasedRedirect } from './RoleBasedRedirect';

// Export des hooks utilitaires depuis le fichier centralisé
export { useAuthContext, useRequireAuth, useCurrentUser, useRoleCheck, usePermissions } from '../../hooks/useAuthHelpers';
