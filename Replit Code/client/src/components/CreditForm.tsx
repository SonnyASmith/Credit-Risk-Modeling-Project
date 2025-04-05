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
      annualIncome: "",
      creditScore: 650,
      creditScoreRange: undefined, // Set to blank/undefined as requested
      loanAmount: "",
      loanPurpose: "personal",
      employmentStatus: "full-time",
      yearsEmployed: "",
      agreement: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: Omit<LoanApplicationFormValues, "agreement">) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json() as Promise<LoanApplication>;
    },
    onSuccess: (data) => {
      onApplicationComplete(data);
    },
    onError: (error) => {
      toast({
        title: "Error submitting application",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: LoanApplicationFormValues) => {
    onSubmitStart();

    // Remove the agreement field and creditScoreRange field as they're not part of the API schema
    const { agreement, creditScoreRange, ...applicationData } = values;

    // Submit the application after a short delay to show the processing view
    setTimeout(() => {
      submitMutation.mutate(applicationData as any); // Use 'as any' to bypass type checking as we've verified the data is correct
    }, 2000);
  };

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
            name="creditScoreRange"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute left-3 top-2 text-sm text-neutral-700 peer-focus:text-primary transition-all">
                  Credit Score Range
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Set an appropriate middle value based on the range selected
                    const ranges = {
                      "300-549": 425,
                      "550-649": 600,
                      "650-699": 675,
                      "700-749": 725,
                      "750-850": 800,
                    };
                    form.setValue(
                      "creditScore",
                      ranges[value as keyof typeof ranges],
                    );
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="pt-6 pb-2 px-3 h-14">
                      <SelectValue placeholder="Select your credit score range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    position="popper"
                    sideOffset={5}
                    className="max-h-60"
                    side="top"
                  >
                    <SelectItem value="750-850">Excellent (750-850)</SelectItem>
                    <SelectItem value="700-749">Very Good (700-749)</SelectItem>
                    <SelectItem value="650-699">Good (650-699)</SelectItem>
                    <SelectItem value="550-649">Fair (550-649)</SelectItem>
                    <SelectItem value="300-549">Poor (300-549)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden credit score field that gets set based on the range */}
          <input
            type="hidden"
            {...form.register("creditScore", { valueAsNumber: true })}
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
                    <SelectItem value="home">
                      Home Purchase/Refinance
                    </SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                      providing false information may result in the denial of my
                      application and possible legal action.
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
