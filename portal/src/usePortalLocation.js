import { useLocation as useWouterLocation } from 'wouter';

export function usePortalLocation() {
  const [pathname] = useWouterLocation();

  return {
    pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}

