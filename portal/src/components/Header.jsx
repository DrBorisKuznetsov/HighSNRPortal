import React, { useEffect, useState } from 'react';
import { NavLink, Link } from '../router';
import { usePortalLocation } from '../usePortalLocation';
import { Activity, Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = usePortalLocation();
  const videosHref = import.meta.env.DEV ? 'http://localhost:5174/videos_project/' : '/videos_project/';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <Activity size={24} color="var(--accent-color)" />
          <span>HighSNR Lab</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav id="primary-navigation" className={`nav-links${menuOpen ? ' open' : ''}`} aria-label="Primary navigation">
          <NavLink to="/research" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Research</NavLink>
          <NavLink to="/tools" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Tools</NavLink>
          <NavLink to="/publications" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Articles & Papers</NavLink>

          <a href={videosHref} className="nav-link">Videos</a>
          <NavLink to="/design-review" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Design Review</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
        </nav>
      </div>
    </header>
  );
}
