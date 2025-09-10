import React, { useState, useRef } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
// import { Folder as FolderIcon, Code as CodeIcon, CloudUpload as CloudUploadIcon, Loader2 as LoaderIcon, FileDown as FileDownIcon, X as XIcon, ArrowRight as ArrowRightIcon } from "lucide-react";
import html2canvas from 'html2canvas';
import { Folder as FolderIcon, Code as CodeIcon, CloudUpload as CloudUploadIcon, LoaderIcon, FileDown as FileDownIcon, X as XIcon, ArrowRight as ArrowRightIcon, Loader2 } from "lucide-react";
import jsPDF from 'jspdf';
import { templates } from "../templates"; 
import TemplateCard from "../components/TemplateCard";

// --- Reusable Components (ensure these are defined or imported) ---
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
    // The state correctly starts at 'upload', so this part is fine.
    const [step, setStep] = useState('upload'); 
    const [file, setFile] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [portfolioHtml, setPortfolioHtml] = useState("");
    const contentRef = useRef(null);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleProceedToTemplates = () => {
        if (!file) return alert("Please upload a resume first.");
        setStep('selectTemplate');
    };

    const handleGeneratePortfolio = async () => {
        if (!file || !selectedTemplateId) return;
        setStep('generating');
        const formData = new FormData();
        formData.append("file", file);
        formData.append("templateId", selectedTemplateId);

        try {
            // NOTE: Use an Axios instance with an interceptor to automatically add the token
            const response = await axios.post("http://localhost:8080/api/portfolios/generate", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setPortfolioHtml(response.data.htmlContent);
                setStep('display');
            } else {
                alert(response.data.message || "Failed to generate portfolio.");
                setStep('selectTemplate');
            }
        } catch (error) {
            console.error("Error generating portfolio:", error);
            alert("Failed to generate portfolio. Try again later.");
            setStep('selectTemplate');
        }
    };
    
    const handleDownloadPdf = () => {
        const input = contentRef.current;
        if (input) {
          const buttons = input.querySelectorAll("button, a");
          buttons.forEach(btn => btn.style.display = 'none');
          html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("my-ai-portfolio.pdf");
            buttons.forEach(btn => btn.style.display = '');
          });
        }
    };

    // This function decides which UI to show based on the current 'step'
    const renderContent = () => {
        switch (step) {
            case 'upload':
                return (
                    <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4 p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <h2 className="text-2xl font-bold">Step 1: Upload Your Resume</h2>
                        <p className="text-gray-600 dark:text-gray-400">Let our AI parse your skills, projects, and experience.</p>
                        <label className="flex items-center justify-center w-full max-w-md px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
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
                        <div className="text-center"><h2 className="text-2xl font-bold">Step 2: Choose a Template</h2><p className="text-gray-600 dark:text-gray-400">Select a layout that best fits your style.</p></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{templates.map(template => (<TemplateCard key={template.id} template={template} isSelected={selectedTemplateId === template.id} onSelect={setSelectedTemplateId} onPreview={setPreviewTemplate} />))}</div>
                        <div className="flex justify-center"><PrimaryButton onClick={handleGeneratePortfolio} disabled={!selectedTemplateId}><CodeIcon className="w-5 h-5" /> Generate Portfolio</PrimaryButton></div>
                    </motion.div>
                );

            case 'generating':
                return (
                    <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-4 p-10">
                        <Loader2 as LoaderIcon className="w-12 h-12 animate-spin text-indigo-500" />
                        <h2 className="text-2xl font-bold">Crafting Your Portfolio...</h2>
                        <p className="text-gray-600 dark:text-gray-400">Our AI is working its magic. This might take a moment.</p>
                    </motion.div>
                );

            case 'display':
                return (
                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div dangerouslySetInnerHTML={{ __html: portfolioHtml }} />
                        <div className="flex justify-center mt-10"><PrimaryButton onClick={handleDownloadPdf}><FileDownIcon className="w-5 h-5" /> Download as PDF</PrimaryButton></div>
                    </motion.div>
                );
            default:
                return <div>Something went wrong.</div>;
        }
    };

    return (
        // The main container that is always visible
        <div className="min-h-screen p-8 pt-24 text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
            <div ref={contentRef} className="max-w-4xl mx-auto bg-white/40 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-center mb-2 text-gray-900 dark:text-gray-100">
                    My AI-Powered Portfolio
                </h1>
                {/* The renderContent function is called here to display the current step */}
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
            
            <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
        </div>
    );
}

export default PortfolioViewPage;