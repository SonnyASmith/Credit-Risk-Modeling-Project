import { HourglassIcon } from "lucide-react";

export default function ProcessingView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <HourglassIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-3">Processing Your Application</h3>
        <p className="text-neutral-700 mb-6">
          We're evaluating your credit information and determining your loan eligibility. This should only take a moment.
        </p>
        
        <div className="w-full bg-neutral-100 rounded-full h-2.5 mb-6 max-w-md mx-auto">
          <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
        
        <div className="text-sm text-neutral-500">
          Please do not refresh or close this page
        </div>
      </div>
    </div>
  );
}
