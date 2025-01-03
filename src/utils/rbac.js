import { jwtDecode } from 'jwt-decode';

// Role definitions matching backend enum
export const Roles = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    EMPLOYEE: 3,
    ONBOARDING_MANAGER: 4
};

// Role names for display
export const RoleNames = {
    [Roles.SUPER_ADMIN]: 'Super Admin',
    [Roles.ADMIN]: 'Admin',
    [Roles.ONBOARDING_MANAGER]: 'Onboarding Manager',
    [Roles.EMPLOYEE]: 'Employee'
};

// Menu items configuration with role-based access
export const menuItems = [
  { 
    text: 'Employees', 
    icon: 'PeopleIcon', 
    path: '/employees', 
    roles: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER] 
  },
  { 
    text: 'Onboarding Managers', 
    icon: 'SupervisorIcon', 
    path: '/onboarding-managers', 
    roles: [Roles.SUPER_ADMIN] 
  },
  { 
    text: 'Recruiters', 
    icon: 'RecruiterIcon', 
    path: '/recruiters', 
    roles: [Roles.SUPER_ADMIN] 
  },
  { 
    text: 'Role Assignment', 
    icon: 'AssignmentIcon', 
    path: '/employee-role-assign', 
    roles: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER] 
  },
  { 
    text: 'Assigned Employees', 
    icon: 'GroupIcon', 
    path: '/assigned-employee', 
    roles: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER] 
  },
  { 
    text: 'Clients', 
    icon: 'PersonIcon', 
    path: '/clients', 
    roles: [Roles.SUPER_ADMIN, Roles.ADMIN] 
  },
  { 
    text: 'Departments', 
    icon: 'BusinessIcon', 
    path: '/department', 
    roles: [Roles.SUPER_ADMIN] 
  },
  { 
    text: 'Designation', 
    icon: 'WorkIcon', 
    path: '/jobRole', 
    roles: [Roles.SUPER_ADMIN] 
  },
  { 
    text: 'Job Locations', 
    icon: 'LocationIcon', 
    path: '/employee-job-locations', 
    roles: [Roles.SUPER_ADMIN] 
  },
  { 
    text: 'Salaries', 
    icon: 'MoneyIcon', 
    path: '/salaries', 
    roles: [Roles.SUPER_ADMIN],
    subPaths: ['/salary/create', '/salary/edit/:id']
  }
];

// API endpoints with role-based access
export const apiEndpoints = {
  adminRegistration: {
    get: [Roles.SUPER_ADMIN],
    create: [Roles.SUPER_ADMIN],
    update: [Roles.SUPER_ADMIN],
    delete: [Roles.SUPER_ADMIN],
    logout: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER]
  },
  assignedEmployee: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    delete: [Roles.SUPER_ADMIN],
    download: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.EMPLOYEE, Roles.ONBOARDING_MANAGER],
    checkOfferLetter: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.EMPLOYEE, Roles.ONBOARDING_MANAGER]
  },
  clientRegistration: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN],
    delete: [Roles.SUPER_ADMIN]
  },
  department: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN],
    delete: [Roles.SUPER_ADMIN]
  },
  employeeJobLocation: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN],
    delete: [Roles.SUPER_ADMIN]
  },
  employeeRegistration: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    delete: [Roles.SUPER_ADMIN],
    checkStatus: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.EMPLOYEE, Roles.ONBOARDING_MANAGER],
    uploadDocument: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.EMPLOYEE, Roles.ONBOARDING_MANAGER],
    downloadDocument: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.EMPLOYEE, Roles.ONBOARDING_MANAGER],
    viewDocument: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.EMPLOYEE, Roles.ONBOARDING_MANAGER],
    updateIsBlocked: [Roles.SUPER_ADMIN, Roles.ADMIN],
    updateIsApproved: [Roles.SUPER_ADMIN, Roles.ADMIN],
    assignRecruiter: [Roles.SUPER_ADMIN, Roles.ADMIN],
    assignOnboardingManager: [Roles.SUPER_ADMIN, Roles.ADMIN]
  },
  employeeRoleAssign: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    delete: [Roles.SUPER_ADMIN],
    unassign: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    getUnassigned: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER]
  },
  employeeSalary: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN],
    delete: [Roles.SUPER_ADMIN]
  },
  jobRole: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.ONBOARDING_MANAGER],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN],
    delete: [Roles.SUPER_ADMIN]
  },
  onboardingManager: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN],
    getById: [Roles.SUPER_ADMIN, Roles.ADMIN],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN],
    delete: [Roles.SUPER_ADMIN],
    login: [Roles.ONBOARDING_MANAGER]
  },
  recruiter: {
    get: [Roles.SUPER_ADMIN, Roles.ADMIN],
    getById: [Roles.SUPER_ADMIN, Roles.ADMIN],
    create: [Roles.SUPER_ADMIN, Roles.ADMIN],
    update: [Roles.SUPER_ADMIN, Roles.ADMIN],
    delete: [Roles.SUPER_ADMIN]
  }
};

// Get user role from token or localStorage
export const getUserRole = () => {
  // First try to get role from localStorage
  const storedRole = localStorage.getItem('role');
  if (storedRole) {
    return parseInt(storedRole);
  }

  // If no stored role, try to get it from the token
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    // Try different possible claim names for role
    const role = decoded.role || decoded.Role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role ? parseInt(role) : null;
  } catch (error) {
    return null;
  }
};

// Check if user has access to a specific route
export const hasAccess = (path) => {
  const userRole = getUserRole();
  if (!userRole) return false;

  // Special case for root path
  if (path === '/' || path === '') {
    return true;
  }

  // Find exact path match first
  const exactMenuItem = menuItems.find(item => item.path === path);
  if (exactMenuItem) {
    return exactMenuItem.roles.includes(userRole);
  }

  // Check for subPaths if no exact match
  const menuItemWithSubPath = menuItems.find(item => 
    item.subPaths?.some(subPath => {
      // Convert route parameter pattern to regex
      const pattern = subPath.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(path);
    })
  );

  if (menuItemWithSubPath) {
    return menuItemWithSubPath.roles.includes(userRole);
  }

  return false;
};

// Check if user has access to a specific API endpoint
export const hasApiAccess = (endpoint, action) => {
  const userRole = getUserRole();
  if (!userRole) return false;

  const endpointRoles = apiEndpoints[endpoint]?.[action];
  if (!endpointRoles) return false;

  return endpointRoles.includes(userRole);
};

// Get menu items based on user role
export const getAuthorizedMenuItems = () => {
  const userRole = getUserRole();
  if (!userRole) return [];

  return menuItems.filter(item => item.roles.includes(userRole));
};

// Role-based access control
export const hasPermission = (userRole, requiredRole) => {
    if (userRole === Roles.SUPER_ADMIN) return true;
    return userRole === requiredRole;
}; 