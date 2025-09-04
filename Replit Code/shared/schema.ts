import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep existing users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Add loan application table with new credit fields
export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  email: text("email"),
  phone: text("phone"),
  annualIncome: integer("annual_income").notNull(),
  loanAmount: integer("loan_amount").notNull(),
  loanPurpose: text("loan_purpose").notNull(),
  employmentStatus: text("employment_status").notNull(),
  yearsEmployed: real("years_employed").notNull(),
  homeOwnership: text("home_ownership"), 
  loanTerm: text("loan_term"),
  
  // New credit fields
  revolvingUtilization: real("revolving_utilization"),
  totalCreditCardLimit: integer("total_credit_card_limit"),
  totalHighCreditLimit: integer("total_high_credit_limit"),
  delinquencies2Years: integer("delinquencies_2_years"),
  inquiries6Months: integer("inquiries_6_months"),
  
  approved: boolean("approved").default(false),
  applicationDate: timestamp("application_date").defaultNow(),
  denialReasons: text("denial_reasons").array(),
  approvedAmount: integer("approved_amount"),
  interestRate: real("interest_rate"),
  termLength: integer("term_length"),
  monthlyPayment: real("monthly_payment"),
});

// IMPORTANT: Make sure we're not omitting the new fields
export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  approved: true,
  applicationDate: true,
  denialReasons: true,
  approvedAmount: true,
  interestRate: true,
  termLength: true,
  monthlyPayment: true,
});

export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;

// Update the form schema to include new fields and values
export const loanApplicationFormSchema = insertLoanApplicationSchema.extend({
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  annualIncome: z.coerce.number().min(10000, "Annual income must be at least $10,000"),
  loanAmount: z.coerce.number().min(1000, "Loan amount must be at least $1,000"),
  
  // Validate loan purpose options
  loanPurpose: z.enum(["debt_consolidation", "credit_card", "education", "business"], {
    errorMap: () => ({ message: "Please select a loan purpose" }),
  }),
  
  // Add home ownership validation
  homeOwnership: z.enum(["rent", "mortgage", "own", "other"], {
    errorMap: () => ({ message: "Please select your home ownership status" }),
  }),
  
  // Add loan term validation
  loanTerm: z.enum(["36", "60"], {
    errorMap: () => ({ message: "Please select a loan term" }),
  }),
  
  employmentStatus: z.enum(["full-time", "part-time", "self-employed", "unemployed", "retired"], {
    errorMap: () => ({ message: "Please select your employment status" }),
  }),
  yearsEmployed: z.coerce.number().min(0, "Years employed cannot be negative"),
  
  // New credit fields validation
  revolvingUtilization: z.coerce.number()
    .min(0, "Revolving utilization cannot be negative")
    .max(100, "Revolving utilization cannot exceed 100%")
    .optional()
    .default(50),
  totalCreditCardLimit: z.coerce.number()
    .min(0, "Credit limit cannot be negative")
    .optional(),
  totalHighCreditLimit: z.coerce.number()
    .min(0, "Credit limit cannot be negative")
    .optional(),
  delinquencies2Years: z.coerce.number()
    .min(0, "Number of delinquencies cannot be negative")
    .int("Must be a whole number")
    .optional()
    .default(0),
  inquiries6Months: z.coerce.number()
    .min(0, "Number of inquiries cannot be negative")
    .int("Must be a whole number")
    .optional()
    .default(0),
  
  agreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
});

export type LoanApplicationFormValues = z.infer<typeof loanApplicationFormSchema>;