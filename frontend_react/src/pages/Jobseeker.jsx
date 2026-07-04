import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const Jobseeker = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        document.body.style.overflow = 'auto';
        fetch(`${API_BASE}/api/jobs/`)
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(err => console.error("Error fetching jobs:", err));
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-brand-green-dark mb-6">Current Openings</h2>
            <div className="grid gap-6">
                {jobs.map(job => (
                    <div key={job.id} className="p-6 bg-white shadow rounded-lg border-l-4 border-brand-orange flex flex-col justify-between items-start md:flex-row md:items-center">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-brand-green-dark">{job.title}</h3>
                            <p className="text-gray-600 text-sm">{job.description}</p>
                            <div className="mt-4 flex gap-4 text-xs font-semibold text-gray-500">
                                <span>Experience: {job.experience}</span>
                                <span>Salary: {job.salary}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 shrink-0">
                            <Link 
                                to={`/apply/${job.id}?title=${encodeURIComponent(job.title)}`}
                                className="inline-block bg-brand-green hover:bg-brand-green/90 text-white font-bold px-6 py-3 rounded text-xs uppercase tracking-wider transition-all"
                            >
                                Apply
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Jobseeker;