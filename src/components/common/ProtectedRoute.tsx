import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useApp();
  const location = useLocation();

  // If requires auth and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Trigger the Auth Modal with notice
    return (
      <AuthRedirectHandler
        locationPath={location.pathname + location.search}
        reason="unauthenticated"
        allowedRoles={allowedRoles}
      />
    );
  }

  // If role is restricted and user's role is not in allowedRoles
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <AuthRedirectHandler
        locationPath={location.pathname + location.search}
        reason="unauthorized"
        allowedRoles={allowedRoles}
        userRole={user.role}
      />
    );
  }

  return <>{children}</>;
};

// Helper sub-component to handle side-effects cleanly before redirect
const AuthRedirectHandler: React.FC<{
  locationPath: string;
  reason: 'unauthenticated' | 'unauthorized';
  allowedRoles?: UserRole[];
  userRole?: UserRole;
}> = ({ locationPath, reason, allowedRoles, userRole }) => {
  const { openAuthModal } = useAuth();
  const { showToast } = useApp();

  useEffect(() => {
    const noticeKey = `auth-route-notice:${reason}:${locationPath}`;
    let shouldShowToast = true;

    try {
      shouldShowToast = sessionStorage.getItem(noticeKey) !== 'shown';
      if (shouldShowToast) sessionStorage.setItem(noticeKey, 'shown');
    } catch {
      // Continue normally when browser storage is unavailable.
    }

    if (reason === 'unauthenticated') {
      const requiredRoleText = allowedRoles?.length ? ` (${allowedRoles.join('/')} account)` : '';
      openAuthModal(
        'signin',
        locationPath,
        `Portal Access Restricted: Please sign in${requiredRoleText} to access ${locationPath}.`
      );
      if (shouldShowToast) {
        showToast(
          'Authentication Required',
          `Please sign in to access ${locationPath}`,
          'warning'
        );
      }
    } else if (reason === 'unauthorized') {
      const rolesNeeded = allowedRoles?.map((r) => r.toUpperCase()).join(' or ') || 'Administrative';
      openAuthModal(
        'signin',
        locationPath,
        `Access Denied: Your current role (${userRole?.toUpperCase()}) does not have permission for this portal. Please sign in as ${rolesNeeded}.`
      );
      if (shouldShowToast) {
        showToast(
          'Access Denied',
          `This section requires ${rolesNeeded} privileges`,
          'error'
        );
      }
    }
  }, [locationPath, reason, allowedRoles?.join('|'), userRole]);

  return <Navigate to="/" replace />;
};
