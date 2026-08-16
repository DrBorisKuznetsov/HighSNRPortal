import React, { Children, forwardRef, useEffect } from 'react';
import {
  Link as WouterLink,
  Router as WouterRouter,
  Route as WouterRoute,
  Switch,
  useLocation as useWouterLocation,
} from 'wouter';
import { trackEvent } from './utils/analytics';

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

export function StaticRouter({ path, children }) {
  return <WouterRouter ssrPath={path}>{children}</WouterRouter>;
}

export const Link = forwardRef(function Link({ to, analyticsContext, onClick, ...props }, ref) {
  const href = getCanonicalRouteHref(to);

  function handleClick(event) {
    onClick?.(event);

    if (!event.defaultPrevented && analyticsContext) {
      trackEvent('select_content', {
        content_type: analyticsContext,
        item_id: href,
      });
    }
  }

  return <WouterLink href={href} ref={ref} onClick={handleClick} {...props} />;
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
