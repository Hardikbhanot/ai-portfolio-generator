import React, { useState } from 'react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiAssistantPanel = ({ isOpen, onClose, onRegenerate, isRegenerating }) => {
    const [section, setSection] = useState('bio-content');
    const [instructions, setInstructions] = useState('');

    const handleRegenerate = () => {
        if (!instructions.trim()) return;

        let sectionType = "Bio";
        if (section === 'skills-wrapper') sectionType = "Skills List";
        if (section === 'projects-grid') sectionType = "Projects";

        onRegenerate(section, sectionType, instructions);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-2xl z-40 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="text-purple-500" size={20} />
                            AI Assistant
                        </h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Section to Rewrite
                            </label>
                            <select
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value="bio-content">Professional Summary</option>
                                <option value="skills-wrapper">Skills</option>
                                <option value="projects-grid">Key Projects</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Instructions
                            </label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="E.g., Make it more formal, simpler, funnier..."
                                className="w-full h-32 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating || !instructions.trim()}
                            className="w-full btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2"
                        >
                            {isRegenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            {isRegenerating ? "Rewriting..." : "Regenerate"}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AiAssistantPanel;
