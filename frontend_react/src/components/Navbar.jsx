import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(false); // Close mobile menu when clicked
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" onClick={(e) => handleScroll('home', e)} className="flex items-center group">
                    <img
                        src={logoImg}
                        className="h-12 sm:h-16 md:h-20 object-contain transition-transform group-hover:scale-[1.02]"
                        alt="Ascension Recruitment"
                    />
                </Link>

                {/* Desktop Nav Links */}
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

                {/* Desktop CTA Button */}
                <div className="hidden lg:block">
                    <a
                        href="/#contact"
                        onClick={(e) => handleScroll('contact', e)}
                        className="bg-brand-green text-white px-6 py-2.5 rounded text-sm font-bold tracking-wider hover:bg-brand-green/90 shadow-md shadow-brand-green/10 transition-all uppercase"
                    >
                        Get in Touch
                    </a>
                </div>

                {/* Mobile Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2 text-gray-600 hover:text-brand-green transition-colors focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
            </div>

            {/* Mobile Nav Menu Drawer */}
            <div
                className={`lg:hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white overflow-hidden ${
                    isOpen ? 'max-h-[450px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
                }`}
            >
                <div className="px-6 py-4 flex flex-col gap-4 text-base font-semibold tracking-wide">
                    <Link
                        to="/"
                        onClick={(e) => handleScroll('home', e)}
                        className={`py-2 transition-colors ${activeTab === 'home' ? 'text-brand-green font-extrabold' : 'text-gray-600'}`}
                    >
                        Home
                    </Link>
                    <a
                        href="/#about"
                        onClick={(e) => handleScroll('about', e)}
                        className={`py-2 transition-colors ${activeTab === 'about' ? 'text-brand-green font-extrabold' : 'text-gray-600'}`}
                    >
                        About Us
                    </a>
                    <a
                        href="/#services"
                        onClick={(e) => handleScroll('services', e)}
                        className={`py-2 transition-colors ${activeTab === 'services' ? 'text-brand-green font-extrabold' : 'text-gray-600'}`}
                    >
                        Services
                    </a>
                    <a
                        href="/#industries"
                        onClick={(e) => handleScroll('industries', e)}
                        className={`py-2 transition-colors ${activeTab === 'industries' ? 'text-brand-green font-extrabold' : 'text-gray-600'}`}
                    >
                        Industries
                    </a>
                    <Link
                        to="/jobseeker"
                        onClick={() => {
                            setActiveTab('careers');
                            setIsOpen(false);
                        }}
                        className={`py-2 transition-colors ${activeTab === 'careers' ? 'text-brand-orange font-extrabold' : 'text-brand-orange'}`}
                    >
                        Jobs At Ascension
                    </Link>
                    <div className="pt-2 border-t border-gray-100">
                        <a
                            href="/#contact"
                            onClick={(e) => handleScroll('contact', e)}
                            className="block w-full text-center bg-brand-green text-white py-3 rounded text-sm font-bold tracking-wider hover:bg-brand-green/90 shadow-md shadow-brand-green/10 transition-all uppercase"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;