import { 
  users, type User, type InsertUser,
  loanApplications, type LoanApplication, type InsertLoanApplication
} from "@shared/schema";
import { RiskModel } from "./log_reg";

// Initialize the risk model
const riskModel = new RiskModel();

// Extend IStorage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Loan application methods
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: number): Promise<LoanApplication | undefined>;
  getAllLoanApplications(): Promise<LoanApplication[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private loanApplications: Map<number, LoanApplication>;
  userCurrentId: number;
  loanApplicationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.loanApplications = new Map();
    this.userCurrentId = 1;
    this.loanApplicationCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Loan application methods
  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const id = this.loanApplicationCurrentId++;
    const applicationDate = new Date();
    
    // Extract application data for evaluation
    const annualIncome = insertApplication.annualIncome;
    const loanAmount = insertApplication.loanAmount;
    const employmentStatus = insertApplication.employmentStatus;
    const yearsEmployed = insertApplication.yearsEmployed;
    const loanPurpose = insertApplication.loanPurpose;
    
    let approved = false;
    let denialReasons: string[] = [];
    let approvedAmount = null;
    let interestRate = null;
    let termLength = null;
    let monthlyPayment = null;

    // Use risk model for evaluation if it's loaded successfully
    if (riskModel.isModelLoaded()) {
      try {
        // Create feature vector required by the model
        // These features need to match the order expected by the model
        const features = prepareFeatureVector(insertApplication);
        
        // Get default probability from the model
        const defaultProbability = riskModel.predictDefaultProbability(features);
        
        // Determine approval based on model threshold
        approved = riskModel.isApplicationApproved(defaultProbability);
        
        if (approved) {
          // Set approved loan details
          approvedAmount = loanAmount;
          
          // Calculate interest rate based on default probability
          // Higher risk = higher interest rate
          // Using 4 discrete risk tiers for approved applications
          const maxProbability = 0.4; // Approval threshold
          
          // Assign interest rate based on risk tiers
          if (defaultProbability <= 0.1) {
            // Tier 1 (lowest risk): 5%
            interestRate = 5.0;
          } else if (defaultProbability <= 0.2) {
            // Tier 2: 10%
            interestRate = 10.0;
          } else if (defaultProbability <= 0.3) {
            // Tier 3: 15%
            interestRate = 15.0;
          } else {
            // Tier 4 (highest risk but still approved): 20%
            interestRate = 20.0;
          }
          
          // Default term length (60 months/5 years)
          termLength = 60;
          
          // Calculate monthly payment
          const monthlyRate = interestRate / 100 / 12;
          monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termLength));
          monthlyPayment = Math.round(monthlyPayment * 100) / 100; // Round to 2 decimal places
        } else {
          // Set denial reasons based on risk factors
          if (defaultProbability > 0.7) {
            denialReasons.push("Overall risk profile exceeds our lending guidelines");
          } else {
            // Add specific denial reasons
            const debtToIncomeRatio = loanAmount / annualIncome;
            
            // Calculate PTI (payment to income ratio)
            const monthlyIncome = annualIncome / 12;
            const estimatedInterestRate = 10; // Default estimation for risk calculation
            const estimatedTermLength = 60; // Default 5-year term
            const monthlyRate = estimatedInterestRate / 100 / 12;
            const estimatedMonthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -estimatedTermLength));
            const paymentToIncomeRatio = estimatedMonthlyPayment / monthlyIncome;
            
            // Check DTI
            if (debtToIncomeRatio > 0.43) {
              denialReasons.push("Debt-to-income ratio exceeds our lending guidelines");
            }
            
            // Check PTI
            if (paymentToIncomeRatio > 0.43) {
              denialReasons.push("Payment-to-income ratio exceeds our lending guidelines");
            }
            
            if (employmentStatus === "unemployed") {
              denialReasons.push("Current employment status does not meet our criteria");
            }
            
            if (yearsEmployed < 1 && employmentStatus !== "unemployed" && employmentStatus !== "retired") {
              denialReasons.push("Insufficient employment history");
            }
            
            // If no specific reasons are found, add a generic one
            if (denialReasons.length === 0) {
              denialReasons.push("Application does not meet our current lending criteria");
            }
          }
        }
      } catch (error) {
        console.error("Error using risk model:", error);
        // Fall back to basic scoring if risk model fails
        approved = useBasicCreditScoring(insertApplication, denialReasons);
        
        if (approved) {
          approvedAmount = loanAmount;
          interestRate = calculateBasicInterestRate(yearsEmployed);
          termLength = 60;
          const monthlyRate = interestRate / 100 / 12;
          monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termLength));
        }
      }
    } else {
      // Fall back to basic scoring if risk model is not loaded
      approved = useBasicCreditScoring(insertApplication, denialReasons);
      
      if (approved) {
        approvedAmount = loanAmount;
        interestRate = calculateBasicInterestRate(yearsEmployed);
        termLength = 60;
        const monthlyRate = interestRate / 100 / 12;
        monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termLength));
      }
    }

    // Ensure required fields are properly typed
    const homeOwnership = insertApplication.homeOwnership || null;
    const loanTerm = insertApplication.loanTerm || null;
    
    // Create a new application object with explicit typing
    const application: LoanApplication = {
      id,
      applicationDate, 
      approved,
      denialReasons: denialReasons,
      approvedAmount,
      interestRate,
      termLength,
      monthlyPayment,
      email: insertApplication.email || null,
      phone: insertApplication.phone || null,
      annualIncome: insertApplication.annualIncome,
      loanAmount: insertApplication.loanAmount,
      loanPurpose: insertApplication.loanPurpose,
      employmentStatus: insertApplication.employmentStatus,
      yearsEmployed: insertApplication.yearsEmployed,
      homeOwnership: homeOwnership,
      loanTerm: loanTerm,
      revolvingUtilization: insertApplication.revolvingUtilization || null,
      totalCreditCardLimit: insertApplication.totalCreditCardLimit || null,
      totalHighCreditLimit: insertApplication.totalHighCreditLimit || null,
      delinquencies2Years: insertApplication.delinquencies2Years || null,
      inquiries6Months: insertApplication.inquiries6Months || null
    };
    
    this.loanApplications.set(id, application);
    return application;
  }

  async getLoanApplication(id: number): Promise<LoanApplication | undefined> {
    return this.loanApplications.get(id);
  }

  async getAllLoanApplications(): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values());
  }
}

