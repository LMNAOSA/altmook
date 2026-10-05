import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full bg-iron pt-24 pb-12 px-6 md:px-12 border-t border-bone/5 relative z-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
        
        {/* Brand & Location */}
        <div className="md:col-span-4 space-y-6">
          <Link to="/" className="inline-block flex flex-col items-start group">
            <img src="/src/assets/images/Mooka Boys_web_logo_WHITE.svg" alt="Mooka Boys Logo" className="h-10 mb-1 object-contain" />
          </Link>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40 space-y-1">
            <p>Andamooka, South Australia</p>
            <p>30°26'S 137°09'E</p>
          </div>
          <p className="font-sans text-xs text-bone/50 max-w-xs pt-4 leading-relaxed font-light">
            Andamooka opal, mined, documented and sold from the place it came from. Real provenance.
          </p>
        </div>

        {/* Navigation */}
        <div className="md:col-span-2 md:col-start-7 space-y-8">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/30 border-b border-bone/10 pb-2">Explore</h4>
          <nav className="flex flex-col space-y-4">
            <Link to="/opal" className="text-micro text-bone/70 hover:text-copper transition-colors">Opal</Link>
            <Link to="/andamooka" className="text-micro text-bone/70 hover:text-copper transition-colors">Andamooka</Link>
            <Link to="/people" className="text-micro text-bone/70 hover:text-copper transition-colors">The People</Link>
            <Link to="/workshop" className="text-micro text-bone/70 hover:text-copper transition-colors">Workshop</Link>
            <Link to="/shop" className="text-micro text-bone/70 hover:text-copper transition-colors">Shop</Link>
          </nav>
        </div>

        {/* Legal & Social */}
        <div className="md:col-span-2 space-y-8">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/30 border-b border-bone/10 pb-2">Information</h4>
          <nav className="flex flex-col space-y-4">
            <Link to="/provenance" className="text-micro text-bone/70 hover:text-copper transition-colors">Provenance OS™</Link>
            <Link to="/journal" className="text-micro text-bone/70 hover:text-copper transition-colors">Journal</Link>
            <Link to="/about" className="text-micro text-bone/70 hover:text-copper transition-colors">About</Link>
            <a href="#" className="text-micro text-bone/70 hover:text-copper transition-colors">Contact</a>
          </nav>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto mt-24 pt-8 border-t border-bone/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] tracking-widest text-bone/30 uppercase">
          © {new Date().getFullYear()} Mooka Boys Mining Co.
        </p>
        <div className="font-mono text-[10px] tracking-widest text-bone/30 uppercase space-x-6">
          <a href="#" className="hover:text-bone/60 transition-colors">Terms</a>
          <a href="#" className="hover:text-bone/60 transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
