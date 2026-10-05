import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'OPAL', path: '/opal' },
    { name: 'ANDAMOOKA', path: '/andamooka' },
    { name: 'THE PEOPLE', path: '/people' },
    { name: 'WORKSHOP', path: '/workshop' },
    { name: 'PROVENANCE', path: '/provenance' },
    { name: 'JOURNAL', path: '/journal' },
    { name: 'SHOP', path: '/shop' },
    { name: 'ABOUT', path: '/about' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 mix-blend-difference transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled && !mobileMenuOpen ? 'opacity-0 pointer-events-none hover:opacity-100 hover:pointer-events-auto' : 'opacity-100'
      }`}
    >
      <div className="w-full px-6 py-8 flex items-start justify-between">
        
        {/* LOGO */}
        <Link 
          to="/" 
          className="relative z-50 flex flex-col items-start group"
        >
          <img src="/src/assets/images/M_brandmark.svg" alt="Mooka Boys Logo" className="h-10 mb-1 object-contain" />
        </Link>

        {/* DESKTOP NAV - Minimal vertical list aligned right */}
        <nav className="hidden lg:flex flex-col items-end space-y-3 mt-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-micro transition-all duration-300 ${
                location.pathname.startsWith(link.path) 
                  ? 'text-copper' 
                  : 'text-bone/50 hover:text-bone'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* MOBILE TOGGLE - Abstract lines */}
        <button 
          className="lg:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-end gap-1.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <motion.div 
            animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 7 : 0 }} 
            className="w-full h-[1px] bg-bone origin-right"
          />
          <motion.div 
            animate={{ opacity: mobileMenuOpen ? 0 : 1 }} 
            className="w-3/4 h-[1px] bg-bone origin-right"
          />
        </button>

      </div>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-pit-black flex flex-col items-center justify-center z-40"
          >
            <nav className="flex flex-col items-center space-y-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`font-display text-3xl tracking-[0.2em] uppercase transition-colors duration-300 ${
                    location.pathname.startsWith(link.path) 
                      ? 'text-copper' 
                      : 'text-bone/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
