import React, { Children, forwardRef, useEffect } from 'react';
import {
  Link as WouterLink,
  Route as WouterRoute,
  Switch,
  useLocation as useWouterLocation,
} from 'wouter';

function getCanonicalRouteHref(to) {
  if (typeof to !== 'string' || !to.startsWith('/') || to === '/' || to.startsWith('//')) {
    return to;
  }

  const suffixIndex = to.search(/[?#]/);
  const pathname = suffixIndex === -1 ? to : to.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : to.slice(suffixIndex);

  return `${pathname.replace(/\/+$/, '')}/${suffix}`;
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

export function BrowserRouter({ children }) {
  return children;
}

export const Link = forwardRef(function Link({ to, ...props }, ref) {
  return <WouterLink href={getCanonicalRouteHref(to)} ref={ref} {...props} />;
});

export const NavLink = forwardRef(function NavLink({ to, className, children, ...props }, ref) {
  const [pathname] = useWouterLocation();
  const normalizedPathname = normalizePathname(pathname);
  const normalizedTarget = normalizePathname(to);
  const isActive = normalizedPathname === normalizedTarget
    || (normalizedTarget !== '/' && normalizedPathname.startsWith(`${normalizedTarget}/`));
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <WouterLink
      href={getCanonicalRouteHref(to)}
      ref={ref}
      className={resolvedClassName}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </WouterLink>
  );
});

export function Route() {
  return null;
}

export function Routes({ children }) {
  return (
    <Switch>
      {Children.map(children, (child) => (
        <WouterRoute key={child.props.path} path={child.props.path}>{child.props.element}</WouterRoute>
      ))}
    </Switch>
  );
}

export function Navigate({ to, replace = false }) {
  const [, navigate] = useWouterLocation();

  useEffect(() => {
    navigate(getCanonicalRouteHref(to), { replace });
  }, [navigate, replace, to]);

  return null;
}
