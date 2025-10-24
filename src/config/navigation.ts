import { NavigationItem, UserRole } from '@/lib/auth';

export const navigationConfig: NavigationItem[] = [
  {
    name: 'Начало',
    href: '/',
    icon: 'home',
    roles: ['guest', 'client', 'admin', 'photographer', 'agency'],
  },
  {
    name: 'Портфолио',
    href: '/portfolio',
    icon: 'image',
    roles: ['guest', 'client', 'admin', 'photographer', 'agency'],
    children: [
      {
        name: 'Всички снимки',
        href: '/portfolio',
        roles: ['guest', 'client', 'admin', 'photographer', 'agency'],
      },
      {
        name: 'Управление',
        href: '/portfolio/manage',
        roles: ['admin', 'photographer'],
      },
      {
        name: 'Качване',
        href: '/portfolio/upload',
        roles: ['admin', 'photographer'],
      },
    ],
  },
  {
    name: 'За мен',
    href: '/about',
    icon: 'user',
    roles: ['guest', 'client', 'admin', 'photographer', 'agency'],
  },
  {
    name: 'Резервации',
    href: '/bookings',
    icon: 'calendar',
    roles: ['client', 'admin', 'photographer', 'agency'],
    children: [
      {
        name: 'Моите резервации',
        href: '/bookings/my',
        roles: ['client', 'photographer'],
      },
      {
        name: 'Всички резервации',
        href: '/bookings/all',
        roles: ['admin', 'agency'],
      },
      {
        name: 'Календар',
        href: '/bookings/calendar',
        roles: ['admin', 'photographer', 'agency'],
      },
    ],
  },
  {
    name: 'Администрация',
    href: '/admin',
    icon: 'settings',
    roles: ['admin'],
    children: [
      {
        name: 'Потребители',
        href: '/admin/users',
        roles: ['admin'],
      },
      {
        name: 'Статистики',
        href: '/admin/stats',
        roles: ['admin'],
      },
      {
        name: 'Настройки',
        href: '/admin/settings',
        roles: ['admin'],
      },
    ],
  },
  {
    name: 'Агенция',
    href: '/agency',
    icon: 'briefcase',
    roles: ['agency'],
    children: [
      {
        name: 'Модели',
        href: '/agency/models',
        roles: ['agency'],
      },
      {
        name: 'Договори',
        href: '/agency/contracts',
        roles: ['agency'],
      },
      {
        name: 'Финанси',
        href: '/agency/finance',
        roles: ['agency'],
      },
    ],
  },
  {
    name: 'Контакти',
    href: '/contact',
    icon: 'mail',
    roles: ['guest', 'client', 'admin', 'photographer', 'agency'],
  },
];

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig
    .filter(item => item.roles.includes(role))
    .map(item => ({
      ...item,
      children: item.children?.filter(child => child.roles.includes(role)),
    }));
}