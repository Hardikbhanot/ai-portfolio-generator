import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';
import { v4 as uuidv4 } from 'uuid'; // A library to generate unique IDs
import AiAssistantPanel from '../components/AiAssistantPanel';
import apiClient from '../api/axiosConfig';
import { Wand2 } from 'lucide-react';
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
    const { user } = useAuth(); // Get user from context

    const [editor, setEditor] = useState(null);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // useMemo prevents the option object re-creation
    const editorOptions = useMemo(() => {
        if (!portfolioData || !user?.id) return null; // Wait for user ID

        const initialHtml = buildInitialHtml(portfolioData, templateId);
        const licenseKey = process.env.REACT_APP_GRAPESJS_LICENSE || '';

        return {
            licenseKey: licenseKey,
            project: {
                type: 'web',
                id: `portfolio-${uuidv4()}`,
                default: {
                    pages: [{ name: 'Portfolio', component: initialHtml }],
                },
            },
            identity: {
                id: user.id.toString() // Use actual user ID
            },
            assets: { storageType: 'cloud' },
            storage: { type: 'cloud' }
        };
    }, [portfolioData, templateId, user]);

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

    if (!editorOptions) {
        return <div className="flex items-center justify-center h-screen">Loading Editor...</div>;
    }

    return (
        <div style={{ height: 'calc(100vh - 64px)', marginTop: '64px', position: 'relative' }}>
            <StudioEditor
                options={editorOptions}
                onEditor={(editorInstance) => setEditor(editorInstance)}
            />

            {/* AI Toggle Button - FAB Style */}
            <button
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className="absolute bottom-6 right-6 z-[9999] bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2"
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

