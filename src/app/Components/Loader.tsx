'use client';

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-1/4 p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default LoadingSpinner;