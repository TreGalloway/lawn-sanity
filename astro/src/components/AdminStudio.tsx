import { useEffect, useState } from 'react';
import { Studio } from 'sanity';
import baseConfig from '../lib/sanity.config';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [studioConfig, setStudioConfig] = useState(baseConfig);

  useEffect(() => {
    setMounted(true);
    
    const token = import.meta.env.SANITY_API_TOKEN;
    if (token) {
      setStudioConfig({ ...baseConfig, token });
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Sanity Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Studio 
        config={studioConfig}
        unstable_noAuthBoundary
      />
    </div>
  );
}
