import { MenuItem } from '@neo-edge-web/models';

export const MENU_TREE: MenuItem[] = [
  {
    displayName: 'Default Project',
    icon: 'dashboard',
    path: '/project',
    isExpanded: true,
    children: [
      {
        displayName: 'Demo 1',
        icon: 'dot',
        path: '/project/demo1',
        isActive: true
      },
      {
        displayName: 'Demo 2',
        icon: 'dot',
        path: '/project/demo2',
        isActive: false
      },
      {
        displayName: 'Demo 3',
        icon: 'dot',
        path: '/project/demo3',
        isActive: false
      },
      {
        displayName: 'Dashboard',
        icon: 'dot',
        path: '/project/dashboard',
        isActive: false
      },
      {
        displayName: 'Gateway',
        icon: 'dot',
        path: 'project/gateway',
        isActive: false
      }
    ]
  },
  {
    displayName: 'NeoFlow',
    icon: 'neoflow',
    path: '/neoflow',
    isExpanded: false,
    children: [
      {
        displayName: 'NeoFlow Settings',
        icon: 'dot',
        isActive: false,
        path: 'neoflow/noeflow-info'
      },
      {
        displayName: 'OT Device Profile',
        icon: 'dot',
        isActive: false,
        path: 'neoflow/ot-device-profile'
      },
      {
        displayName: 'IT Service Profile',
        icon: 'dot',
        isActive: false,
        path: 'neoflow/it-service-profile'
      }
    ]
  },
  {
    displayName: 'User Management',
    icon: 'users',
    path: '/user-management',
    isExpanded: false,
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
      }
    ]
  }
];
