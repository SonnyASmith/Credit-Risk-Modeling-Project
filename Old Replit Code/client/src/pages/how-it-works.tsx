import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon, CheckCircleIcon, ClipboardCheckIcon, CreditCardIcon, BarChart4Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const steps = [
  {
    icon: <ClipboardCheckIcon className="h-12 w-12 text-primary" />,
    title: "1. Complete Our Simple Form",
    description: "Fill out our easy application form with basic information about yourself and your financial needs. This takes less than 5 minutes."
  },
  {
    icon: <BarChart4Icon className="h-12 w-12 text-primary" />,
    title: "2. Get Instant Evaluation",
    description: "Our system quickly analyzes your information and determines if you qualify for a loan. No waiting for days to hear back."
  },
  {
    icon: <CheckCircleIcon className="h-12 w-12 text-primary" />,
    title: "3. Review Your Offers",
    description: "If approved, you'll immediately see loan options with clear terms, rates, and payment schedules tailored to your situation."
  },
  {
    icon: <CreditCardIcon className="h-12 w-12 text-primary" />,
    title: "4. Connect With A Representative",
    description: "After accepting an offer, a representative will contact you to discuss the next steps."
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Hero section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How Own Your Day Works</h1>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              We've made getting financial support simple, transparent, and fast. 
              See how easy it is to take control of your financial future.
            </p>
          </div>
          
          {/* Process cards */}
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              {steps.map((step, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="mb-4">
                        {step.icon}
                      </div>
                      <h2 className="text-xl font-semibold mb-3">{step.title}</h2>
                      <p className="text-neutral-600">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Call to action */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
              <p className="text-neutral-700 mb-6">
                It only takes a few minutes to check if you qualify, with no impact on your credit score.
              </p>
              <Link href="/application">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Qualify Now <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
} 