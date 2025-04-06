import { LoanApplication } from "@shared/schema";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  HelpCircleIcon,
  MailIcon,
  PhoneIcon,
  SaveIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ResultsViewProps {
  application: LoanApplication;
}

function formatPurpose(purpose: string): string {
  const mapping: Record<string, string> = {
    home: "Home Purchase/Refinance",
    auto: "Auto Loan",
    personal: "Personal Loan",
    education: "Education",
    business: "Business",
    other: "Other",
  };
  return mapping[purpose] || purpose;
}

function formatEmploymentStatus(status: string): string {
  const mapping: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    "self-employed": "Self-employed",
    unemployed: "Unemployed",
    retired: "Retired",
  };
  return mapping[status] || status;
}

export default function ResultsView({ application }: ResultsViewProps) {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState(application.email || "");
  const [userPhone, setUserPhone] = useState(application.phone || "");
  const [isSaved, setIsSaved] = useState(false);

  const {
    id,
    loanAmount,
    loanPurpose,
    approved,
    applicationDate,
    denialReasons,
    approvedAmount,
    interestRate,
    termLength,
    monthlyPayment,
  } = application;

  const applicationId = `APP${id.toString().padStart(8, "0")}`;
  // Handle the date appropriately by ensuring we have a valid date object
  const appDate = applicationDate ? new Date(applicationDate) : new Date();
  const formattedDate = formatDate(appDate);

  const handleSaveContact = () => {
    // Here we would normally save the contact information to the backend
    // For now, we'll just show a toast notification
    setIsSaved(true);
    toast({
      title: "Contact information saved",
      description: "We'll use this to send your loan information and updates.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Approved Result Card */}
          {approved && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="border-b border-neutral-200 pb-4 mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">
                      Congratulations! Your loan is approved
                    </h3>
                    <p className="text-neutral-700 text-sm">
                      Application ID: {applicationId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">
                    Loan Details
                  </h4>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-500">
                          Approved Amount
                        </p>
                        <p className="text-lg font-semibold text-neutral-900">
                          {approved
                            ? formatCurrency(approvedAmount || 0)
                            : "[Approved Amount]"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">
                          Interest Rate
                        </p>
                        <p className="text-lg font-semibold text-neutral-900">
                          {approved
                            ? `${interestRate?.toFixed(2)}%`
                            : "[Interest Rate]"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Term Length</p>
                        <p className="text-lg font-semibold text-neutral-900">
                          {approved ? `${termLength} months` : "[Term Length]"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">
                          Monthly Payment
                        </p>
                        <p className="text-lg font-semibold text-neutral-900">
                          {approved
                            ? formatCurrency(monthlyPayment || 0)
                            : "[Monthly Payment]"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">
                    Next Steps
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700">
                    <li>Check your email for official loan documents</li>
                    <li>Review and sign the loan agreement</li>
                    <li>Submit any additional documentation if requested</li>
                    <li>
                      Funds will be disbursed within 2-3 business days after
                      approval
                    </li>
                  </ol>
                </div>

                <div className="pt-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Continue to Documents
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Denied Result Card */}
          {!approved && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="border-b border-neutral-200 pb-4 mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                    <AlertCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">
                      We're sorry, your loan application was not approved
                    </h3>
                    <p className="text-neutral-700 text-sm">
                      Application ID: {applicationId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">
                    Reasons for Denial
                  </h4>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-neutral-700">
                      {denialReasons &&
                        denialReasons.map((reason, index) => (
                          <li key={index} className="flex items-start">
                            <AlertCircleIcon className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">
                    Improving Your Future Applications
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start">
                      <InfoIcon className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>
                        Work on improving your credit score by paying bills on
                        time and reducing outstanding debt
                      </span>
                    </li>
                    <li className="flex items-start">
                      <InfoIcon className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>
                        Reduce your debt-to-income ratio by increasing income or
                        paying down existing debt
                      </span>
                    </li>
                    <li className="flex items-start">
                      <InfoIcon className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span>Consider applying for a smaller loan amount</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    Learn About Credit Improvement
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">
                    Explore Other Options
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-6">
            {/* Application Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Application Summary
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500">
                    Loan Amount Requested
                  </p>
                  <p className="text-sm font-medium text-neutral-900">
                    {formatCurrency(loanAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Loan Purpose</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {formatPurpose(loanPurpose)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Application Date</p>
                  <p className="text-sm font-medium text-neutral-900">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <MailIcon className="h-4 w-4 text-primary mr-2" />
                <h3 className="text-sm font-semibold text-neutral-900">
                  Contact Information
                </h3>
              </div>
              <p className="text-sm text-neutral-700 mb-4">
                Provide your contact information to receive loan documents and
                updates.
              </p>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-neutral-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1"
                    placeholder="Your Full Name"
                    disabled={isSaved}
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-neutral-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1"
                    placeholder="your.email@example.com"
                    disabled={isSaved}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-neutral-700"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="mt-1"
                    placeholder="(123) 456-7890"
                    disabled={isSaved}
                  />
                </div>

                <Button
                  onClick={handleSaveContact}
                  disabled={isSaved || !userName || (!userEmail && !userPhone)}
                  className="w-full mt-2 px-6 py-2 flex items-center justify-start"
                >
                  <div className="flex items-center mr-1">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {isSaved ? "Information Saved" : "Save Information"}
                  </div>
                </Button>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-neutral-100 rounded-lg p-6 border border-neutral-200">
              <div className="flex items-center mb-4">
                <HelpCircleIcon className="h-4 w-4 text-primary mr-2" />
                <h3 className="text-sm font-semibold text-neutral-900">
                  Need Help?
                </h3>
              </div>
              <p className="text-sm text-neutral-700 mb-4">
                If you have questions about your application or need assistance,
                our team is here to help.
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:support@loanapproval.com"
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  <MailIcon className="h-3 w-3 mr-1" />
                  <span>support@loanapproval.com</span>
                </a>
                <a
                  href="tel:18005556786"
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  <PhoneIcon className="h-3 w-3 mr-1" />
                  <span>1-800-555-LOAN</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
