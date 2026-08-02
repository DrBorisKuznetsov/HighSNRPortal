import React, { Children, forwardRef, useEffect } from 'react';
import {
  Link as WouterLink,
  Route as WouterRoute,
  Switch,
  useLocation as useWouterLocation,
} from 'wouter';

export function BrowserRouter({ children }) {
  return children;
}

export const Link = forwardRef(function Link({ to, ...props }, ref) {
  return <WouterLink href={to} ref={ref} {...props} />;
});

export const NavLink = forwardRef(function NavLink({ to, className, children, ...props }, ref) {
  const [pathname] = useWouterLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <WouterLink
      href={to}
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
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}
