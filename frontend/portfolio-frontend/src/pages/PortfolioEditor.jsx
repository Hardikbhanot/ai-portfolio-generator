import React from 'react';
import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';

// This is a diagnostic version of the PortfolioEditor component.
// It will display the license key to verify if it's being read from Vercel's environment variables.
function PortfolioEditor() {
    // Read the license key directly from the environment variable.
    const licenseKey = process.env.REACT_APP_GRAPESJS_LICENSE;
    
    // Create a static, hardcoded configuration object for the editor.
    const editorOptions = {
        project: {
            default: {
                pages: [
                    { 
                        name: 'Test Portfolio', 
                        component: `
                            <div>
                                <script src="https://cdn.tailwindcss.com"></script>
                                <h1 class="text-4xl p-8">Editor Test</h1>
                                <p class="p-8">If you can see this, the component is rendering.</p>
                            </div>
                        `
                    }
                ],
            },
        },
        license: licenseKey || '', // Pass the key, or an empty string if it's not found
    };

    return (
        <div style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}>
            {/* --- THIS IS THE DIAGNOSTIC VIEW --- */}
            {/* We will render the key directly to the screen to confirm it's being passed. */}
            <div className="p-4 bg-yellow-200 text-black text-center font-mono">
                <p className="font-bold">Vercel Environment Variable Check:</p>
                <p>REACT_APP_GRAPESJS_LICENSE = '{licenseKey || "NOT FOUND"}'</p>
            </div>

            {/* We only attempt to render the editor if the license key is present */}
            {licenseKey ? (
                <StudioEditor
                    options={editorOptions}
                />
            ) : (
                <div className="p-8 text-center text-red-500">
                    <h2 className="text-2xl font-bold">Editor Disabled</h2>
                    <p>The GrapesJS license key was not found in the environment variables.</p>
                </div>
            )}
        </div>
    );
}

export default PortfolioEditor;

