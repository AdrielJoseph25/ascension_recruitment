import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        const path = window.location.pathname;
        if (path === '/jobseeker') {
            setActiveTab('careers');
        } else if (hash) {
            setActiveTab(hash);
        } else {
            setActiveTab('home');
        }
    }, []);

    const handleScroll = (id, e) => {
        setActiveTab(id);
        if (window.location.pathname === '/' || window.location.pathname === '/#') {
            if (window.scrollToSection) {
                e.preventDefault();
                window.scrollToSection(id);
            }
        } else {
            // Let default router links behave normally but unlock the body scrolling
            document.body.style.overflow = 'auto';
        }
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" onClick={(e) => handleScroll('home', e)} className="flex items-center group">
                    <img
                        src={logoImg}
                        className="h-20 md:h-24 object-contain transition-transform group-hover:scale-[1.02]"
                        alt="Ascension Recruitment"
                    />
                </Link>

                {/* Nav Links */}
                <div className="hidden lg:flex items-center gap-7 text-base font-semibold tracking-wide">
                    <Link
                        to="/"
                        onClick={(e) => handleScroll('home', e)}
                        className={`transition-colors border-b-2 pb-1 ${activeTab === 'home' ? 'text-brand-green border-brand-green font-extrabold' : 'text-gray-600 border-transparent hover:text-brand-green'}`}
                    >
                        Home
                    </Link>
                    <a
                        href="/#about"
                        onClick={(e) => handleScroll('about', e)}
                        className={`transition-colors border-b-2 pb-1 ${activeTab === 'about' ? 'text-brand-green border-brand-green font-extrabold' : 'text-gray-600 border-transparent hover:text-brand-green'}`}
                    >
                        About Us
                    </a>
                    <a
                        href="/#services"
                        onClick={(e) => handleScroll('services', e)}
                        className={`transition-colors border-b-2 pb-1 ${activeTab === 'services' ? 'text-brand-green border-brand-green font-extrabold' : 'text-gray-600 border-transparent hover:text-brand-green'}`}
                    >
                        Services
                    </a>
                    <a
                        href="/#industries"
                        onClick={(e) => handleScroll('industries', e)}
                        className={`transition-colors border-b-2 pb-1 ${activeTab === 'industries' ? 'text-brand-green border-brand-green font-extrabold' : 'text-gray-600 border-transparent hover:text-brand-green'}`}
                    >
                        Industries
                    </a>
                    <Link
                        to="/jobseeker"
                        onClick={() => setActiveTab('careers')}
                        className={`transition-colors border-b-2 pb-1 ${activeTab === 'careers' ? 'text-brand-orange border-brand-orange font-extrabold' : 'text-brand-orange border-transparent hover:text-brand-orange/80'}`}
                    >
                        Jobs At Ascension
                    </Link>
                </div>

                {/* CTA Button */}
                <div>
                    <a
                        href="/#contact"
                        onClick={(e) => handleScroll('contact', e)}
                        className="bg-brand-green text-white px-6 py-3 rounded text-sm font-bold tracking-wider hover:bg-brand-green/90 shadow-md shadow-brand-green/10 transition-all uppercase"
                    >
                        Get in Touch
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;