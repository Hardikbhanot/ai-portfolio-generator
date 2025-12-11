import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';
import { v4 as uuidv4 } from 'uuid'; // A library to generate unique IDs
import AiAssistantPanel from '../components/AiAssistantPanel';
import apiClient from '../api/axiosConfig';
import { Wand2, CloudUpload as CloudUploadIcon } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

// --- Theme definitions with full styles ---
const themes = {
    'modern-dark': {
        styles: `
            body { background-color: #111827; color: #d1d5db; font-family: 'Inter', sans-serif; }
            .section-title { border-bottom: 3px solid #4f46e5; }
            .skill-badge { background-color: #374151; color: #f3f4f6; transition: all 0.2s ease-in-out; }
            .skill-badge:hover { background-color: #4f46e5; transform: translateY(-2px); }
            .project-card { background-color: #1f2937; border: 1px solid #374151; transition: transform 0.2s, box-shadow 0.2s; }
            .project-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1), 0 4px 6px -2px rgba(79, 70, 229, 0.05); }
        `,
        fonts: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">',
        bodyClass: 'p-8 md:p-12 lg:p-16',
        containerClass: 'max-w-4xl mx-auto',
        sectionClass: 'mb-16',
        h1Class: 'text-5xl font-black mb-6 pb-3 section-title text-white',
        h2Class: 'text-4xl font-bold mb-6 pb-3 section-title text-white',
        pClass: 'text-lg leading-relaxed text-gray-300',
        skillWrapperClass: 'flex flex-wrap gap-3',
        skillBadgeClass: 'skill-badge px-4 py-2 rounded-full font-medium text-sm cursor-default',
        projectGridClass: 'grid gap-8 grid-cols-1 md:grid-cols-2',
        projectCardClass: 'project-card p-6 rounded-lg',
        projectTitleClass: 'font-bold text-xl text-white mb-2',
        projectDescClass: 'text-gray-400 text-base',
    },
    'classic-light': {
        styles: `
            body { background-color: #f8f9fa; color: #212529; font-family: 'Source Sans 3', sans-serif; }
            .section-title { border-bottom: 2px solid #0d6efd; font-family: 'Lora', serif; }
            .skill-badge { background-color: #e9ecef; color: #0d6efd; border: 1px solid #dee2e6; transition: all 0.2s ease-in-out; }
            .skill-badge:hover { background-color: #0d6efd; color: white; border-color: #0d6efd; }
            .project-card { background-color: #ffffff; border: 1px solid #e9ecef; transition: transform 0.2s, box-shadow 0.2s; }
            .project-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px -4px rgba(0,0,0,0.1); }
        `,
        fonts: '<link href="https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">',
        bodyClass: 'p-8 md:p-12 lg:p-16',
        containerClass: 'max-w-4xl mx-auto',
        sectionClass: 'mb-16',
        h1Class: 'text-5xl font-bold mb-6 pb-3 section-title text-gray-800',
        h2Class: 'text-4xl font-bold mb-6 pb-3 section-title text-gray-800',
        pClass: 'text-lg leading-relaxed text-gray-600',
        skillWrapperClass: 'flex flex-wrap gap-3',
        skillBadgeClass: 'skill-badge px-4 py-2 rounded-full font-semibold text-sm cursor-default',
        projectGridClass: 'grid gap-8 grid-cols-1 md:grid-cols-2',
        projectCardClass: 'project-card p-6 rounded-lg',
        projectTitleClass: 'font-bold text-xl text-gray-800 mb-2',
        projectDescClass: 'text-gray-600 text-base',
    },
    'creative-vibrant': {
        styles: `
            body { background-color: #f4f4f5; color: #27272a; font-family: 'Poppins', sans-serif; }
            .gradient-text { background-image: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; color: transparent; }
            .section-title { border-bottom: 3px solid #d946ef; }
            .skill-badge { background-color: #ffffff; color: #52525b; border: 1px solid #e4e4e7; transition: all 0.2s ease-in-out; }
            .skill-badge:hover { color: #ec4899; border-color: #ec4899; box-shadow: 0 0 10px rgba(236, 72, 153, 0.2); transform: scale(1.05); }
            .project-card { background-color: #ffffff; border: 1px solid #e4e4e7; border-bottom: 4px solid transparent; transition: all 0.3s ease; }
            .project-card:hover { border-bottom-color: #8b5cf6; transform: translateY(-5px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.08); }
        `,
        fonts: '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800&display=swap" rel="stylesheet">',
        bodyClass: 'p-8 md:p-12 lg:p-16',
        containerClass: 'max-w-4xl mx-auto',
        sectionClass: 'mb-16',
        h1Class: 'text-5xl font-extrabold mb-6 pb-3 section-title gradient-text',
        h2Class: 'text-4xl font-bold mb-6 pb-3 section-title text-zinc-800',
        pClass: 'text-lg leading-relaxed text-zinc-600',
        skillWrapperClass: 'flex flex-wrap gap-3',
        skillBadgeClass: 'skill-badge px-4 py-2 rounded-lg font-semibold text-sm cursor-default',
        projectGridClass: 'grid gap-8 grid-cols-1 md:grid-cols-2',
        projectCardClass: 'project-card p-6 rounded-xl',
        projectTitleClass: 'font-bold text-xl text-zinc-800 mb-2',
        projectDescClass: 'text-zinc-600 text-base',
    }
};



function PortfolioEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { portfolioData, templateId } = location.state || {};
    const { user, token } = useAuth(); // Get user and token

    const [editor, setEditor] = useState(null);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // useMemo prevents the option object re-creation
    const editorOptions = useMemo(() => {
        if (!portfolioData || !user?.id) return null;

        const initialHtml = buildInitialHtml(portfolioData, templateId);
        const licenseKey = process.env.REACT_APP_GRAPESJS_LICENSE || '';
        const portfolioId = portfolioData.portfolioId;

        return {
            licenseKey: licenseKey,
            project: {
                type: 'web',
                // This 'default' project is used if NO data is loaded (404 from remote)
                default: {
                    pages: [{ name: 'Home', component: initialHtml }]
                }
            },
            storageManager: {
                type: 'remote',
                autosave: true,
                stepsBeforeSave: 3,
                urlStore: `${apiClient.defaults.baseURL}/api/portfolios/${portfolioId}/store`,
                urlLoad: `${apiClient.defaults.baseURL}/api/portfolios/${portfolioId}/load`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                contentTypeJson: true,
                // On error (404), GrapesJS usually logs it. We rely on project.default fallback.
            },
            assets: {
                storageType: 'remote',
            },
            container: '#gjs',
            fromElement: true,
            height: '100%',
            width: '100%',
        };
    }, [portfolioData, templateId, user, token]);

    // Remove the manual load effect and function
    useEffect(() => {
        if (!portfolioData) navigate('/generate');
    }, [portfolioData, navigate]);

    const handleRegenerate = async (elementId, sectionType, instructions) => {
        if (!editor) return;

        setIsRegenerating(true);
        try {
            // 1. Get current content
            const component = editor.getWrapper().find(`#${elementId}`)[0];
            if (!component) {
                alert(`Could not find section: ${elementId}`);
                setIsRegenerating(false);
                return;
            }

            // For complex structures like skills/projects, we might want innerHTML, 
            // but for Bio it's just text. 
            // Let's grab the HTML to be safe and versatile.
            const currentContent = component.get('content') || component.components().map(c => c.toHTML()).join('');

            // 2. Call API
            const response = await apiClient.post('/api/ai/regenerate', {
                sectionType,
                currentContent,
                instructions
            });

            const newContent = response.data.newContent;

            // 3. Update Editor
            // If it's a wrapper (skills/projects), we replace children. 
            // If it's text (bio), we replace content.
            if (elementId === 'bio-content') {
                component.components(newContent);
            } else {
                // For lists, the AI usually returns the full HTML string of the list items
                // We replace the inner components
                component.components(newContent);
            }

        } catch (error) {
            console.error("Regeneration failed", error);
            alert("Failed to regenerate content. Please try again.");
        } finally {
            setIsRegenerating(false);
        }
    };

    const [isDeploying, setIsDeploying] = useState(false);

    const handleSave = async () => {
        if (!editor || !portfolioData?.portfolioId) return;
        setIsDeploying(true); // Start deployment animation

        try {
            await editor.store();

            // Simulate "Building" time for better UX (2 seconds)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if user has a subdomain to redirect to
            if (user?.subdomain) {
                // Redirect to the public site
                const protocol = window.location.protocol;
                const host = window.location.host;
                // Determine base domain (production vs localhost)
                // If localhost:3000 -> hardik.localhost:3000 (needs /etc/hosts) - tricky.
                // If production -> hardik.portfolio-generator...

                // For safety, we just alert success and offer link, OR redirect if we are sure.
                // Let's redirect to the dashboard which has the link, OR better: 
                // Redirect to the LIVE site if in production.

                // For MVP: Show success in modal with "Visit Site" button.
                // But user asked for "redirect once ready".

                // Let's construct the URL:
                const publicUrl = `https://${user.subdomain}.portfolio-generator.hbhanot.tech`; // Hardcoded for prod
                window.location.href = publicUrl;
            } else {
                alert("Saved! Claim a subdomain in the dashboard to go live.");
                setIsDeploying(false);
            }

        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to save.");
            setIsDeploying(false);
        }
    };

    if (!editorOptions) {
        return <div className="flex items-center justify-center h-screen">Loading Editor...</div>;
    }

    return (
        <div style={{ height: 'calc(100vh - 64px)', marginTop: '64px', position: 'relative' }}>
            <StudioEditor
                options={editorOptions}
                onEditor={(editorInstance) => setEditor(editorInstance)}
            />

            {/* Manual Save Button */}
            <button
                onClick={handleSave}
                className="absolute bottom-24 right-6 z-[50] bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2"
                title="Publish Changes"
            >
                <CloudUploadIcon size={24} />
                <span className="font-bold">Publish</span>
            </button>

            {/* AI Toggle Button - FAB Style */}
            <button
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className="absolute bottom-6 right-6 z-[50] bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2"
                title="AI Assistant"
            >
                <Wand2 size={24} />
                <span className="font-bold">AI Helper</span>
            </button>

            <AiAssistantPanel
                isOpen={isAiPanelOpen}
                onClose={() => setIsAiPanelOpen(false)}
                onRegenerate={handleRegenerate}
                isRegenerating={isRegenerating}
            />

            {/* Deployment Modal */}
            {isDeploying && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                            <CloudUploadIcon className="absolute inset-0 m-auto text-indigo-600" size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Publishing to Live...</h3>
                            <p className="text-gray-500 dark:text-gray-400">Optimizing assets, building HTML, and deploying to global CDN.</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                            <div className="bg-indigo-600 h-2.5 rounded-full animate-progress" style={{ width: '100%', transition: 'width 2s ease-in-out' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const buildInitialHtml = (data, themeId = 'modern-dark') => {
    const theme = themes[themeId] || themes['modern-dark'];

    const skillsArray = Array.isArray(data.skills)
        ? data.skills
        : typeof data.skills === 'string'
            ? data.skills.split(',').map(skill => skill.trim())
            : [];

    const skillsHtml = skillsArray.length > 0
        ? skillsArray.map(skill =>
            `<span class="${theme.skillBadgeClass}">${skill}</span>`
        ).join('')
        : '<p>No skills found.</p>';

    const projectsHtml = data.projects && data.projects.length > 0
        ? data.projects.map(project => `
            <div class="${theme.projectCardClass}">
                <h3 class="${theme.projectTitleClass}">${project.name}</h3>
                <p class="${theme.projectDescClass}">${project.description}</p>
            </div>
          `).join('')
        : '<p>No projects found.</p>';

    return `
        <html>
            <head>
                <title>AI-Generated Portfolio</title>
                <script src="https://cdn.tailwindcss.com"></script>
                ${theme.fonts}
                <style>${theme.styles}</style>
            </head>
            <body class="${theme.bodyClass}">
                <div class="${theme.containerClass}">
                    <section class="${theme.sectionClass}">
                        <h1 class="${theme.h1Class}">Professional Summary</h1>
                        <p id="bio-content" class="${theme.pClass}">${data.bio || 'No bio found.'}</p>
                    </section>
                    <section class="${theme.sectionClass}">
                        <h2 class="${theme.h2Class}">Skills</h2>
                        <div id="skills-wrapper" class="${theme.skillWrapperClass}">${skillsHtml}</div>
                    </section>
                    <section>
                        <h2 class="${theme.h2Class}">Key Projects</h2>
                        <div id="projects-grid" class="${theme.projectGridClass}">${projectsHtml}</div>
                    </section>
                </div>
            </body>
        </html>
    `;
};

export default PortfolioEditor;

