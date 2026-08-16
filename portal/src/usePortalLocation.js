import { useLocation as useWouterLocation } from 'wouter';

export function usePortalLocation() {
  const [pathname] = useWouterLocation();
  const browserLocation = typeof window === 'undefined' ? null : window.location;

  return {
    pathname,
    search: browserLocation?.search ?? '',
    hash: browserLocation?.hash ?? '',
  };
}
