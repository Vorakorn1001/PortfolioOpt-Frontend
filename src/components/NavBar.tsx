'use client';

import Link from 'next/link';
import StockData from '@/interfaces/stock.interface';
import PortfolioData from '@/interfaces/portfolio.interface';
import React, { useEffect, useState, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Portfolio from '@/app/optimize/page';
import { redirect } from 'next/dist/server/api-utils';

export default function NavBar() {
    const { data: session, status } = useSession();

    const handleSignIn = () => {
        const currentUrl = window.location.href;
        const redirectUrl = `/redirect?redirectTo=${encodeURIComponent(currentUrl)}`;
        signIn('google', { callbackUrl: redirectUrl });
    };
    const handleLogOut = () => {
        // const currentUrl = window.location.href;
        // const redirectUrl = `/redirect?redirectTo=${encodeURIComponent(currentUrl)}`;
        // signOut({ callbackUrl: redirectUrl });
        signOut();
    };
    return (
        <nav className="bg-gray-800 text-white py-4">
            <div className="flex items-center justify-between max-w-screen-lg w-full mx-auto">
                {/* Portfolio Optimizer Logo/Title */}
                <div className="text-xl font-bold ml-0">
                    Portfolio Optimizer
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-6 mr-0">
                    {/* Home Button */}
                    <Link
                        href="/"
                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Home
                    </Link>

                    {/* Portfolio Button */}
                    <Link
                        href="/portfolio"
                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Portfolio
                    </Link>

                    {/* Authentication Buttons */}
                    {session ? (
                        <button
                            type="button"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
                            onClick={handleLogOut}
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
                            onClick={handleSignIn}
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
