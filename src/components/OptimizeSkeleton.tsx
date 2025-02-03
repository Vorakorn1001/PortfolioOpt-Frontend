import React from 'react';

const OptimizeSkeleton: React.FC = () => {
    const skeletonBar = 'bg-gray-300 rounded h-4 animate-pulse';

    return (
        <div className="bg-gray-100 min-h-screen w-full text-black">
            <div className="px-4 sm:px-0">
                <div className="w-full max-w-screen-lg mx-auto bg-transparent min-h-screen">
                    <div className="py-2" />

                    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                        {/* Asset Proportion Skeleton */}
                        <div className="order-1 md:order-1 md:col-span-1 p-4 bg-gray-200 rounded-2xl shadow animate-pulse">
                            <div className="h-6 w-full bg-gray-300 rounded mb-4"></div>
                            <div className="flex justify-center items-center">
                                <div className="h-80 w-80 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>

                        {/* Diversification Skeleton */}
                        <div className="order-3 md:order-2 md:col-span-1 bg-gray-200 shadow p-4 rounded animate-pulse">
                            <div className="h-6 mb-4 bg-gray-300 rounded"></div>
                            <div className="h-64 bg-gray-300 rounded"></div>
                        </div>

                        {/* Mean-Variance Analysis Skeleton */}
                        <div className="order-2 md:order-3 md:col-span-2 py-4">
                            <div className="bg-gray-200 shadow p-4 rounded">
                                <div className="h-6 w-1/3 mb-4 bg-gray-300 rounded"></div>
                                <div className="h-64 bg-gray-300 rounded"></div>
                            </div>
                        </div>

                        {/* Key Metrics Skeleton */}
                        <div className="order-4 md:order-4 md:col-span-2 py-4">
                            <div className="bg-gray-200 shadow p-4 rounded">
                                <div className="h-6 w-1/3 mb-4 bg-gray-300 rounded"></div>
                                <div className="h-6 mb-4 bg-gray-300 rounded"></div>
                                <div className="grid grid-cols-6 gap-4">
                                    {[...Array(6)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="text-center flex flex-col items-center"
                                        >
                                            <div
                                                className={`h-4 w-12 ${skeletonBar}`}
                                            ></div>
                                            <div
                                                className={`h-6 w-16 mt-2 ${skeletonBar}`}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Historical Performance Skeleton */}
                        <div className="order-5 md:order-5 md:col-span-2 py-4">
                            <div className="bg-gray-200 shadow p-4 rounded">
                                <div className="h-6 w-1/3 mb-4 bg-gray-300 rounded"></div>
                                <div className="h-6 mb-4 bg-gray-300 rounded"></div>
                                <div className="h-64 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizeSkeleton;
