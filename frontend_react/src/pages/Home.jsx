import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Award, Users, Building, TrendingUp, UserCheck, Search, Zap,
    Briefcase, Handshake, ShieldCheck, UserPlus, Calendar, Settings,
    GraduationCap, FileText, Mail, Monitor, Cpu, Heart, Building2,
    Wrench, ShoppingCart, Truck, Quote, ArrowRight, ClipboardCheck
} from 'lucide-react';
import heroOffice from '../assets/hero_office.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Home = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [otpStatus, setOtpStatus] = useState(null); // 'sending', 'sent', 'verifying', 'verified', 'error'
    const [otpError, setOtpError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendOTP = async () => {
        // Validate email format
        if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.email)) {
            setOtpError("Invalid email address format.");
            return;
        }

        setOtpError('');
        setOtpStatus('sending');

        try {
            const response = await fetch(`${API_BASE}/api/send-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await response.json();
            if (response.ok) {
                setOtpStatus('sent');
            } else {
                setOtpError(data.error || "Failed to send OTP.");
                setOtpStatus('error');
            }
        } catch (error) {
            setOtpError("Network error sending OTP.");
            setOtpStatus('error');
        }
    };

    const handleVerifyOTP = async () => {
        if (!emailOtp) {
            setOtpError("Please enter the 6-digit email OTP.");
            return;
        }

        setOtpError('');
        setOtpStatus('verifying');

        try {
            const response = await fetch(`${API_BASE}/api/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    otp: emailOtp
                })
            });
            const data = await response.json();
            if (response.ok) {
                setOtpStatus('verified');
                setIsVerified(true);
            } else {
                setOtpError(data.error || "Incorrect OTP code.");
                setOtpStatus('error');
            }
        } catch (error) {
            setOtpError("Network error verifying OTP.");
            setOtpStatus('error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) {
            setOtpError("Please verify your email using OTP first.");
            return;
        }
        setSubmitStatus('loading');

        const payload = {
            name: formData.name,
            email: formData.email,
            enquiry_type: 'General',
            message: `Phone: ${formData.phone}\nCompany/Position: ${formData.company}\n\nMessage:\n${formData.message}`
        };

        try {
            const response = await fetch(`${API_BASE}/api/enquiries/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setIsVerified(false);
                setOtpStatus(null);
                setEmailOtp('');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    message: ''
                });
            } else {
                const data = await response.json();
                setOtpError(data.error || "Failed to submit enquiry.");
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setSubmitStatus('error');
        }
    };

    const handleScrollClick = (id, e) => {
        if (window.scrollToSection) {
            e.preventDefault();
            window.scrollToSection(id);
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <section id="hero" className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-green-dark leading-[1.1] tracking-tight">
                        Connecting Exceptional Talent with Exceptional Companies for Over <span className="text-brand-orange">20 Years</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                        We help businesses build high-performing teams by identifying, evaluating and placing the right professionals. Our experience. Your success.
                    </p>
                </div>
                <div className="lg:col-span-6 flex justify-center">
                    <div className="relative w-full max-w-lg aspect-square">
                        <div className="absolute inset-0 bg-brand-orange/5 rounded-2xl -rotate-3 transform scale-102"></div>
                        <img
                            src={heroOffice}
                            alt="Team Collaboration"
                            className="relative z-10 w-full h-full object-cover rounded-2xl shadow-xl shadow-brand-green-dark/10"
                        />
                    </div>
                </div>
            </section>

            {/* Stats Banner Section */}
            <section className="bg-brand-green-dark text-white py-10 shadow-inner">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y-0 divide-x-0 lg:divide-x divide-white/10">
                    <div className="flex items-center gap-4 lg:justify-center p-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <Award className="w-6 h-6 text-brand-orange" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tight">20+</p>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mt-0.5">Years of Experience</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 lg:justify-center p-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <Users className="w-6 h-6 text-brand-orange" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tight">5,000+</p>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mt-0.5">Successful Placements</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 lg:justify-center p-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <Building className="w-6 h-6 text-brand-orange" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tight">300+</p>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mt-0.5">Happy Clients</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 lg:justify-center p-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-brand-orange" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white tracking-tight">95%</p>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mt-0.5">Client Retention Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                {/* Left text column */}
                <div className="lg:col-span-5 space-y-6">
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">About Us</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green-dark leading-tight tracking-tight">
                        Two Decades of Trust. <br />A Future of Possibilities.
                    </h2>
                    <div className="space-y-4 text-gray-500 text-sm leading-relaxed font-light">
                        <p>
                            For over 20 years, Ascension Recruitment Solutions has been a trusted partner for organizations seeking exceptional talent across diverse industries.
                        </p>
                        <p>
                            We go beyond filling vacancies – we understand your culture, your goals, and your challenges to deliver recruitment solutions that create long-term value.
                        </p>
                        <p>
                            With a team of experienced consultants and a wide talent network, we continue to connect the right people with the right opportunities.
                        </p>
                    </div>
                    <div className="pt-2">
                        <a href="#contact" onClick={(e) => handleScrollClick('contact', e)} className="bg-brand-green text-white px-6 py-3.5 rounded font-bold text-xs tracking-wider hover:bg-brand-green/90 shadow-md transition-all uppercase">
                            Know More About Us
                        </a>
                    </div>
                </div>

                {/* Right 3x2 grid column */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
                        <div className="p-3.5 bg-brand-green/5 rounded-full text-brand-green">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wide text-brand-green-dark uppercase">Personalized Recruitment</h4>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
                        <div className="p-3.5 bg-brand-green/5 rounded-full text-brand-green">
                            <Search className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wide text-brand-green-dark uppercase">Thorough Screening</h4>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
                        <div className="p-3.5 bg-brand-green/5 rounded-full text-brand-green">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wide text-brand-green-dark uppercase">Faster Turnaround</h4>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
                        <div className="p-3.5 bg-brand-green/5 rounded-full text-brand-green">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wide text-brand-green-dark uppercase">Industry Expertise</h4>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
                        <div className="p-3.5 bg-brand-green/5 rounded-full text-brand-green">
                            <Handshake className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wide text-brand-green-dark uppercase">Long-Term Partnerships</h4>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
                        <div className="p-3.5 bg-brand-green/5 rounded-full text-brand-green">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wide text-brand-green-dark uppercase">Ethical & Transparent</h4>
                    </div>
                </div>
            </section>

            {/* Our Services Section */}
            <section id="services" className="bg-gray-50/50 border-y border-gray-100 py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Our Services</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                        {/* Service Card 1 */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full min-h-[220px]">
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/5 rounded text-brand-green w-fit">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-wide">Permanent Hiring</h4>
                                <p className="text-gray-500 text-xs leading-relaxed font-light">
                                    Finding the right talent for long-term roles.
                                </p>
                            </div>
                        </div>

                        {/* Service Card 2 */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full min-h-[220px]">
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/5 rounded text-brand-green w-fit">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-wide">Executive Search</h4>
                                <p className="text-gray-500 text-xs leading-relaxed font-light">
                                    Leadership and senior management hiring.
                                </p>
                            </div>
                        </div>

                        {/* Service Card 3 */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full min-h-[220px]">
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/5 rounded text-brand-green w-fit">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-wide">Bulk Hiring</h4>
                                <p className="text-gray-500 text-xs leading-relaxed font-light">
                                    Large scale recruitment solutions.
                                </p>
                            </div>
                        </div>

                        {/* Service Card 4 */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full min-h-[220px]">
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/5 rounded text-brand-green w-fit">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-wide">Contract Staffing</h4>
                                <p className="text-gray-500 text-xs leading-relaxed font-light">
                                    Flexible staffing for temporary needs.
                                </p>
                            </div>
                        </div>

                        {/* Service Card 5 */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full min-h-[220px]">
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/5 rounded text-brand-green w-fit">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-wide">RPO Solutions</h4>
                                <p className="text-gray-500 text-xs leading-relaxed font-light">
                                    End-to-end recruitment process outsourcing.
                                </p>
                            </div>
                        </div>

                        {/* Service Card 6 */}
                        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full min-h-[220px]">
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-green/5 rounded text-brand-green w-fit">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-brand-green-dark uppercase tracking-wide">Campus Hiring</h4>
                                <p className="text-gray-500 text-xs leading-relaxed font-light">
                                    Attracting and hiring young talent.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Approach Timeline Section */}
            <section id="approach" className="max-w-7xl mx-auto px-6 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-4 space-y-6">
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Our Approach</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green-dark leading-tight tracking-tight">
                        A Structured Process. <br />Better Results.
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed font-light">
                        We follow a proven recruitment process that ensures quality, efficiency and the perfect fit.
                    </p>
                </div>

                <div className="lg:col-span-8 relative">
                    {/* Background Connecting Dotted Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] border-t border-dashed border-gray-300 hidden md:block -translate-y-8 z-0"></div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative z-10">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-green shadow-md shadow-brand-green/5 transition-transform hover:scale-110">
                                <ClipboardCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">01</p>
                                <h5 className="text-[10px] md:text-xs font-extrabold text-brand-green-dark uppercase mt-1 leading-tight tracking-wide">Understand Requirement</h5>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-green shadow-md shadow-brand-green/5 transition-transform hover:scale-110">
                                <Search className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">02</p>
                                <h5 className="text-[10px] md:text-xs font-extrabold text-brand-green-dark uppercase mt-1 leading-tight tracking-wide">Candidate Sourcing</h5>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-green shadow-md shadow-brand-green/5 transition-transform hover:scale-110">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">03</p>
                                <h5 className="text-[10px] md:text-xs font-extrabold text-brand-green-dark uppercase mt-1 leading-tight tracking-wide">Screening & Assessment</h5>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-green shadow-md shadow-brand-green/5 transition-transform hover:scale-110">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">04</p>
                                <h5 className="text-[10px] md:text-xs font-extrabold text-brand-green-dark uppercase mt-1 leading-tight tracking-wide">Interview Coordination</h5>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-green shadow-md shadow-brand-green/5 transition-transform hover:scale-110">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">05</p>
                                <h5 className="text-[10px] md:text-xs font-extrabold text-brand-green-dark uppercase mt-1 leading-tight tracking-wide">Offer Management</h5>
                            </div>
                        </div>

                        {/* Step 6 */}
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-green shadow-md shadow-brand-green/5 transition-transform hover:scale-110">
                                <Handshake className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">06</p>
                                <h5 className="text-[10px] md:text-xs font-extrabold text-brand-green-dark uppercase mt-1 leading-tight tracking-wide">Joining & Follow-up</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industries We Serve Section */}
            <section id="industries" className="bg-gray-50/30 border-y border-gray-100 py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Industries We Serve</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-green-dark leading-tight tracking-tight">
                            Specialized Recruitment Solutions Across Key Sectors
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">
                            We bridge specialized domain expertise with high-caliber talent to fuel growth across diverse industries.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* IT & Software */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <Monitor className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">IT & Software</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Scaling technical engineering teams from early-stage startups to global technology giants.
                            </p>
                        </div>

                        {/* Manufacturing */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">Manufacturing</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Connecting heavy operations, plant managers, and quality control supervisors.
                            </p>
                        </div>

                        {/* Healthcare */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">Healthcare</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Sourcing nursing staff, clinical researchers, and medical healthcare administrators.
                            </p>
                        </div>

                        {/* BFSI */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">BFSI</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Hiring financial specialists, investment advisors, risk controllers, and banking managers.
                            </p>
                        </div>

                        {/* Engineering */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <Wrench className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">Engineering</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Placing aerospace, structural, civil, mechanical, and automotive engineers.
                            </p>
                        </div>

                        {/* Retail */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">Retail</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Staffing store operations, supply chain lead managers, and retail visual merchandisers.
                            </p>
                        </div>

                        {/* Logistics */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <Truck className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">Logistics</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Sourcing transport managers, warehouse leads, and end-to-end supply chain controllers.
                            </p>
                        </div>

                        {/* Construction */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <Building className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">Construction</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Placing site surveyors, general contractors, structural designers, and project leads.
                            </p>
                        </div>

                        {/* Education */}
                        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-brand-green/30 transition-all flex flex-col items-center text-center space-y-4 group">
                            <div className="p-4 bg-brand-green/5 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h4 className="text-base font-bold text-brand-green-dark uppercase tracking-wider group-hover:text-brand-orange transition-colors">Education</h4>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                Connecting professors, academic researchers, administrators, and educational leaders.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / Get In Touch Form Section */}
            <section id="contact" className="max-w-4xl mx-auto px-6 py-20">
                <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-8 md:p-12 space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Contact Us</span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-brand-green-dark tracking-tight">Let's Connect</h2>
                        <p className="text-xs text-gray-400 font-light max-w-md mx-auto">
                            Send us a message and our recruitment specialists will get back to you shortly.
                        </p>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                        {submitStatus === 'success' && (
                            <div className="md:col-span-2 p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-lg text-xs font-semibold">
                                Thank you! Your enquiry has been sent successfully. Our team will get back to you shortly.
                            </div>
                        )}
                        {submitStatus === 'error' && (
                            <div className="md:col-span-2 p-4 bg-rose-50 border border-rose-250 text-rose-800 rounded-lg text-xs font-semibold">
                                Something went wrong. Please try again or connect with us directly via phone or WhatsApp.
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                                {isVerified && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsVerified(false); setOtpStatus(null); setEmailOtp(''); }}
                                        className="text-[9px] text-brand-orange hover:underline font-bold uppercase tracking-wider cursor-pointer font-sans"
                                    >
                                        Change Email
                                    </button>
                                )}
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isVerified}
                                className="w-full px-4 py-3 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                required
                                className="w-full px-4 py-3 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Company /  Organization</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="XYZ Corp"
                                className="w-full px-4 py-3 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Message</label>
                            <textarea
                                rows="4"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can we help you?"
                                required
                                className="w-full px-4 py-3 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green transition-colors resize-none"
                            ></textarea>
                        </div>

                        {/* Email Verification Section */}
                        <div className="md:col-span-2 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-150">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                                Email Identity Verification
                            </span>
                            {otpError && (
                                <p className="text-[11px] font-semibold text-rose-600">{otpError}</p>
                            )}

                            {!isVerified ? (
                                <div className="space-y-3">
                                    <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                                        Please verify your email address ({formData.email || 'john@example.com'}) using an OTP code before sending your enquiry.
                                    </p>
                                    
                                    {otpStatus === null || otpStatus === 'error' || otpStatus === 'sending' ? (
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            disabled={otpStatus === 'sending'}
                                            className="bg-brand-orange hover:bg-brand-orange/95 text-white font-bold px-4 py-2.5 rounded text-[10px] tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
                                        >
                                            {otpStatus === 'sending' ? 'Sending OTP...' : 'Send Verification OTP'}
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Enter Email Verification OTP</label>
                                                <input 
                                                    type="text" 
                                                    value={emailOtp}
                                                    onChange={(e) => setEmailOtp(e.target.value)}
                                                    placeholder="123456" 
                                                    maxLength="6"
                                                    className="w-full max-w-xs px-3 py-2 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green" 
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOTP}
                                                    disabled={otpStatus === 'verifying'}
                                                    className="bg-brand-green hover:bg-brand-green/90 text-white font-bold px-5 py-2.5 rounded text-[10px] tracking-wider uppercase transition-all cursor-pointer"
                                                >
                                                    {otpStatus === 'verifying' ? 'Verifying...' : 'Verify OTP'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSendOTP}
                                                    className="border border-gray-300 hover:bg-gray-100 text-gray-600 font-bold px-5 py-2.5 rounded text-[10px] tracking-wider uppercase transition-all cursor-pointer"
                                                >
                                                    Resend OTP
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping animate-duration-1000"></span>
                                    Email verified successfully!
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 pt-2">
                            <button
                                type="submit"
                                disabled={submitStatus === 'loading' || !isVerified}
                                className="bg-brand-green text-white px-8 py-4 rounded font-bold text-xs tracking-wider hover:bg-brand-green/90 shadow-md shadow-brand-green/10 transition-all uppercase w-full disabled:opacity-40 cursor-pointer"
                            >
                                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;