/**
 * Prepare a feature vector for the risk model based on loan application data
 * @param application Loan application data
 * @returns Array of feature values in the order expected by the model
 */
function prepareFeatureVector(application: InsertLoanApplication): number[] {
  // Get feature names from the model
  const featureNames = riskModel.getFeatureNames();
  
  // Create a mapping of feature values
  const featureMap: Record<string, number> = {};
  
  // Extract and transform application data into features
  const {
    annualIncome,
    loanAmount,
    employmentStatus,
    yearsEmployed,
    loanPurpose,
    homeOwnership,
    loanTerm,
    // Access new fields directly from the application
    // Use nullish coalescing for safe access with defaults
    revolvingUtilization,
    totalCreditCardLimit,
    totalHighCreditLimit,
    delinquencies2Years,
    inquiries6Months
  } = application;
  
  // Calculate monthly income from annual income
  const monthlyIncome = annualIncome / 12;
  
  // Calculate estimated monthly payment using amortization formula
  // Default to 60 months term and 10% interest rate for estimation
  const estimatedInterestRate = 10; // Default estimation for risk calculation
  const estimatedTermLength = 60; // Default 5-year term
  const monthlyRate = estimatedInterestRate / 100 / 12;
  const estimatedMonthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -estimatedTermLength));
  
  // Calculate derived features
  featureMap["99pti"] = estimatedMonthlyPayment / monthlyIncome * 100;  // Payment to income (using monthly payment)
  featureMap["99dti"] = loanAmount / annualIncome * 100;  // Debt to income (keep as is)
  featureMap["log_annual_inc"] = Math.log(annualIncome);
  featureMap["boxcox_loan_amnt"] = Math.log(loanAmount);
  
  // Use actual values from form when available instead of defaults
  featureMap["revol_util"] = revolvingUtilization ?? 50; 
  
  // Apply log transformation to credit limits if they're provided (avoid log(0))
  featureMap["boxcox_total_bc_limit"] = (totalCreditCardLimit && totalCreditCardLimit > 0)
    ? Math.log(totalCreditCardLimit) 
    : 8; // Default log value
    
  featureMap["boxcox_tot_hi_cred_lim"] = (totalHighCreditLimit && totalHighCreditLimit > 0)
    ? Math.log(totalHighCreditLimit) 
    : 10; // Default log value
  
  // Convert employment duration to Weight of Evidence value (simplified)
  featureMap["emp_length_woe"] = yearsEmployed < 1 ? -0.5 : 
                               yearsEmployed < 3 ? 0 : 
                               yearsEmployed < 5 ? 0.2 : 0.4;
  
  // Use actual delinquency and inquiry values instead of defaults
  // Map to WOE values
  featureMap["delinq_2yrs_woe"] = mapDelinquenciesToWoe(delinquencies2Years ?? 0);
  featureMap["inq_last_6mths_woe"] = mapInquiriesToWoe(inquiries6Months ?? 0);
  
  // Binary features for loan term
  featureMap["term_60"] = loanTerm === "60" ? 1 : 0;
  
  // Home ownership binary features - map from frontend values to model values
  featureMap["home_ownership_RENT"] = homeOwnership === "rent" ? 1 : 0;
  featureMap["home_ownership_MORTGAGE"] = homeOwnership === "mortgage" ? 1 : 0;
  
  // Loan purpose binary features
  featureMap["purpose_debt_consolidation"] = loanPurpose === "debt_consolidation" ? 1 : 0;
  featureMap["purpose_credit_card"] = loanPurpose === "credit_card" ? 1 : 0;
  featureMap["purpose_small_business"] = loanPurpose === "business" || loanPurpose === "small_business" ? 1 : 0;
  featureMap["purpose_educational"] = loanPurpose === "education" || loanPurpose === "educational" ? 1 : 0;
  
  // Build the feature vector in the order expected by the model
  return featureNames.map(name => featureMap[name] || 0);
}

