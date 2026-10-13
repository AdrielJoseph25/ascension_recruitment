import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-brand-green-darkest text-gray-100 pt-16 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                {/* Visit Us Card */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-brand-orange/30 hover:bg-white/10 transition-all flex flex-col justify-between gap-4 group">
                    <div className="space-y-4">
                        <div className="p-3 bg-brand-green-dark/30 text-brand-orange rounded-lg w-fit group-hover:scale-105 transition-transform">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Visit Us</h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider"></span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-light">
                            #127, Ascension, 1st Cross, The Serenity, Doddaballapura Main Rd, Yellupura, Yelahanka, Hosahudya, Karnataka 562163
                        </p>
                    </div>
                </div>

                {/* Call Us Card */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-brand-orange/30 hover:bg-white/10 transition-all flex flex-col justify-between gap-4 group">
                    <div className="space-y-4">
                        <div className="p-3 bg-brand-green-dark/30 text-brand-orange rounded-lg w-fit group-hover:scale-105 transition-transform">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Call Us</h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone Hotline</span>
                        </div>
                        <a
                            href="tel:+919986230357"
                            className="text-xs text-brand-orange font-semibold hover:underline block pt-2"
                        >
                            +91 99862 30357
                        </a>
                        <a
                            href="tel:+919986230735"
                            className="text-xs text-brand-orange font-semibold hover:underline block pt-1"
                        >
                            +91 99862 30735
                        </a>
                    </div>
                </div>

                {/* Email Us Card */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-brand-orange/30 hover:bg-white/10 transition-all flex flex-col justify-between gap-4 group">
                    <div className="space-y-4">
                        <div className="p-3 bg-brand-green-dark/30 text-brand-orange rounded-lg w-fit group-hover:scale-105 transition-transform">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Email Us</h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Support</span>
                        </div>
                        <a
                            href="mailto:sunitha.p@ascension.net.in"
                            className="text-xs text-brand-orange font-semibold hover:underline block pt-2 break-all"
                        >
                            sunitha.p@ascension.net.in
                        </a>
                    </div>
                </div>

                {/* Connect / WhatsApp Card */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-brand-orange/30 hover:bg-white/10 transition-all flex flex-col justify-between gap-4 group">
                    <div className="space-y-4">
                        <div className="p-3 bg-brand-green-dark/30 text-emerald-450 rounded-lg w-fit group-hover:scale-105 transition-transform">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Connect</h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">WhatsApp & Hours</span>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[11px] text-gray-300 font-light flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                Mon - Sat: 9am - 6pm
                            </p>
                            <a
                                href="https://wa.me/919986230357"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-[10px] tracking-wide transition-all uppercase w-fit"
                            >
                                Chat Now
                            </a>
                        </div>
                    </div>
                </div>

                {/* LinkedIn Card */}
                <a
                    href="https://www.linkedin.com/company/ascension-recruitment-india"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Ascension Recruitment on LinkedIn"
                    className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-[#0A66C2]/50 hover:bg-white/10 transition-all flex flex-col justify-between gap-4 group"
                >
                    <div className="space-y-4">
                        <div className="p-3 bg-[#0A66C2] text-white rounded-lg w-fit group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Follow Us</h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">LinkedIn</span>
                        </div>
                        <span className="text-xs text-brand-orange font-semibold group-hover:underline block pt-2">
                            Ascension Recruitment India
                        </span>
                    </div>
                </a>
            </div>

            {/* Sub-Footer */}
            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider w-full text-center">
                <p className="w-full text-center">© 2026 Ascension Recruitment. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
