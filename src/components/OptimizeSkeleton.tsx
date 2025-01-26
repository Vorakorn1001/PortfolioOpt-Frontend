import React from 'react';

const OptimizeSkeleton: React.FC = () => {
    const skeletonBar = 'bg-gray-300 rounded h-4 animate-pulse';
    const skeletonCircle = 'bg-gray-300 rounded-full h-20 w-20 animate-pulse';

    return (
        <div className="bg-gray-100 min-h-screen w-full text-black">
            <div className="w-full max-w-screen-lg mx-auto bg-white min-h-screen p-6">
                {/* Grid Section */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Asset Proportion Skeleton */}
                    <div className="p-4 bg-gray-200 rounded-2xl shadow animate-pulse">
                        <div className="h-6 w-1/3 bg-gray-300 rounded mb-4"></div>
                        <div className="flex justify-center items-center">
                            <div className="h-48 w-48 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    {/* Diversification Skeleton */}
                    <div className="bg-gray-200 shadow p-4 rounded animate-pulse">
                        <div className="h-6 mb-4 bg-gray-300 rounded"></div>
                        <div className="h-64 bg-gray-300 rounded"></div>
                    </div>
                </div>

                {/* Mean-Variance Analysis Skeleton */}
                <div className="py-4">
                    <div className="bg-gray-200 shadow p-4 rounded">
                        <div className="h-6 mb-4 bg-gray-300 rounded"></div>
                        <div className="h-64 bg-gray-300 rounded"></div>
                    </div>
                </div>

                {/* Metrics Section */}
                <div className="py-4">
                    <div className="bg-gray-200 shadow p-4 rounded">
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
                <div className="py-4">
                    <div className="bg-gray-200 shadow p-4 rounded">
                        <div className="h-6 mb-4 bg-gray-300 rounded"></div>
                        <div className="h-64 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizeSkeleton;
