import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { StaticRouter } from './router.jsx';

export function render(pathname) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter path={pathname}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );
}
