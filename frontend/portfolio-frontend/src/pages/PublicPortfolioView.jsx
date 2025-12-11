import React, { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig';

const PublicPortfolioView = ({ subdomain }) => {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                // Determine API base URL dynamically or use environment variable
                // Ideally apiClient is configured with the base API URL.
                // We are fetching from the PUBLIC endpoint.
                const response = await apiClient.get(`/api/public/portfolio/${subdomain}`);
                setPortfolio(response.data);
            } catch (err) {
                console.error("Failed to fetch portfolio:", err);
                setError("Portfolio not found or private.");
            } finally {
                setLoading(false);
            }
        };

        if (subdomain) {
            fetchPortfolio();
        }
    }, [subdomain]);

    if (loading) return <div className="flex h-screen items-center justify-center text-white bg-gray-900">Loading Portfolio...</div>;
    if (error) return <div className="flex h-screen items-center justify-center text-red-400 bg-gray-900">{error}</div>;
    if (!portfolio) return null;

    return (
        <div className="w-full h-screen bg-white">
            <style dangerouslySetInnerHTML={{ __html: portfolio.css }} />
            <div dangerouslySetInnerHTML={{ __html: portfolio.html }} />
        </div>
    );
};

export default PublicPortfolioView;
