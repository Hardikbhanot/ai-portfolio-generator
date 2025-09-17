import React from 'react';
import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';

// This is a minimal, definitive test component. It removes all React hooks
// and dynamic data to isolate the GrapesJS Studio initialization.
function PortfolioEditor() {
    // 1. Read the license key directly. We know this part works from your console logs.
    const licenseKey = process.env.REACT_APP_GRAPESJS_LICENSE;

    // --- NEW DIAGNOSTIC STEP ---
    // 2. Log the exact domain the browser is currently on.
    // This is the value you MUST use in your GrapesJS Studio license settings.
    const currentDomain = window.location.hostname;
    console.log("DEBUG: The current browser domain is:", `'${currentDomain}'`);


    // 3. Log the key one last time to be certain.
    console.log("FINAL TEST: Attempting to render Studio Editor with license:", `'${licenseKey}'`);

    // 4. Create a static, hardcoded configuration object.
    const editorOptions = {
        project: {
            default: {
                pages: [
                    { 
                        name: 'Test Page', 
                        component: `
                            <div style="padding: 2rem; font-family: sans-serif;">
                                <h1 style="font-size: 2rem; font-weight: bold;">Editor Initialized</h1>
                                <p>If you see this, the license key and domain are correct.</p>
                            </div>
                        `
                    }
                ],
            },
        },
        license: licenseKey || '', // Pass the key, or a fallback empty string.
    };

    // 5. Directly return the component with the static options.
    return (
        <div style={{ height: 'calc(100vh - 64px)', marginTop: '64px' }}>
            {/* We render the editor unconditionally to test its core functionality. */}
            <StudioEditor
                options={editorOptions}
            />
        </div>
    );
}

export default PortfolioEditor;

