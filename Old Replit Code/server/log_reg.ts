// server/riskModel.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define interfaces for our model
interface ModelParameters {
  name: string;
  features: string[];
  coefficients: number[];
  intercept: number;
  threshold: number;
}

/**
 * Basic risk model implementation that loads parameters from JSON
 * and provides a method to calculate default probability
 */
export class RiskModel {
  private modelParams: ModelParameters;
  private isLoaded: boolean = false;
  
  constructor(modelPath?: string) {
    // Default model path
    if (!modelPath) {
      modelPath = path.join(__dirname, '../risk_based_pricing_model.json');
    }
    
    try {
      // Load model parameters from JSON file
      const modelData = fs.readFileSync(modelPath, 'utf-8');
      this.modelParams = JSON.parse(modelData);
      this.isLoaded = true;
      console.log(`Loaded risk model '${this.modelParams.name}' with ${this.modelParams.features.length} features`);
    } catch (error) {
      console.error('Failed to load risk model:', error);
      // Initialize with empty model parameters as fallback
      this.modelParams = {
        name: 'fallback',
        features: [],
        coefficients: [],
        intercept: 0,
        threshold: 0.5
      };
    }
  }
  
  /**
   * Check if the model is loaded successfully
   */
  isModelLoaded(): boolean {
    return this.isLoaded;
  }
  
  /**
   * Apply sigmoid function to convert linear prediction to probability
   * @param z Linear prediction value
   * @returns Probability between 0 and 1
   */
  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }
  
  /**
   * Calculate default probability using logistic regression
   * @param features Array of feature values in the same order as model.features
   * @returns Probability of default (0-1)
   */
  predictDefaultProbability(features: number[]): number {
    if (!this.isLoaded) {
      throw new Error('Model not loaded');
    }
    
    if (features.length !== this.modelParams.features.length) {
      throw new Error(`Feature vector length mismatch: got ${features.length}, expected ${this.modelParams.features.length}`);
    }
    
    // Calculate the linear prediction (dot product of features and coefficients)
    let linearPrediction = this.modelParams.intercept;
    for (let i = 0; i < features.length; i++) {
      linearPrediction += features[i] * this.modelParams.coefficients[i];
    }
    
    // Apply sigmoid to get probability
    return this.sigmoid(linearPrediction);
  }
  
  /**
   * Get the list of feature names required by the model
   */
  getFeatureNames(): string[] {
    return this.modelParams.features;
  }
  
  /**
   * Determine if an application should be approved based on default probability
   * @param defaultProbability Calculated probability of default
   * @returns True if application should be approved, false otherwise
   */
  isApplicationApproved(defaultProbability: number): boolean {
    // Application is approved if default probability is below threshold
    return defaultProbability <= this.modelParams.threshold;
  }
}