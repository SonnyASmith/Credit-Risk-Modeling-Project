interface ApplicationStepperProps {
  currentStep: number;
}

export default function ApplicationStepper({ currentStep }: ApplicationStepperProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl font-semibold high-contrast-text mb-4 sm:mb-0">Loan Application</h2>
          
          {/* Desktop Stepper */}
          <div className="hidden sm:block w-auto">
            <div className="flex items-center">
              <div className={`flex items-center ${currentStep > 1 ? 'opacity-50' : ''}`}>
                <div className={`flex items-center justify-center w-8 h-8 ${currentStep === 1 ? 'bg-primary' : 'bg-neutral-300'} text-white rounded-full font-medium`}>
                  1
                </div>
                <div className={`ml-2 text-sm font-medium ${currentStep === 1 ? 'text-primary' : 'text-neutral-700'}`}>Applicant Information</div>
              </div>
              <div className="w-8 sm:w-12 h-0.5 mx-2 bg-neutral-200"></div>
              <div className={`flex items-center ${currentStep !== 2 ? 'opacity-50' : ''}`}>
                <div className={`flex items-center justify-center w-8 h-8 ${currentStep === 2 ? 'bg-primary' : 'bg-neutral-300'} text-white rounded-full font-medium`}>
                  2
                </div>
                <div className={`ml-2 text-sm font-medium ${currentStep === 2 ? 'text-primary' : 'text-neutral-700'}`}>Processing</div>
              </div>
              <div className="w-8 sm:w-12 h-0.5 mx-2 bg-neutral-200"></div>
              <div className={`flex items-center ${currentStep !== 3 ? 'opacity-50' : ''}`}>
                <div className={`flex items-center justify-center w-8 h-8 ${currentStep === 3 ? 'bg-primary' : 'bg-neutral-300'} text-white rounded-full font-medium`}>
                  3
                </div>
                <div className={`ml-2 text-sm font-medium ${currentStep === 3 ? 'text-primary' : 'text-neutral-700'}`}>Results</div>
              </div>
            </div>
          </div>
          
          {/* Mobile Stepper */}
          <div className="sm:hidden w-full">
            <div className="flex justify-between items-center">
              <div className={`flex flex-col items-center ${currentStep > 1 ? 'opacity-50' : ''}`}>
                <div className={`flex items-center justify-center w-8 h-8 ${currentStep === 1 ? 'bg-primary' : 'bg-neutral-300'} text-white rounded-full font-medium mb-1`}>
                  1
                </div>
                <div className={`text-xs font-medium text-center ${currentStep === 1 ? 'text-primary' : 'text-neutral-700'}`}>Info</div>
              </div>
              
              <div className="flex-grow h-0.5 mx-2 bg-neutral-200"></div>
              
              <div className={`flex flex-col items-center ${currentStep !== 2 ? 'opacity-50' : ''}`}>
                <div className={`flex items-center justify-center w-8 h-8 ${currentStep === 2 ? 'bg-primary' : 'bg-neutral-300'} text-white rounded-full font-medium mb-1`}>
                  2
                </div>
                <div className={`text-xs font-medium text-center ${currentStep === 2 ? 'text-primary' : 'text-neutral-700'}`}>Processing</div>
              </div>
              
              <div className="flex-grow h-0.5 mx-2 bg-neutral-200"></div>
              
              <div className={`flex flex-col items-center ${currentStep !== 3 ? 'opacity-50' : ''}`}>
                <div className={`flex items-center justify-center w-8 h-8 ${currentStep === 3 ? 'bg-primary' : 'bg-neutral-300'} text-white rounded-full font-medium mb-1`}>
                  3
                </div>
                <div className={`text-xs font-medium text-center ${currentStep === 3 ? 'text-primary' : 'text-neutral-700'}`}>Results</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
