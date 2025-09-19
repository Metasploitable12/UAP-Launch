import React from 'react';
import SyncronSecurityAnimation from './components/SyncronSecurityAnimation';

function App() {
  // Analytics hook for tracking user interactions
  const handleAnalytics = (event: string, data?: any) => {
    console.log('Security Animation Event:', event, data);
    // In production, you would send this to your analytics service
    // Example: analytics.track(event, data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <SyncronSecurityAnimation onAnalytics={handleAnalytics} />
      </div>
    </div>
  );
}

export default App;