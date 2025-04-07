import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import ApplicationStepper from "@/components/ApplicationStepper";
import CreditForm from "@/components/CreditForm";
import InfoCard from "@/components/InfoCard";
import SecurityNotice from "@/components/SecurityNotice";
import ProcessingView from "@/components/ProcessingView";
import ResultsView from "@/components/ResultsView";
import { LoanApplication } from "@shared/schema";

type FormStep = "credit-info" | "processing" | "results";

export default function Application() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formStep, setFormStep] = useState<FormStep>("credit-info");
  const [applicationResult, setApplicationResult] = useState<LoanApplication | null>(null);

  const handleApplicationSubmit = (application: LoanApplication) => {
    setApplicationResult(application);
    setCurrentStep(3);
    setFormStep("results");
  };

  const handleSubmitStart = () => {
    setCurrentStep(2);
    setFormStep("processing");
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <AppHeader />
      
      <main className="flex-grow">
        <div className="py-4 md:py-6">
          <ApplicationStepper currentStep={currentStep} />
        </div>
        
        {formStep === "credit-info" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 md:pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-semibold high-contrast-text mb-4 md:mb-6">Applicant Information</h3>
                  <CreditForm 
                    onSubmitStart={handleSubmitStart} 
                    onApplicationComplete={handleApplicationSubmit} 
                  />
                </div>
              </div>
              
              <div className="md:col-span-1 order-first md:order-last mb-4 md:mb-0">
                <div className="md:sticky md:top-6">
                  <InfoCard />
                  <div className="hidden sm:block">
                    <SecurityNotice />
                  </div>
                </div>
              </div>
            </div>
            <div className="block sm:hidden mt-4">
              <SecurityNotice />
            </div>
          </div>
        )}
        
        {formStep === "processing" && (
          <div className="px-4 sm:px-6">
            <ProcessingView />
          </div>
        )}
        
        {formStep === "results" && applicationResult && (
          <div className="px-4 sm:px-6">
            <ResultsView application={applicationResult} />
          </div>
        )}
      </main>
      
      <AppFooter />
    </div>
  );
}
