/**
 * Breadcrumb Helper Functions
 * Maps routes to breadcrumb navigation
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate breadcrumbs for a given path
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' }
  ];

  // Map of path segments to display names
  const pathMap: Record<string, string> = {
    'about': 'About',
    'services': 'Services',
    'grow': 'Grow',
    'professional-services': 'Professional Services',
    'faq': 'FAQ',
    'contact': 'Contact',
    'privacy': 'Privacy Policy'
  };

  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const displayName = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      name: displayName,
      url: currentPath
    });
  }

  return breadcrumbs;
}

/**
 * Get breadcrumb data for specific pages
 */
export const BREADCRUMB_DATA: Record<string, BreadcrumbItem[]> = {
  '/': [{ name: 'Home', url: '/' }],
  '/about': [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ],
  '/services': [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' }
  ],
  '/grow': [
    { name: 'Home', url: '/' },
    { name: 'Grow', url: '/grow' }
  ],
  '/professional-services': [
    { name: 'Home', url: '/' },
    { name: 'Professional Services', url: '/professional-services' }
  ],
  '/faq': [
    { name: 'Home', url: '/' },
    { name: 'FAQ', url: '/faq' }
  ],
  '/contact': [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' }
  ],
  '/privacy': [
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy' }
  ]
};

/**
 * Get breadcrumbs for a specific path
 */
export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  return BREADCRUMB_DATA[pathname] || generateBreadcrumbs(pathname);
}
