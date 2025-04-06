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

// Add loan application table
export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  email: text("email"),
  phone: text("phone"),
  annualIncome: integer("annual_income").notNull(),
  creditScore: integer("credit_score").notNull(),
  loanAmount: integer("loan_amount").notNull(),
  loanPurpose: text("loan_purpose").notNull(),
  employmentStatus: text("employment_status").notNull(),
  yearsEmployed: real("years_employed").notNull(),
  approved: boolean("approved").default(false),
  applicationDate: timestamp("application_date").defaultNow(),
  denialReasons: text("denial_reasons").array(),
  approvedAmount: integer("approved_amount"),
  interestRate: real("interest_rate"),
  termLength: integer("term_length"),
  monthlyPayment: real("monthly_payment"),
});

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

// Extend the loan application schema for form validation
export const loanApplicationFormSchema = insertLoanApplicationSchema.extend({
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  annualIncome: z.coerce.number().min(10000, "Annual income must be at least $10,000"),
  creditScoreRange: z.enum(["300-549", "550-649", "650-699", "700-749", "750-850"], {
    errorMap: () => ({ message: "Please select a credit score range" }),
  }).optional(),
  creditScore: z.coerce.number().min(300, "Credit score must be between 300 and 850").max(850, "Credit score must be between 300 and 850"),
  loanAmount: z.coerce.number().min(1000, "Loan amount must be at least $1,000"),
  loanPurpose: z.enum(["home", "auto", "personal", "education", "business", "other"], {
    errorMap: () => ({ message: "Please select a loan purpose" }),
  }),
  employmentStatus: z.enum(["full-time", "part-time", "self-employed", "unemployed", "retired"], {
    errorMap: () => ({ message: "Please select your employment status" }),
  }),
  yearsEmployed: z.coerce.number().min(0, "Years employed cannot be negative"),
  agreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
});

export type LoanApplicationFormValues = z.infer<typeof loanApplicationFormSchema>;
