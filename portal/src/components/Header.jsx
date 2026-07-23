import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Header() {
  const videosHref = import.meta.env.DEV ? 'http://localhost:5174/videos_project/' : '/videos_project/';

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <Activity size={24} color="var(--accent-color)" />
          <span>HighSNR Lab</span>
        </Link>
        
        <nav className="nav-links">
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
