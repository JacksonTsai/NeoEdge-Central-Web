export interface MenuItem {
  displayName: string;
  icon: string;
  path: string;
  isExpanded?: boolean;
  isActive?: boolean;
  permissions?: string[];
  children?: MenuItem[];
}
