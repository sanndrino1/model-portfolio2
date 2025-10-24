// Types for user roles and permissions
export type UserRole = 'guest' | 'client' | 'admin' | 'photographer' | 'agency';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  roles: UserRole[]; // Which roles can access this item
  children?: NavigationItem[];
}

// Permission system
export const PERMISSIONS = {
  VIEW_PORTFOLIO: ['guest', 'client', 'admin', 'photographer', 'agency'],
  VIEW_CONTACT: ['guest', 'client', 'admin', 'photographer', 'agency'],
  VIEW_ABOUT: ['guest', 'client', 'admin', 'photographer', 'agency'],
  MANAGE_PORTFOLIO: ['admin', 'photographer'],
  VIEW_ADMIN: ['admin'],
  VIEW_BOOKINGS: ['client', 'admin', 'photographer', 'agency'],
  MANAGE_USERS: ['admin'],
  VIEW_STATISTICS: ['admin', 'photographer', 'agency'],
} as const;

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole);
}

export function canAccessRoute(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}