/**
 * Map delinquencies count to Weight of Evidence (WOE) value
 * Higher number of delinquencies should have more negative WOE
 */
function mapDelinquenciesToWoe(delinquencies: number): number {
  if (delinquencies === 0) return 0.5;
  if (delinquencies === 1) return 0;
  if (delinquencies === 2) return -0.3;
  if (delinquencies <= 4) return -0.6;
  return -1.2; // 5+ delinquencies
}

/**
 * Map inquiries count to Weight of Evidence (WOE) value
 * Higher number of inquiries should have more negative WOE
 */
function mapInquiriesToWoe(inquiries: number): number {
  if (inquiries === 0) return 0.4;
  if (inquiries === 1) return 0;
  if (inquiries === 2) return -0.3;
  if (inquiries <= 4) return -0.5;
  return -0.8; // 5+ inquiries
}

/**
 * Basic credit scoring algorithm as fallback
 * @param application Loan application
 * @param denialReasons Array to populate with denial reasons
 * @returns True if approved, false otherwise
 */
function useBasicCreditScoring(application: InsertLoanApplication, denialReasons: string[]): boolean {
  const {
    annualIncome,
    loanAmount,
    employmentStatus,
    yearsEmployed
  } = application;
  
  const debtToIncomeRatio = loanAmount / annualIncome;
  
  // Calculate PTI (payment to income ratio)
  const monthlyIncome = annualIncome / 12;
  const estimatedInterestRate = 10; // Default estimation for risk calculation
  const estimatedTermLength = 60; // Default 5-year term
  const monthlyRate = estimatedInterestRate / 100 / 12;
  const estimatedMonthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -estimatedTermLength));
  const paymentToIncomeRatio = estimatedMonthlyPayment / monthlyIncome;
  
  // Check various criteria
  if (debtToIncomeRatio > 0.43) {
    denialReasons.push("Debt-to-income ratio exceeds our lending guidelines");
  }
  
  // Check PTI
  if (paymentToIncomeRatio > 0.43) {
    denialReasons.push("Payment-to-income ratio exceeds our lending guidelines");
  }
  
  if (employmentStatus === "unemployed") {
    denialReasons.push("Current employment status does not meet our criteria");
  }
  
  if (yearsEmployed < 1 && employmentStatus !== "unemployed" && employmentStatus !== "retired") {
    denialReasons.push("Insufficient employment history");
  }
  
  // Approve if no denial reasons
  return denialReasons.length === 0;
}

/**
 * Calculate interest rate using simple tiers as fallback
 * @param yearsEmployed Years at current job
 * @returns Interest rate percentage
 */
function calculateBasicInterestRate(yearsEmployed: number): number {
  // Assign interest rate based on employment stability
  if (yearsEmployed > 5) {
    return 5.0; // Tier 1 - lowest risk
  } else if (yearsEmployed >= 3) {
    return 10.0; // Tier 2
  } else if (yearsEmployed >= 1) {
    return 15.0; // Tier 3
  } else {
    return 20.0; // Tier 4 - highest risk
  }
}

// Instantiate and export the in-memory storage
export const storage = new MemStorage();