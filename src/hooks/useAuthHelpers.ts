import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAuth } from './useAuth';

// Hook pour accéder au contexte d'authentification
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Hook utilitaire pour vérifier si l'utilisateur est authentifié
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading,
  };
}

// Hook pour obtenir les informations de l'utilisateur actuel
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthContext();
  
  return {
    user,
    isAuthenticated,
    isLoggedIn: !!user,
  };
}

// Hook pour vérifier les permissions basées sur le rôle
export function useRoleCheck() {
  const { user } = useAuthContext();
  
  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };
  
  const isTeacher = () => hasRole('teacher');
  const isStudent = () => hasRole('student');
  const isParent = () => hasRole('parent');
  const isAdmin = () => hasRole('admin');
  
  return {
    hasRole,
    isTeacher,
    isStudent,
    isParent,
    isAdmin,
    userRole: user?.role,
  };
}

// Hook pour vérifier les permissions dans les composants
export function usePermissions() {
  const { user } = useAuthContext();
  const { hasRole, hasPermission } = useAuth();

  const canAccess = (roles?: string | string[], permissions?: string | string[]) => {
    if (!user) return false;

    // Vérifier les rôles si spécifiés
    if (roles) {
      const hasRequiredRole = hasRole(roles);
      if (!hasRequiredRole) return false;
    }

    // Vérifier les permissions si spécifiées
    if (permissions) {
      const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
      const hasRequiredPermission = permissionArray.some(permission => hasPermission(permission));
      if (!hasRequiredPermission) return false;
    }

    return true;
  };

  const getRoleDisplayName = (role: string): string => {
    const roleLabels: Record<string, string> = {
      teacher: 'Enseignant',
      student: 'Élève',
      parent: 'Parent',
      admin: 'Administrateur',
    };
    return roleLabels[role] || role;
  };

  const getUserDisplayName = (): string => {
    return user?.name || 'Utilisateur';
  };

  return {
    user,
    canAccess,
    hasRole,
    hasPermission,
    getRoleDisplayName,
    getUserDisplayName,
  };
}
