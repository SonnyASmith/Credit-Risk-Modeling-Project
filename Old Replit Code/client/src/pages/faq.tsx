import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRightIcon } from "lucide-react";

const faqItems = [
  {
    question: "Will checking if I qualify affect my credit score?",
    answer: "No, our initial qualification process uses a 'soft pull' that doesn't impact your credit score. We only perform a hard credit check if you decide to move forward with a specific loan offer."
  },
  {
    question: "How fast can I receive funds?",
    answer: "After approval, a representative will contact you to discuss the next steps."
  },
  {
    question: "Are there any hidden fees?",
    answer: "No hidden fees. We believe in complete transparency - what you see is what you get. All fees are clearly disclosed before you accept any offer, and there are no prepayment penalties."
  },
  {
    question: "What if I have less-than-perfect credit?",
    answer: "We consider multiple factors beyond just credit scores. Many customers with less-than-perfect credit still qualify. We look at your overall financial situation, income stability, and other factors."
  },
  {
    question: "How are interest rates determined?",
    answer: "Interest rates are personalized based on several factors, including credit history, income, loan amount, and term length. We strive to offer competitive rates for all qualified applicants."
  },
  {
    question: "Can I pay off my loan early?",
    answer: "Absolutely! You can pay off your loan at any time without any prepayment penalties. Early repayment can save you money on interest."
  },
  {
    question: "What happens if I miss a payment?",
    answer: "We understand that financial difficulties can arise. If you anticipate trouble making a payment, please contact us as soon as possible. We offer various assistance options and may be able to adjust your payment schedule."
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Hero section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              Find answers to common questions about our loan application process, 
              qualification requirements, and more.
            </p>
          </div>
          
          {/* FAQ items */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {faqItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                    <p className="text-neutral-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Contact section */}
            <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
              <p className="text-neutral-700 mb-6">
                Our support team is here to help you with any questions you may have.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button variant="outline" size="lg">
                  Contact Support
                </Button>
                <Link href="/application">
                  <Button size="lg">
                    Qualify Now<ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
} 