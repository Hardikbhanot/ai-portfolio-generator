import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Code, Cpu, Layout, Sparkles, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/portfolio');
        } else {
            navigate('/login');
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="relative min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
                                Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">AI Portfolio</span> in Minutes
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Turn your resume into a stunning, deployed personal website instantly using advanced AI and beautiful templates.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={handleGetStarted}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                >
                                    {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                {!isAuthenticated && (
                                    <Link
                                        to="/login"
                                        className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg font-semibold rounded-full shadow hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
                                    >
                                        Log In
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Cpu className="w-8 h-8 text-indigo-500" />}
                            title="AI Resume Parsing"
                            description="Upload your PDF/DOCX resume and let our AI extract your skills, projects, and bio automatically."
                        />
                        <FeatureCard
                            icon={<Layout className="w-8 h-8 text-purple-500" />}
                            title="Drag & Drop Editor"
                            description="Customize every pixel found in your portfolio with our powerful, intuitive visual builder."
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-8 h-8 text-pink-500" />}
                            title="Custom Subdomains"
                            description="Publish your site instantly to a custom URL like yourname.portfolio-generator.tech."
                        />
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-16">How it Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 -z-10 rounded-full"></div>

                        <Step
                            number="1"
                            title="Upload Resume"
                            desc="Simply drop your resume file. AI does the heavy lifting."
                        />
                        <Step
                            number="2"
                            title="Choose Template"
                            desc="Select from our range of professional, modern designs."
                        />
                        <Step
                            number="3"
                            title="Publish & Share"
                            desc="Get your live link instantly and share it with the world."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl w-fit mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
);

const Step = ({ number, title, desc }) => (
    <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center mb-6 border-4 border-gray-50 dark:border-gray-700 relative z-10">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 to-purple-500">{number}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-xs">{desc}</p>
    </div>
);

export default LandingPage;
