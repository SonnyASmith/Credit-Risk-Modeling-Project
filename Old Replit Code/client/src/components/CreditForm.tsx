import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoanApplicationFormValues,
  loanApplicationFormSchema,
  LoanApplication,
} from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircleIcon } from "lucide-react";

interface CreditFormProps {
  onSubmitStart: () => void;
  onApplicationComplete: (application: LoanApplication) => void;
}

export default function CreditForm({
  onSubmitStart,
  onApplicationComplete,
}: CreditFormProps) {
  const { toast } = useToast();

  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationFormSchema),
    defaultValues: {
      annualIncome: 0,
      loanAmount: 0,
      loanPurpose: "debt_consolidation",
      employmentStatus: "full-time",
      yearsEmployed: 0,
      agreement: false,
      homeOwnership: "rent",
      loanTerm: "60",
      revolvingUtilization: 50,
      totalCreditCardLimit: 0,
      totalHighCreditLimit: 0,
      delinquencies2Years: 0,
      inquiries6Months: 0,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: Omit<LoanApplicationFormValues, "agreement">) => {
      // Log the data being sent to API
      console.log("Submitting application data:", data);
      
      // Map loan purpose values to what the model expects
      const mappedData = {
        ...data,
        // Map front-end purposes to back-end purposes
        loanPurpose: mapLoanPurpose(data.loanPurpose),
      };
      
      console.log("Mapped application data:", mappedData);
      
      const response = await apiRequest("POST", "/api/applications", mappedData);
      return response.json() as Promise<LoanApplication>;
    },
    onSuccess: (data) => {
      console.log("Application completed successfully:", data);
      onApplicationComplete(data);
    },
    onError: (error) => {
      console.error("Application submission error:", error);
      toast({
        title: "Error submitting application",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Map frontend loan purpose values to what the model expects
  const mapLoanPurpose = (purpose: string): string => {
    const purposeMap: Record<string, string> = {
      "credit_card": "credit_card",
      "debt_consolidation": "debt_consolidation",
      "business": "small_business",
      "education": "educational"
    };
    return purposeMap[purpose] || purpose;
  };

  const onSubmit = (values: LoanApplicationFormValues) => {
    onSubmitStart();

    // Remove the agreement field as it's not part of the API schema
    const { agreement, ...applicationData } = values;

    // Submit the application after a short delay to show the processing view
    setTimeout(() => {
      submitMutation.mutate(applicationData as any);
    }, 2000);
  };

  // Helper component for field with tooltip
  const FieldWithTooltip = ({ label, tooltip, children }: { label: string, tooltip: string, children: React.ReactNode }) => (
    <div className="flex items-center space-x-2">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircleIcon className="h-4 w-4 text-neutral-500" />
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {children}
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Applicant Information */}
          <div className="md:col-span-2 pt-2">
            <h4 className="text-sm font-medium text-neutral-900 mb-3">
              Credit Information
            </h4>
          </div>

          <FormField
            control={form.control}
            name="annualIncome"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Annual Income ($)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="pt-6 pb-2 px-3 h-14"
                    placeholder="Enter annual income"
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="homeOwnership"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Home Ownership
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="pt-6 pb-2 px-3 h-14">
                      <SelectValue placeholder="Select home ownership" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    sideOffset={5}
                    className="max-h-60"
                    side="top"
                  >
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="own">Own</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Requested Loan Amount ($)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="pt-6 pb-2 px-3 h-14"
                    placeholder="Enter loan amount"
                    min={1000}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanPurpose"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Loan Purpose
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="pt-6 pb-2 px-3 h-14">
                      <SelectValue placeholder="Select loan purpose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    sideOffset={5}
                    className="max-h-60"
                    side="top"
                  >
                    <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                    <SelectItem value="credit_card">Credit Card Refinancing</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="business">Small Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanTerm"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Loan Term
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="pt-6 pb-2 px-3 h-14">
                      <SelectValue placeholder="Select loan term" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    sideOffset={5}
                    className="max-h-60"
                    side="top"
                  >
                    <SelectItem value="36">36 months (3 years)</SelectItem>
                    <SelectItem value="60">60 months (5 years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2 pt-2">
            <h4 className="text-sm font-medium text-neutral-900 mb-3">
              Employment Status
            </h4>
          </div>

          <FormField
            control={form.control}
            name="employmentStatus"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Employment Status
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="pt-6 pb-2 px-3 h-14">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    sideOffset={5}
                    className="max-h-60"
                    side="top"
                  >
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsEmployed"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Years at Current Job
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="pt-6 pb-2 px-3 h-14"
                    placeholder="Enter years employed"
                    min={0}
                    step={0.1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Advanced Credit Information - Now displayed directly without accordion */}
          <div className="md:col-span-2 pt-2">
            <h4 className="text-sm font-medium text-neutral-900 mb-3">
              Advanced Credit Information (Required)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-3">
              {/* New Credit Fields */}
              
              <FormField
                control={form.control}
                name="revolvingUtilization"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                      Revolving Utilization (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="pt-6 pb-2 px-3 h-14"
                        placeholder="Enter revolving utilization"
                        min={0}
                        max={100}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Percentage of all available credit being used
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalCreditCardLimit"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                      Total Credit Card Limit ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="pt-6 pb-2 px-3 h-14"
                        placeholder="Enter total credit limit"
                        min={0}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Total bankcard limit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalHighCreditLimit"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                      Total High Credit Limit ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="pt-6 pb-2 px-3 h-14"
                        placeholder="Enter high credit limit"
                        min={0}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Highest total credit limit across all credit lines
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delinquencies2Years"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                      Delinquencies (Past 2 Years)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="pt-6 pb-2 px-3 h-14"
                        placeholder="Enter number of delinquencies"
                        min={0}
                        step={1}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Number of 30+ days past-due incidences in the past 2 years
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inquiries6Months"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                      Inquiries (Past 6 Months)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="pt-6 pb-2 px-3 h-14"
                        placeholder="Enter number of inquiries"
                        min={0}
                        step={1}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Number of credit inquiries in the past 6 months
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Agreement Section */}
          <div className="md:col-span-2 mt-4">
            <FormField
              control={form.control}
              name="agreement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-neutral-700">
                      I authorize a credit check and confirm that the
                      information provided is accurate. I understand that
                      this submission will not affect my credit score.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90"
            disabled={submitMutation.isPending}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
}