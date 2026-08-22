import React from 'react';
import logoSrc from '../../assets/images/logo.png';

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'h-10 w-10' }) => (
  <img src={logoSrc} alt="Fitdesk" className={`shrink-0 object-contain ${className}`} />
);
