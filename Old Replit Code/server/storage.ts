import { 
  users, type User, type InsertUser,
  loanApplications, type LoanApplication, type InsertLoanApplication
} from "@shared/schema";

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
    
    // Evaluate loan application
    const creditScore = insertApplication.creditScore;
    const annualIncome = insertApplication.annualIncome;
    const loanAmount = insertApplication.loanAmount;
    const debtToIncomeRatio = loanAmount / annualIncome;
    const employmentStatus = insertApplication.employmentStatus;
    const yearsEmployed = insertApplication.yearsEmployed;
    
    // Credit scoring
    let approved = false;
    let denialReasons: string[] = [];
    let approvedAmount;
    let interestRate;
    let termLength;
    let monthlyPayment;

    // Basic credit scoring algorithm
    if (creditScore < 580) {
      approved = false;
      denialReasons.push("Credit score below our minimum requirements");
    }
    
    if (debtToIncomeRatio > 0.43) {
      approved = false;
      denialReasons.push("Debt-to-income ratio exceeds our lending guidelines");
    }
    
    if (employmentStatus === "unemployed") {
      approved = false;
      denialReasons.push("Current employment status does not meet our criteria");
    }

    if (yearsEmployed < 1 && employmentStatus !== "unemployed" && employmentStatus !== "retired") {
      approved = false;
      denialReasons.push("Insufficient employment history");
    }

    // If no denial reasons, approve the loan
    if (denialReasons.length === 0) {
      approved = true;
      // Calculate loan terms based on credit score and other factors
      approvedAmount = loanAmount;
      
      // Base interest rate calculation (simplified for demo)
      if (creditScore >= 750) {
        interestRate = 4.5;
      } else if (creditScore >= 700) {
        interestRate = 5.5;
      } else if (creditScore >= 650) {
        interestRate = 6.5;
      } else if (creditScore >= 600) {
        interestRate = 8.0;
      } else {
        interestRate = 10.0;
      }
      
      // Adjust based on employment stability
      if (yearsEmployed > 5) {
        interestRate -= 0.5;
      }
      
      // Default term length (60 months/5 years)
      termLength = 60;
      
      // Calculate monthly payment (simplified formula for demo)
      const monthlyRate = interestRate / 100 / 12;
      monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termLength));
    }

    const application: LoanApplication = {
      ...insertApplication, 
      id,
      applicationDate, 
      approved,
      denialReasons: denialReasons,
      approvedAmount: approvedAmount ?? null,
      interestRate: interestRate ?? null,
      termLength: termLength ?? null,
      monthlyPayment: monthlyPayment ?? null
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

// Instantiate and export the in-memory storage
export const storage = new MemStorage();
