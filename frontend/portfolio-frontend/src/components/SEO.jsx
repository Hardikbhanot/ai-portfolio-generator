import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'Lopsie | AI Portfolio Generator';
    const defaultDescription = 'Create a stunning, professional portfolio from your resume in seconds with AI.';
    const defaultImage = '%PUBLIC_URL%/og-image.png'; // Make sure this exists in public/
    const siteUrl = 'https://portfolio-generator.hbhanot.tech';

    return (
        <Helmet>
            {/* Basic SEO */}
            <title>{title ? `${title} | Lopsie` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || "AI portfolio, resume to website, portfolio generator, lopsie"} />
            <link rel="canonical" href={url || siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={url || siteUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
};

export default SEO;
