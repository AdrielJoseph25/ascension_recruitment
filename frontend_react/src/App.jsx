import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobseeker from './pages/Jobseeker';
import Apply from './pages/Apply';

function App() {
  useEffect(() => {
    window.scrollToSection = (id) => {
      // Temporarily enable scrolling to perform the animation
      document.body.style.overflow = 'auto';
      
      if (id === 'home' || id === 'hero') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      const element = document.getElementById(id);
      if (element) {
        const nav = document.querySelector('nav');
        const offset = nav ? nav.offsetHeight : 100;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    // Check if there is an initial hash on load (e.g., from external redirect)
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        if (window.scrollToSection) {
          window.scrollToSection(id);
        }
      }, 500);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobseeker" element={<Jobseeker />} />
            <Route path="/apply/:jobId" element={<Apply />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;