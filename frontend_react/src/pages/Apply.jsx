import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, FileText, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Apply = () => {
    const { jobId } = useParams();
    const [searchParams] = useSearchParams();
    const jobTitle = searchParams.get('title') || 'Job Opening';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resumeName: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [otpStatus, setOtpStatus] = useState(null); // 'sending', 'sent', 'verifying', 'verified', 'error'
    const [otpError, setOtpError] = useState('');

    useEffect(() => {
        // Unlock scroll on mount
        document.body.style.overflow = 'auto';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, resumeName: file.name }));
            setResumeFile(file);
        }
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
        if (!resumeFile) {
            alert("Please upload your resume PDF.");
            return;
        }
        setSubmitStatus('loading');

        const data = new FormData();
        data.append('job', jobId);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('resume', resumeFile);

        try {
            const response = await fetch(`${API_BASE}/api/applications/`, {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                setSubmitStatus('success');
            } else {
                const responseData = await response.json();
                setOtpError(responseData.error || "Failed to submit application.");
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            setSubmitStatus('error');
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full animate-bounce">
                        <CheckCircle className="w-16 h-16" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-brand-green-dark">Application Submitted!</h2>
                <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                    We will get in touch with you soon via your provided email or phone if your profile matches our requirements.
                </p>
                <div className="pt-4">
                    <Link 
                        to="/jobseeker" 
                        className="bg-brand-green text-white px-6 py-3 rounded font-bold text-xs uppercase tracking-wider hover:bg-brand-green/90 shadow-md transition-all inline-block"
                    >
                        Back to Openings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
            {/* Back to Jobseeker */}
            <Link 
                to="/jobseeker" 
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-green transition-colors mb-6 uppercase tracking-wider"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Careers
            </Link>

            <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-8 md:p-12 space-y-8">
                <div className="space-y-2">
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Join Our Team</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-brand-green-dark tracking-tight">
                        Apply for {jobTitle}
                    </h2>
                    <p className="text-xs text-gray-400 font-light">
                        Please complete the form below and attach your latest resume to submit your application.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {submitStatus === 'error' && (
                        <div className="p-4 bg-rose-50 border border-rose-250 text-rose-800 rounded-lg text-xs font-semibold">
                            Something went wrong. Please try again or reach out to us directly.
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe" 
                            required
                            className="w-full px-4 py-3 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green transition-colors" 
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address
                            </label>
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
                            placeholder="john@example.com" 
                            required
                            disabled={isVerified}
                            className="w-full px-4 py-3 rounded border border-gray-200 text-xs focus:outline-none focus:border-brand-green transition-colors disabled:bg-gray-50 disabled:text-gray-400" 
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone Number
                        </label>
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

                    {/* Resume Upload */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-400" /> Upload Resume
                        </label>
                        <div className="relative border-2 border-dashed border-gray-200 hover:border-brand-green rounded-lg p-6 transition-colors flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer">
                            <input 
                                type="file" 
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <FileText className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs font-semibold text-gray-600">
                                {formData.resumeName ? formData.resumeName : 'Select Resume File (.pdf, .doc, .docx)'}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1">Max file size 5MB</span>
                        </div>
                    </div>

                    {/* Email Verification Section */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-150">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                            Email Identity Verification
                        </span>
                        {otpError && (
                            <p className="text-[11px] font-semibold text-rose-600">{otpError}</p>
                        )}

                        {!isVerified ? (
                            <div className="space-y-3">
                                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                                    Please verify your email address ({formData.email || 'john@example.com'}) using an OTP code before submitting your application.
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

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button 
                            type="submit"
                            disabled={submitStatus === 'loading' || !isVerified}
                            className="bg-brand-green text-white px-8 py-4 rounded font-bold text-xs tracking-wider hover:bg-brand-green/90 shadow-md shadow-brand-green/10 transition-all uppercase w-full disabled:opacity-40 cursor-pointer"
                        >
                            {submitStatus === 'loading' ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Apply;
