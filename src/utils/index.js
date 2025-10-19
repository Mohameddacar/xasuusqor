export const createPageUrl = (pageName) => {
  const routes = {
    'Entries': '/entries',
    'Journals': '/journals',
    'NewEntry': '/new-entry',
    'ViewEntry': '/entry',
    'Insights': '/insights',
    'Goals': '/goals',
    'Settings': '/settings',
    'CalendarView': '/calendar',
    'MapView': '/map',
    'Search': '/search',
  };
  
  return routes[pageName] || '/';
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
