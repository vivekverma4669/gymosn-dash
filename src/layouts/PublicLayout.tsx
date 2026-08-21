import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dumbbell, ArrowRight, Twitter, Linkedin, Instagram } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20">
              <Dumbbell className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Gymosn
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
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              Start Free Trial
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Dumbbell className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="font-heading text-base font-bold text-foreground">Gymosn</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The Smart Operating System for Modern Gyms.
              </p>
              <div className="flex items-center gap-3 pt-2 text-muted-foreground">
                <Twitter className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
                <Linkedin className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
                <Instagram className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
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
              &copy; {new Date().getFullYear()} Gymosn Technologies Pvt. Ltd. Made in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
