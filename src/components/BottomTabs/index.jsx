 
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome as solidHome } from '@fortawesome/free-solid-svg-icons';
import { faCompass as solidCompass, faInfoCircle as regularInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
 import './index.css';
import { Link } from 'react-router-dom';

export default function BottomTab() {
   

  return (
    <div className="bottom-tab">
      <Link to="/" className={`tab-item `}>
        <FontAwesomeIcon icon={solidHome } className="tab-icon" />
        <span>Accueil</span>
      </Link>
      <Link to="/discovery" className={`tab-item `}>
        <FontAwesomeIcon icon={ solidCompass  } className="tab-icon" />
        <span>Découverte</span>
      </Link>
      <Link to="/contact" className={`tab-item`}>
      <FontAwesomeIcon icon={faInfoCircle} className="tab-icon" />
      <span>Contact</span>
      </Link>
    </div>
  );
}
