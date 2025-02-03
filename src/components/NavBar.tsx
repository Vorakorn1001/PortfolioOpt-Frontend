'use client';

import Link from 'next/link';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function NavBar() {
    const { data: session } = useSession();

    const handleSignIn = () => {
        const currentUrl = window.location.href;
        const redirectUrl = `/redirect?redirectTo=${encodeURIComponent(currentUrl)}`;
        signIn('google', { callbackUrl: redirectUrl });
    };
    const handleLogOut = () => {
        signOut();
    };
    return (
        <nav className="bg-white text-black py-2">
            {/* Add padding on mobile, remove it on larger screens */}
            <div className="flex items-center justify-between max-w-screen-lg w-full mx-auto px-4 sm:px-0">
                {/* Portfolio Optimizer Logo/Title */}
                <div className="text-xl font-bold flex items-center">
                    Portfolio Optimizer
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-4">
                    {/* Home Button */}
                    <Link
                        href="/"
                        className="text-black font-bold px-3 py-2 hover:underline flex items-center"
                    >
                        Home
                    </Link>

                    {/* Portfolio Button */}
                    <Link
                        href="/portfolio"
                        className="text-black font-bold px-3 py-2 hover:underline flex items-center"
                    >
                        Portfolio
                    </Link>

                    {/* Authentication Buttons */}
                    {session ? (
                        <button
                            type="button"
                            className="bg-black text-white border-white hover:bg-gray-800 px-4 py-3 rounded-full font-bold border-2 flex items-center"
                            onClick={handleLogOut}
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="bg-white text-black border-black hover:bg-gray-200 px-4 py-3 rounded-full font-bold border-2 flex items-center whitespace-nowrap"
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
