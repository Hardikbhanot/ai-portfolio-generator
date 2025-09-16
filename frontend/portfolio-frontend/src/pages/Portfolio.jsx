import React, {useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from '../api/axiosConfig';
import { motion, AnimatePresence } from "framer-motion";
import { Code as CodeIcon, CloudUpload as CloudUploadIcon, ArrowRight as ArrowRightIcon, Loader2, X as XIcon } from "lucide-react";
import Notification from "../components/Notification";
import TemplateCard from "../components/TemplateCard";

// --- Template data is now defined directly in this file ---
const templates = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'A sleek, professional theme for tech roles.',
    thumbnail: '/images/template-modern-dark.png',
  },
  {
    id: 'classic-light',
    name: 'Classic Light',
    description: 'A clean and elegant design for any profession.',
    thumbnail: '/images/template-classic-light.png',
  },
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    description: 'A colorful and bold layout for creative artists.',
    thumbnail: '/images/template-creative-vibrant.png',
  },
];

// --- Reusable Components ---
const PrimaryButton = ({ children, ...props }) => (
    <button {...props} className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition-all duration-300 bg-indigo-600 rounded-lg group disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-white hover:text-indigo-600">
        <span className="absolute inset-0 w-0 h-0 transition-all duration-300 ease-out bg-white rounded-lg group-hover:w-full group-hover:h-full opacity-10"></span>
        <span className="relative flex items-center gap-2">{children}</span>
    </button>
);

const TemplatePreviewModal = ({ template, onClose }) => {
    if (!template) return null;
    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 z-10">
                        <XIcon size={24} />
                    </button>
                    <img src={template.thumbnail} alt={`${template.name} Preview`} className="w-full object-contain rounded-lg" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Main Page Component ---
function PortfolioViewPage() {
    const [step, setStep] = useState('upload');
    const [file, setFile] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleProceedToTemplates = () => {
        if (!file) {
            setNotification({ type: 'error', message: 'Please upload a resume file first.' });
            return;
        }
        setStep('selectTemplate');
    };

    const handleGeneratePortfolio = async () => {
        if (!file || !selectedTemplateId) return;
        setIsGenerating(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await apiClient.post("/api/portfolios/generate", formData);
            // Navigate to the editor, passing BOTH the data and the chosen templateId
            navigate('/editor', { 
                state: { 
                    portfolioData: response.data,
                    templateId: selectedTemplateId 
                } 
            });
        } catch (error) {
            console.error("Error generating portfolio data:", error);
            setNotification({ type: 'error', message: "An error occurred while generating portfolio data." });
        } finally {
            setIsGenerating(false);
        }
    };

    const renderContent = () => {
        switch (step) {
            case 'upload':
                return (
                    <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Step 1: Upload Your Resume</h1>
                        <p className="text-gray-600 dark:text-gray-400">Let our AI create the foundation of your new portfolio.</p>
                        <label className="flex items-center justify-center w-full max-w-md mx-auto px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            <CloudUploadIcon className="w-5 h-5 mr-2" />
                            {file ? file.name : "Choose a PDF or DOCX file"}
                            <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                        </label>
                        <PrimaryButton onClick={handleProceedToTemplates} disabled={!file}>
                            Next: Choose a Template <ArrowRightIcon size={18} />
                        </PrimaryButton>
                    </motion.div>
                );
            case 'selectTemplate':
                return (
                     <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Step 2: Choose a Theme</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Select a visual style for your portfolio.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map(template => (
                                <TemplateCard key={template.id} template={template} isSelected={selectedTemplateId === template.id} onSelect={setSelectedTemplateId} onPreview={setPreviewTemplate} />
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <PrimaryButton onClick={handleGeneratePortfolio} disabled={isGenerating || !selectedTemplateId}>
                                {isGenerating ? <Loader2 className="animate-spin" /> : <CodeIcon className="w-5 h-5" />}
                                {isGenerating ? "Generating..." : "Generate & Edit"}
                            </PrimaryButton>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <>
            <Notification notification={notification} setNotification={setNotification} />
            <div className="min-h-screen flex items-center justify-center p-8 pt-24 bg-gray-100 dark:bg-gray-900">
                 <div className="w-full max-w-4xl p-8 bg-white/40 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </div>
            <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
        </>
    );
}

export default PortfolioViewPage;