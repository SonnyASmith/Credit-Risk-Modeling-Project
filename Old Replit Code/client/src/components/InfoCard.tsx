export default function InfoCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">How It Works</h3>
      <div className="space-y-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-neutral-900">Submit Information</h4>
            <p className="mt-1 text-sm text-neutral-700">Fill out the form with your personal and credit details.</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-neutral-900">Analysis</h4>
            <p className="mt-1 text-sm text-neutral-700">Our system evaluates your application based on multiple factors.</p>
          </div>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </span>
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-neutral-900">Get Results</h4>
            <p className="mt-1 text-sm text-neutral-700">Receive an instant decision on your loan application.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
