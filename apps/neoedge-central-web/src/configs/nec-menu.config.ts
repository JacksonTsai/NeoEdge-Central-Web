import { MenuItem } from '@neo-edge-web/models';

export const MENU_TREE: MenuItem[] = [
  {
    displayName: '{USER_PROJECT_NAME}',
    icon: 'dashboard',
    path: '/project',
    isExpanded: true,
    permissions: ['CURRENT_PROJECT'],
    children: [
      {
        displayName: 'Dashboard',
        icon: 'dot',
        path: '/project/dashboard',
        isActive: true
      },
      {
        displayName: 'Gateways',
        icon: 'dot',
        path: '/project/gateways',
        isActive: false
      }
    ]
  },
  {
    displayName: 'NeoFlow',
    icon: 'neoflow',
    path: '/neoflow',
    isExpanded: false,
    permissions: ['CURRENT_PROJECT'],
    children: [
      {
        displayName: 'NeoFlow Settings',
        icon: 'dot',
        isActive: false,
        path: '/neoflow/noeflow-info'
      },
      {
        displayName: 'OT Device Profile',
        icon: 'dot',
        isActive: false,
        path: '/neoflow/ot-device-profile'
      },
      {
        displayName: 'IT Service Profile',
        icon: 'dot',
        isActive: false,
        path: '/neoflow/it-service-profile'
      }
    ]
  },
  {
    displayName: 'User Management',
    icon: 'users',
    path: '/user-management',
    isExpanded: false,
    permissions: ['USER_MANAGEMENT'],
    children: [
      {
        displayName: 'Users',
        icon: 'dot',
        isActive: false,
        path: '/user-management/users'
      },
      {
        displayName: 'Roles',
        icon: 'dot',
        isActive: false,
        path: '/user-management/roles'
      }
    ]
  },
  {
    displayName: 'Project Management',
    icon: 'manufacturing',
    path: '/project-management',
    isExpanded: false,
    permissions: ['PROJECT_MANAGEMENT'],
    children: [
      {
        displayName: 'Projects',
        icon: 'dot',
        isActive: false,
        path: '/project-management/projects'
      }
    ]
  },
  {
    displayName: 'Company Account',
    icon: 'source-environment',
    path: '/company-account',
    isExpanded: false,
    permissions: ['COMPANY_ACCOUNT'],
    children: [
      {
        displayName: 'Company Info',
        icon: 'dot',
        isActive: false,
        path: '/company-account/company-info'
      },
      {
        displayName: 'NeoEdge X License',
        icon: 'dot',
        isActive: false,
        path: '/company-account/neoedgex-license'
      },
      {
        displayName: 'Subscription Plan',
        icon: 'dot',
        isActive: false,
        path: '/company-account/subscription-plan'
      },
      {
        displayName: 'Usage & Billing Records',
        icon: 'dot',
        isActive: false,
        path: '/company-account/usage-billing'
      }
    ]
  }
];
