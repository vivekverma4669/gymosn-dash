import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { MessageCircle, Linkedin, Instagram, Phone, MapPin } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { BrandLogo } from '../components/common/BrandLogo';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const WHATSAPP_NUMBER = '919369546165';
const TRIAL_WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi! I'm interested in the 15-day free Fitdesk trial for my gym."
)}`;

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'GST'],
};

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-between">
      {/* Public Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandLogo className="h-9 w-9" />
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Fitdesk
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-2"
            >
              Sign In
            </Link>
            <a
              href={TRIAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              Start Free Trial
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <BrandLogo className="h-8 w-8" />
                <span className="font-heading text-base font-bold text-foreground">Fitdesk</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The Smart Operating System for Modern Gyms.
              </p>
              <div className="flex items-center gap-3 pt-2 text-muted-foreground">
                <a
                  href="https://www.linkedin.com/in/vivek-verma-594700228/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/vivek__.soni/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
              <div className="space-y-2 pt-2">
                <a
                  href="tel:+919369546165"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  +91 93695 46165
                </a>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>Manmohan Park, Katra, Prayagraj, UP 211002</span>
                </div>
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([section, items]) => (
              <div key={section} className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{section}</h4>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item}>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Fitdesk Technologies Pvt. Ltd. Made in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
