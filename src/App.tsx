import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Opal } from './pages/Opal';
import { StoneDetail } from './pages/StoneDetail';
import { Andamooka } from './pages/Andamooka';
import { People } from './pages/People';
import { Provenance } from './pages/Provenance';
import { Journal } from './pages/Journal';
import { Shop } from './pages/Shop';
import { Workshop } from './pages/Workshop';
import { About } from './pages/About';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/opal" element={<PageTransition><Opal /></PageTransition>} />
        <Route path="/opal/:id" element={<PageTransition><StoneDetail /></PageTransition>} />
        <Route path="/andamooka" element={<PageTransition><Andamooka /></PageTransition>} />
        <Route path="/people" element={<PageTransition><People /></PageTransition>} />
        <Route path="/provenance" element={<PageTransition><Provenance /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/workshop" element={<PageTransition><Workshop /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
