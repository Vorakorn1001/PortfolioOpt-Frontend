'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import PortfolioData from '@/interfaces/portfolio.interface';
import axios from 'axios';

const signInURL = process.env.NEXT_PUBLIC_BACKEND_URL + '/user/signIn';

function createEmptyPortfolioData(): PortfolioData {
    return {
        activePortfolio: 'Portfolio',
        portfolios: {
            Portfolio: {
                assets: [],
                investorViews: [],
            },
        },
    };
}

export default function RedirectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const hasRedirected = useRef(false); // Track if redirection has already happened

    useEffect(() => {
        if (status !== 'authenticated') return; // Wait until the user is authenticated
        if (hasRedirected.current) return; // Prevent executing the redirection logic twice
        hasRedirected.current = true; // Mark as executed

        var savedPortfolioData = JSON.parse(
            localStorage.getItem('portfolioData') || 'null'
        );

        if (!savedPortfolioData) {
            savedPortfolioData = createEmptyPortfolioData();
        }

        const fetchData = async () => {
            const activePortfolio = savedPortfolioData.activePortfolio;
            const userData = {
                name: session.user?.name,
                email: session.user?.email,
                image: session.user?.image,
                activePortfolio: activePortfolio,
            };
              
            const payload = { user: userData, portfolio: savedPortfolioData };
            const response = await axios.post(signInURL, payload);
            if (response.status === 200) {
                localStorage.setItem(
                    'portfolioData',
                    JSON.stringify(response.data)
                );
                console.log(response.data)
            }
        };

        fetchData();
    }, [session]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirectTo');
        if (redirectTo) {
            router.push(decodeURIComponent(redirectTo));
        } else {
            router.push('/'); // Default to home if no redirect URL is provided
        }
    }, [router]);

    return <div>Redirecting...</div>; // Add a message or spinner
}
