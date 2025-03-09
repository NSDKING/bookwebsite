import { useState } from "react";
import "./index.css";  // We'll create this file next
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link href="/" className="logo-link">
          <div className="logo-icon">
            <span>L</span>
          </div>
          <h1 className="header-titles">
            <span className="title-main">laLecture</span>
            <span className="title-secondary">jecontribue</span>
          </h1>
        </Link>
      </div>

      {/* Mobile menu button */}
      <button 
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg> 
          : 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        }
      </button>

      {/* Desktop navigation */}
      <nav className="desktop-nav">
        <ul className="nav-list">
          <li><Link href="/dashboard" className="nav-link">Accueil</Link></li>
          <li><Link href="/dashboard/caroussel" className="nav-link">Caroussel</Link></li>
          <li><Link href="/dashboard/agenda" className="nav-link">Agenda</Link></li>
          <li><Link href="/dashboard/message" className="nav-link">Message</Link></li>
        </ul>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <nav>
            <ul className="mobile-nav-list">
              <li><Link href="/dashboard" className="nav-link" onClick={toggleMenu}>Accueil</Link></li>
              <li><Link href="/dashboard/caroussel" className="nav-link" onClick={toggleMenu}>Caroussel</Link></li>
              <li><Link href="/dashboard/agenda" className="nav-link" onClick={toggleMenu}>Agenda</Link></li>
              <li><Link href="/dashboard/message" className="nav-link" onClick={toggleMenu}>Message</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}