import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';
import { ROUTES } from '../../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  fallbackPath?: string;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles, 
  fallbackPath = ROUTES.LOGIN,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, hasRole } = useAuth();
  const location = useLocation();

  // Si l'authentification n'est pas requise, afficher le contenu
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Si des rôles spécifiques sont requis, vérifier les permissions
  if (requiredRoles) {
    const hasRequiredRole = hasRole(requiredRoles);
    
    if (!hasRequiredRole) {
      // Rediriger vers une page d'accès refusé ou le tableau de bord
      return (
        <Navigate 
          to={ROUTES.DASHBOARD} 
          state={{ 
            error: 'Accès non autorisé',
            from: location.pathname 
          }} 
          replace 
        />
      );
    }
  }

  return <>{children}</>;
}

// Composant utilitaire pour les routes publiques (redirige si déjà connecté)
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ 
  children, 
  redirectTo = ROUTES.DASHBOARD 
}: PublicRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Si l'utilisateur est déjà connecté, rediriger
  if (isAuthenticated) {
    const from = location.state?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

