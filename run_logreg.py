"""
Credit Risk Model Framework for Different Business Objectives

This module provides a framework for training, evaluating, and comparing
logistic regression models customized for different business scenarios.

Convention for target variable:
- 0: Loan paid off
- 1: Loan not paid off (defaulted)
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

# Metrics imports
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    roc_auc_score,
    precision_recall_curve,
    average_precision_score
)

# Model and preprocessing imports
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# For reproducibility
RANDOM_STATE = 42

# Set default visualization style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (10, 6)


class CreditDataProcessor:
    """
    Handles data processing for credit risk models.

    This class loads, processes, and prepares data for training and evaluating
    credit risk models with flexible feature selection.
    """

    def __init__(self, data_path="FINAL_DATA.csv", target_col="loan_paid"):
        """
        Initialize the data processor.

        Args:
            data_path (str): Path to the CSV data file
            target_col (str): Name of the target column
        """
        self.data_path = data_path
        self.target_col = target_col
        self.df = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.scaler = StandardScaler()
        self.features = None

    def load_data(self):
        """Load the dataset from CSV."""
        print(f"Loading data from {self.data_path}")
        self.df = pd.read_csv(self.data_path)
        print(f"Loaded data with {self.df.shape[0]} rows and {self.df.shape[1]} columns")
        return self

    def prepare_data(self, features=None, test_size=0.2):
        """
        Prepare data for model training and evaluation.

        Args:
            features (list): List of feature column names to use
                            If None, uses all available features except target
            test_size (float): Proportion of data to use for testing

        Returns:
            self: For method chaining
        """
        if self.df is None:
            self.load_data()

        # Determine features to use
        if features is None:
            # Use all columns except target
            features = [col for col in self.df.columns if col != self.target_col]

        self.features = features
        print(f"Using features: {self.features}")

        # Prepare X and y
        X = self.df[self.features]

        # Convention: 0 = loan paid off, 1 = loan not paid off (defaulted)
        y = (self.df[self.target_col] == 0).astype(int)
        print(f"Target distribution: {dict(zip(*np.unique(y, return_counts=True)))}")

        # Split data
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=test_size, random_state=RANDOM_STATE, stratify=y
        )

        # Scale features
        self.X_train = self.scaler.fit_transform(self.X_train)
        self.X_test = self.scaler.transform(self.X_test)

        print(f"Data prepared: {self.X_train.shape[0]} training samples, {self.X_test.shape[0]} test samples")
        return self

    def get_training_data(self):
        """Return the prepared training data."""
        if self.X_train is None:
            raise ValueError("Data not prepared. Call prepare_data() first.")
        return self.X_train, self.y_train

    def get_test_data(self):
        """Return the prepared test data."""
        if self.X_test is None:
            raise ValueError("Data not prepared. Call prepare_data() first.")
        return self.X_test, self.y_test

    def save_scaler(self, path="scaler.pkl"):
        """Save the fitted scaler to a file."""
        if self.X_train is None:
            raise ValueError("Scaler not fitted. Call prepare_data() first.")
        joblib.dump(self.scaler, path)
        print(f"Scaler saved to {path}")
        return self


class CreditModelTrainer:
    """
    Trains logistic regression models for credit risk.

    This class handles model training and prediction with a consistent interface.
    """

    def __init__(self, model_params=None):
        """
        Initialize the model trainer.

        Args:
            model_params (dict): Parameters to pass to LogisticRegression
        """
        # Use default params if none provided
        if model_params is None:
            model_params = {'max_iter': 500, 'random_state': RANDOM_STATE}

        # Create model instance
        self.model = LogisticRegression(**model_params)
        self.model_name = "LogisticRegression"
        print(f"Created {self.model_name} model")

    def train(self, X_train, y_train):
        """
        Train the model.

        Args:
            X_train: Training feature data
            y_train: Training target data

        Returns:
            self: For method chaining
        """
        print(f"Training {self.model_name}...")
        self.model.fit(X_train, y_train)
        print(f"Model trained successfully")
        return self

    def predict(self, X, threshold=0.5):
        """
        Make predictions with the trained model.

        Args:
            X: Feature data to predict with
            threshold (float): Classification threshold (default: 0.5)

        Returns:
            y_pred: Class predictions (0 = paid off, 1 = defaulted)
        """
        # Get probabilities then apply custom threshold
        proba = self.predict_proba(X)
        return (proba >= threshold).astype(int)

    def predict_proba(self, X):
        """
        Get prediction probabilities for the positive class (loan defaulted).

        Args:
            X: Feature data to predict with

        Returns:
            y_proba: Probability predictions for the positive class (class 1)
        """
        proba = self.model.predict_proba(X)
        # Return probability of class 1 (defaulted)
        return proba[:, 1]

    def save_model(self, path=None):
        """
        Save the trained model to a file.

        Args:
            path (str): Path to save the model
                       If None, uses 'logistic_regression_model.pkl'

        Returns:
            self: For method chaining
        """
        if path is None:
            path = "logistic_regression_model.pkl"

        joblib.dump(self.model, path)
        print(f"Model saved to {path}")
        return self

    @classmethod
    def load_model(cls, path):
        """
        Load a trained model from a file.

        Args:
            path (str): Path to the model file

        Returns:
            CreditModelTrainer: A trainer instance with the loaded model
        """
        # Create instance
        trainer = cls()

        # Replace with loaded model
        trainer.model = joblib.load(path)
        print(f"Model loaded from {path}")
        return trainer

    def get_feature_importance(self, feature_names=None):
        """
        Get feature importance based on coefficient values.

        Args:
            feature_names (list): Names of features to label the importance data
                                 If None, generates generic feature names

        Returns:
            pd.DataFrame: DataFrame with feature names and importance values
        """
        coefs = self.model.coef_[0]  # For binary classification

        if feature_names is None:
            feature_names = [f"feature_{i}" for i in range(len(coefs))]

        # Return absolute coefficient values as "importance"
        importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': np.abs(coefs),
            'coefficient': coefs
        })
        return importance_df.sort_values('importance', ascending=False)
    


class BusinessObjectiveModels:
    """
    Creates and manages credit risk models tailored for specific business objectives.
    
    This class provides pre-configured logistic regression models optimized for
    different business scenarios:
    1. Market Expansion - Maximize loan approval rate
    2. Default Prevention - Minimize default rate
    3. High-Value Customer Acquisition - Target financially stable customers
    4. Risk-Based Pricing - Optimize interest rates based on risk profiles
    """
    
    def __init__(self, data_processor):
        """
        Initialize with a data processor that has already loaded the data.
        
        Args:
            data_processor: CreditDataProcessor instance with loaded data
        """
        self.data_processor = data_processor
        self.models = {}
        
    def create_market_expansion_model(self):
        """
        Creates a model optimized for market expansion (maximize approvals).
        
        Uses feature selection and higher classification threshold to focus on
        approving more loans while accepting moderate defaults.
        
        Returns:
            CreditModelTrainer: Trained model instance
        """
        # Define features emphasizing positive indicators
        features = [
            "log_annual_inc",
            "boxcox_total_bc_limit", 
            "emp_length_woe",
            "boxcox_tot_hi_cred_lim",
            "purpose_debt_consolidation",
            "purpose_credit_card",
            "home_ownership_MORTGAGE",
            "term_60"
        ]
        
        # Prepare data with these features
        self.data_processor.prepare_data(features=features)
        X_train, y_train = self.data_processor.get_training_data()
        
        # Train logistic regression model
        model_trainer = CreditModelTrainer()
        model_trainer.train(X_train, y_train)
        
        # Store model with custom threshold
        # Higher threshold -> need stronger evidence to predict default -> more approvals
        self.models['market_expansion'] = {
            'trainer': model_trainer,
            'features': features,
            'threshold': 0.50,  
            'description': "Optimized for market expansion, prioritizing loan approvals"
        }
        
        return model_trainer
        
    def create_default_prevention_model(self):
        """
        Creates a model optimized for default prevention (minimize defaults).
        
        Uses feature selection and lower classification threshold to focus on
        catching as many potential defaults as possible.
        
        Returns:
            CreditModelTrainer: Trained model instance
        """
        # Define features emphasizing risk indicators
        features = [
            "99dti",
            "99pti",
            "revol_util",
            "boxcox_loan_amnt",
            "term_60",
            "purpose_small_business",
            "purpose_educational",
            "home_ownership_RENT"
        ]
        
        # Prepare data with these features
        self.data_processor.prepare_data(features=features)
        X_train, y_train = self.data_processor.get_training_data()
        
        # Train logistic regression model
        model_trainer = CreditModelTrainer()
        model_trainer.train(X_train, y_train)
        
        # Store model with custom threshold
        # Lower threshold -> less evidence needed to predict default -> fewer approvals
        self.models['default_prevention'] = {
            'trainer': model_trainer,
            'features': features,
            'threshold': 0.35,
            'description': "Optimized for default prevention, prioritizing loan quality"
        }
        
        return model_trainer
        
    def create_high_value_customer_model(self):
        """
        Creates a model optimized for high-value customer acquisition.
        
        Uses feature selection focused on wealth indicators and financial stability.
        
        Returns:
            CreditModelTrainer: Trained model instance
        """
        # Define features emphasizing wealth and stability
        features = [
            "99dti",
            "99pti",
            "revol_util",
            "term_60",
            "delinq_2yrs_woe",
            "inq_last_6mths_woe",
            "purpose_small_business",
            "purpose_educational",
            "home_ownership_RENT"
        ]
        
        # Prepare data with these features
        self.data_processor.prepare_data(features=features)
        X_train, y_train = self.data_processor.get_training_data()
        
        # Train logistic regression model - use default parameters
        model_trainer = CreditModelTrainer()
        model_trainer.train(X_train, y_train)
        
        # Store model with moderately high threshold
        self.models['high_value_customer'] = {
            'trainer': model_trainer,
            'features': features,
            'threshold': 0.45,
            'description': "Optimized for high-value customer acquisition"
        }
        
        return model_trainer
        
    def create_risk_based_pricing_model(self):
        """
        Creates a model optimized for risk-based pricing.
        
        Uses a balanced set of features to accurately predict default probabilities
        that can be used to set appropriate interest rates.
        
        Returns:
            CreditModelTrainer: Trained model instance
        """
        # Use a comprehensive set of predictive features
        features = [
            "99pti",
            "99dti",
            "log_annual_inc",
            "boxcox_loan_amnt",
            "revol_util",
            "boxcox_total_bc_limit",
            "boxcox_tot_hi_cred_lim",
            "emp_length_woe",
            "delinq_2yrs_woe",
            "inq_last_6mths_woe",
            "term_60",
            "home_ownership_RENT",
            "home_ownership_MORTGAGE",
            "purpose_credit_card",
            "purpose_debt_consolidation",
            "purpose_small_business",
            "purpose_educational"
        ]
        
        # Prepare data with these features
        self.data_processor.prepare_data(features=features)
        X_train, y_train = self.data_processor.get_training_data()
        
        # Train logistic regression model
        # Use l1 regularization to emphasize the most important features
        model_params = {
            'max_iter': 1000,
            'penalty': 'l1',
            'solver': 'liblinear',
            'random_state': RANDOM_STATE
        }
        model_trainer = CreditModelTrainer(model_params=model_params)
        model_trainer.train(X_train, y_train)
        
        # For pricing model, we don't store a threshold since we'll use 
        # the raw probabilities to determine pricing tiers
        self.models['risk_based_pricing'] = {
            'trainer': model_trainer,
            'features': features,
            'threshold': 0.40,  # Use raw probabilities instead
            'description': "Optimized for risk-based pricing, using probability tiers"
        }
        
        return model_trainer
    
    def create_all_models(self):
        """
        Creates all four business objective models.
        
        Returns:
            dict: Dictionary of all created models
        """
        self.create_market_expansion_model()
        self.create_default_prevention_model()
        self.create_high_value_customer_model()
        self.create_risk_based_pricing_model()
        
        return self.models
    
    def predict(self, model_name, X, use_custom_threshold=True):
        """
        Makes predictions using the specified model.
        
        Args:
            model_name (str): Name of the model to use
            X: Feature data for prediction
            use_custom_threshold (bool): Whether to use the model's custom threshold
            
        Returns:
            y_pred: Binary predictions
        """
        if model_name not in self.models:
            raise ValueError(f"Model '{model_name}' not found. Available models: {list(self.models.keys())}")
            
        model_info = self.models[model_name]
        trainer = model_info['trainer']
        
        if use_custom_threshold and model_info['threshold'] is not None:
            return trainer.predict(X, threshold=model_info['threshold'])
        else:
            return trainer.predict(X)
    
    def predict_proba(self, model_name, X):
        """
        Gets probability predictions using the specified model.
        
        Args:
            model_name (str): Name of the model to use
            X: Feature data for prediction
            
        Returns:
            y_proba: Probability predictions
        """
        if model_name not in self.models:
            raise ValueError(f"Model '{model_name}' not found. Available models: {list(self.models.keys())}")
            
        return self.models[model_name]['trainer'].predict_proba(X)
    
    def get_pricing_tiers(self, X, n_tiers=5, base_rate=5.0, max_rate=25.0, max_pd_threshold=0.40):
        """
        Calculates risk-based pricing tiers based on default probabilities.
        
        Args:
            X: Feature data for prediction
            n_tiers (int): Number of pricing tiers
            base_rate (float): Interest rate for lowest risk tier
            max_rate (float): Interest rate for highest risk tier
            max_pd_threshold (float): Maximum acceptable probability of default
            
        Returns:
            pd.DataFrame: DataFrame with default probabilities, interest rates, and rejection flags
        """
        if 'risk_based_pricing' not in self.models:
            raise ValueError("Risk-based pricing model not created yet.")
            
        # Get default probabilities
        proba = self.predict_proba('risk_based_pricing', X)
        
        # Create rejection mask for high-risk applicants
        rejection_mask = proba > max_pd_threshold
        
        # Create tier thresholds (quantiles)
        tier_thresholds = np.linspace(0, 1, n_tiers + 1)[1:-1]
        
        # Assign tiers based on probabilities
        tiers = np.zeros(len(proba), dtype=int)
        for i, threshold in enumerate(tier_thresholds, 1):
            tiers = np.where(proba >= threshold, i, tiers)
        
        # Calculate interest rates
        rate_step = (max_rate - base_rate) / (n_tiers - 1)
        interest_rates = base_rate + (tiers * rate_step)
        
        # Return as DataFrame with rejection flag
        return pd.DataFrame({
            'default_probability': proba,
            'risk_tier': tiers + 1,  # 1-indexed tiers
            'interest_rate': interest_rates,
            'rejected': rejection_mask  # True if applicant should be rejected
        })

class CreditModelEvaluator:
    """
    Evaluates credit risk models, with support for custom thresholds.

    This class provides comprehensive evaluation metrics and visualization
    for credit risk models optimized for different business objectives.
    """

    def __init__(self, output_dir='.'):
        """
        Initialize the model evaluator.

        Args:
            output_dir (str): Directory to save evaluation outputs
        """
        self.output_dir = output_dir
        self.class_names = ['Paid', 'Defaulted']  # 0: Paid, 1: Defaulted
        self.evaluation_results = {}

    def evaluate_model(self, model_trainer, X_test, y_test, model_name=None, threshold=0.5):
        """
        Evaluate a model and store comprehensive performance metrics.

        Args:
            model_trainer: Trained CreditModelTrainer instance
            X_test: Test feature data
            y_test: Test target data
            model_name (str): Name for this model evaluation
            threshold (float): Classification threshold to use

        Returns:
            dict: Dictionary of all evaluation metrics
        """
        if model_name is None:
            model_name = model_trainer.model_name

        print(f"\n===== EVALUATING MODEL: {model_name} =====")
        if threshold != 0.5:
            print(f"Using custom threshold: {threshold}")

        # Get probability predictions
        y_pred_proba = model_trainer.predict_proba(X_test)
        
        # Apply threshold for binary predictions
        y_pred = (y_pred_proba >= threshold).astype(int)

        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred),
            'y_pred': y_pred,
            'y_true': y_test,
            'y_pred_proba': y_pred_proba,
            'threshold': threshold,
            'auc_roc': roc_auc_score(y_test, y_pred_proba),
            'avg_precision': average_precision_score(y_test, y_pred_proba)
        }

        # Print basic metrics
        print("\n===== MODEL PERFORMANCE METRICS =====")
        print(f"Accuracy:  {metrics['accuracy']:.4f}")
        print(f"Precision: {metrics['precision']:.4f} (When we predict default, how often are we right?)")
        print(f"Recall:    {metrics['recall']:.4f} (What % of actual defaults do we catch?)")
        print(f"F1 Score:  {metrics['f1']:.4f}")
        print(f"AUC-ROC:   {metrics['auc_roc']:.4f}")
        print(f"Avg Prec:  {metrics['avg_precision']:.4f}")

        # Print classification report
        print("\n===== CLASSIFICATION REPORT =====")
        print(classification_report(y_test, y_pred, target_names=self.class_names))

        # Get confusion matrix detail
        cm = metrics['confusion_matrix']
        tn, fp, fn, tp = cm.ravel()

        print("\n===== CONFUSION MATRIX BREAKDOWN =====")
        print(f"True Negatives (correctly predicted as paid):       {tn}")
        print(f"False Positives (incorrectly predicted as defaulted): {fp}")
        print(f"False Negatives (incorrectly predicted as paid):    {fn}")
        print(f"True Positives (correctly predicted as defaulted):    {tp}")
        
        # Business implications
        approval_rate = (tn + fn) / (tn + fp + fn + tp)
        default_rate = fn / (tn + fn) if (tn + fn) > 0 else 0
        
        print("\n===== BUSINESS IMPLICATIONS =====")
        print(f"Approval Rate: {approval_rate:.2%} (% of all loans approved)")
        print(f"Default Rate Among Approved: {default_rate:.2%} (% of approved loans that default)")

        # Store results for later comparison
        self.evaluation_results[model_name] = metrics

        return metrics

    def evaluate_business_models(self, business_models, X_test, y_test):
        """
        Evaluate all models in a BusinessObjectiveModels instance.
        
        Args:
            business_models: BusinessObjectiveModels instance with trained models
            X_test: Test feature data
            y_test: Test target data
            
        Returns:
            dict: Dictionary of evaluation results for all models
        """
        results = {}
    
        for model_name, model_info in business_models.models.items():
            # Get model info
            trainer = model_info['trainer']
            threshold = model_info['threshold'] if model_info['threshold'] is not None else 0.5
            description = model_info['description']
            features = model_info['features']
            
            print(f"\n\n===== EVALUATING {model_name.upper()} MODEL =====")
            print(f"Description: {description}")
            
            # IMPORTANT FIX: Make sure we use only the features this model was trained on
            # Create a new data processor and prepare data with only these features
            temp_processor = CreditDataProcessor(business_models.data_processor.data_path)
            temp_processor.load_data()
            temp_processor.prepare_data(features=features)
            
            # Get the test data with the right features
            model_X_test, _ = temp_processor.get_test_data()  # Make sure we get X_test (first return value)
            
            # Evaluate model with its custom threshold
            results[model_name] = self.evaluate_model(
                trainer, model_X_test, y_test, 
                model_name=model_name,
                threshold=threshold
            )
        
        return results
    

    def plot_confusion_matrix(self, model_name=None, ax=None, cmap='Blues', save=True):
        """
        Plot confusion matrix for a model.

        Args:
            model_name (str): Name of the model to plot
            ax: Matplotlib axis to plot on
            cmap (str): Colormap to use
            save (bool): Whether to save the plot

        Returns:
            fig: The matplotlib figure
        """
        # Get the model to plot
        if model_name is None:
            if len(self.evaluation_results) == 1:
                model_name = list(self.evaluation_results.keys())[0]
            else:
                raise ValueError("Multiple models evaluated. Please specify model_name.")

        if model_name not in self.evaluation_results:
            raise ValueError(f"No evaluation results for {model_name}")

        # Get confusion matrix
        cm = self.evaluation_results[model_name]['confusion_matrix']
        threshold = self.evaluation_results[model_name]['threshold']

        # Create figure if needed
        if ax is None:
            fig, ax = plt.subplots(figsize=(8, 6))
        else:
            fig = ax.figure

        # Plot confusion matrix
        sns.heatmap(
            cm,
            annot=True,
            fmt='d',
            cmap=cmap,
            xticklabels=self.class_names,
            yticklabels=self.class_names,
            ax=ax
        )

        ax.set_xlabel('Predicted')
        ax.set_ylabel('Actual')
        ax.set_title(f'{model_name} Confusion Matrix (threshold = {threshold:.2f})')

        # Save if requested
        if save:
            filename = f"{model_name.lower().replace(' ', '_')}_confusion_matrix.png"
            filepath = f"{self.output_dir}/{filename}"
            plt.savefig(filepath)
            print(f"Confusion matrix saved to {filepath}")

        return fig

    def plot_roc_curve(self, model_names=None, ax=None, save=True, add_thresholds=True):
        """
        Plot ROC curve for one or more models, optionally marking thresholds.

        Args:
            model_names (list): Names of models to plot
            ax: Matplotlib axis to plot on
            save (bool): Whether to save the plot
            add_thresholds (bool): Whether to mark custom thresholds on the curve

        Returns:
            fig: The matplotlib figure
        """
        # Create figure if needed
        if ax is None:
            fig, ax = plt.subplots(figsize=(8, 6))
        else:
            fig = ax.figure

        # Determine which models to plot
        if model_names is None:
            model_names = list(self.evaluation_results.keys())
        elif isinstance(model_names, str):
            model_names = [model_names]

        # Plot ROC curve for each model
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                print(f"Warning: No evaluation results for {model_name}")
                continue

            results = self.evaluation_results[model_name]
            y_true = results['y_true']
            y_pred_proba = results['y_pred_proba']
            threshold = results['threshold']

            # Calculate ROC curve
            fpr, tpr, thresholds = roc_curve(y_true, y_pred_proba)
            auc = roc_auc_score(y_true, y_pred_proba)

            ax.plot(fpr, tpr, label=f'{model_name} (AUC = {auc:.4f})')
            
            # Add threshold marker if requested
            if add_thresholds:
                # Find closest threshold index
                idx = np.argmin(np.abs(thresholds - threshold))
                ax.plot(fpr[idx], tpr[idx], 'o', 
                       label=f'{model_name} threshold ({threshold:.2f})')

        # Add random classifier line
        ax.plot([0, 1], [0, 1], 'k--', label='Random')

        ax.set_xlabel('False Positive Rate')
        ax.set_ylabel('True Positive Rate')
        ax.set_title('ROC Curve Comparison')
        ax.legend(loc='lower right')

        # Save if requested
        if save:
            filename = "roc_curve_comparison.png"
            if len(model_names) == 1:
                filename = f"{model_names[0].lower().replace(' ', '_')}_roc_curve.png"
            filepath = f"{self.output_dir}/{filename}"
            plt.savefig(filepath)
            print(f"ROC curve saved to {filepath}")

        return fig

    def plot_precision_recall_curve(self, model_names=None, ax=None, save=True):
        """
        Plot precision-recall curve for one or more models.

        Args:
            model_names (list): Names of models to plot
            ax: Matplotlib axis to plot on
            save (bool): Whether to save the plot

        Returns:
            fig: The matplotlib figure
        """
        # Create figure if needed
        if ax is None:
            fig, ax = plt.subplots(figsize=(8, 6))
        else:
            fig = ax.figure

        # Determine which models to plot
        if model_names is None:
            model_names = list(self.evaluation_results.keys())
        elif isinstance(model_names, str):
            model_names = [model_names]

        # Plot precision-recall curve for each model
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                print(f"Warning: No evaluation results for {model_name}")
                continue

            results = self.evaluation_results[model_name]
            y_true = results['y_true']
            y_pred_proba = results['y_pred_proba']

            precision, recall, _ = precision_recall_curve(y_true, y_pred_proba)
            avg_precision = average_precision_score(y_true, y_pred_proba)

            ax.plot(recall, precision, label=f'{model_name} (AP = {avg_precision:.4f})')

        ax.set_xlabel('Recall')
        ax.set_ylabel('Precision')
        ax.set_title('Precision-Recall Curve Comparison')
        ax.legend(loc='lower left')

        # Save if requested
        if save:
            filename = "precision_recall_curve_comparison.png"
            if len(model_names) == 1:
                filename = f"{model_names[0].lower().replace(' ', '_')}_pr_curve.png"
            filepath = f"{self.output_dir}/{filename}"
            plt.savefig(filepath)
            print(f"Precision-recall curve saved to {filepath}")

        return fig

    def plot_feature_importance(self, model_trainer, feature_names=None, top_n=10, ax=None, save=True):
        """
        Plot feature importance for a model.

        Args:
            model_trainer: Trained CreditModelTrainer instance
            feature_names (list): Names of features
            top_n (int): Number of top features to show
            ax: Matplotlib axis to plot on
            save (bool): Whether to save the plot

        Returns:
            fig: The matplotlib figure
        """
        # Get feature importance
        importance_df = model_trainer.get_feature_importance(feature_names)

        # Create figure if needed
        if ax is None:
            fig, ax = plt.subplots(figsize=(10, 6))
        else:
            fig = ax.figure

        # Limit to top N features
        if top_n is not None and len(importance_df) > top_n:
            importance_df = importance_df.head(top_n)

        # Plot feature importance
        sns.barplot(
            data=importance_df,
            x='importance',
            y='feature',
            ax=ax,
            palette='viridis'
        )

        ax.set_title(f'{model_trainer.model_name} Feature Importance')
        ax.set_xlabel('Importance (Absolute Coefficient Value)')
        ax.set_ylabel('Feature')

        # Save if requested
        if save:
            filename = "feature_importance.png"
            filepath = f"{self.output_dir}/{filename}"
            plt.savefig(filepath)
            print(f"Feature importance plot saved to {filepath}")

        return fig

    def compare_models(self, metric='f1'):
        """
        Compare all evaluated models based on a specific performance metric.

        Args:
            metric (str): Metric to use for sorting the models
                         Common options: 'accuracy', 'precision', 'recall', 'f1', 'auc_roc'

        Returns:
            pd.DataFrame: DataFrame containing all models' performance metrics
        """
        if not self.evaluation_results:
            print("No models evaluated yet.")
            return None

        # Collect metrics from all models
        metrics = ['accuracy', 'precision', 'recall', 'f1', 'auc_roc', 'threshold']

        # Create comparison DataFrame
        comparison = {}
        for model_name, results in self.evaluation_results.items():
            comparison[model_name] = {m: results[m] for m in metrics if m in results}

        comparison_df = pd.DataFrame(comparison).T

        # Sort by specified metric
        if metric in comparison_df.columns:
            comparison_df = comparison_df.sort_values(metric, ascending=False)

        print("\n===== MODEL COMPARISON =====")
        print(comparison_df.round(4))

        return comparison_df

    def plot_model_comparison(self, metrics=None, ax=None, save=True):
        """
        Plot comparison of models across multiple metrics.

        Args:
            metrics (list): Metrics to compare
            ax: Matplotlib axis to plot on
            save (bool): Whether to save the plot

        Returns:
            fig: The matplotlib figure
        """
        if not self.evaluation_results:
            print("No models evaluated yet.")
            return None

        # Get comparison DataFrame
        comparison_df = self.compare_models()

        if metrics is None:
            metrics = ['accuracy', 'precision', 'recall', 'f1']
            if 'auc_roc' in comparison_df.columns:
                metrics.append('auc_roc')

        # Filter to requested metrics
        comparison_df = comparison_df[metrics]

        # Create figure if needed
        if ax is None:
            fig, ax = plt.subplots(figsize=(10, 6))
        else:
            fig = ax.figure

        # Plot comparison
        comparison_df.plot(kind='bar', ax=ax)

        ax.set_title('Model Comparison')
        ax.set_ylabel('Score')
        ax.set_xlabel('Model')
        ax.legend(title='Metric')

        # Save if requested
        if save:
            filepath = f"{self.output_dir}/model_comparison.png"
            plt.savefig(filepath)
            print(f"Model comparison plot saved to {filepath}")

        return fig

    def plot_confusion_matrices_comparison(self, model_names=None, save=True):
        """
        Plot confusion matrices for multiple models side by side.

        Args:
            model_names (list): Names of models to compare
            save (bool): Whether to save the plot

        Returns:
            fig: The matplotlib figure
        """
        if not self.evaluation_results:
            print("No models evaluated yet.")
            return None

        # Determine which models to plot
        if model_names is None:
            model_names = list(self.evaluation_results.keys())
        elif isinstance(model_names, str):
            model_names = [model_names]

        # Create a figure with subplots for each model
        n_models = len(model_names)
        fig, axes = plt.subplots(1, n_models, figsize=(6 * n_models, 5))

        # Handle single model case
        if n_models == 1:
            axes = [axes]

        # Define a different colormap for each model for visual distinction
        cmaps = ['Blues', 'Greens', 'Purples', 'Oranges', 'Reds']

        # Plot confusion matrix for each model
        for i, (model_name, ax) in enumerate(zip(model_names, axes)):
            if model_name not in self.evaluation_results:
                print(f"Warning: No evaluation results for {model_name}")
                continue

            # Get confusion matrix and threshold
            cm = self.evaluation_results[model_name]['confusion_matrix']
            threshold = self.evaluation_results[model_name]['threshold']

            # Plot confusion matrix with a different colormap
            cmap = cmaps[i % len(cmaps)]
            sns.heatmap(
                cm,
                annot=True,
                fmt='d',
                cmap=cmap,
                xticklabels=self.class_names,
                yticklabels=self.class_names,
                ax=ax
            )

            ax.set_xlabel('Predicted')
            ax.set_ylabel('Actual')
            ax.set_title(f'{model_name}\nthreshold = {threshold:.2f}')

        plt.tight_layout()

        # Save if requested
        if save:
            filepath = f"{self.output_dir}/confusion_matrices_comparison.png"
            plt.savefig(filepath)
            print(f"Confusion matrices comparison saved to {filepath}")

        return fig


# Example usage
if __name__ == "__main__":
    import os

    # Create output directory if it doesn't exist
    output_dir = "logreg_evaluation"
    os.makedirs(output_dir, exist_ok=True)

    # Step 1: Process data
    data_processor = CreditDataProcessor("FINAL_DATA.csv")
    data_processor.load_data()

    # Step 2: Create business-specific models
    business_models = BusinessObjectiveModels(data_processor)
    business_models.create_all_models()

    # Step 3: Evaluate all models
    evaluator = CreditModelEvaluator(output_dir=output_dir)
    
    # Prepare a common test set with all features
    data_processor.prepare_data()
    X_test, y_test = data_processor.get_test_data()
    
    # Evaluate each model with its specific features and thresholds
    evaluator.evaluate_business_models(business_models, X_test, y_test)

    # Step 4: Compare models
    evaluator.compare_models(metric='auc_roc')
    evaluator.plot_model_comparison()
    evaluator.plot_roc_curve(add_thresholds=True)
    evaluator.plot_precision_recall_curve()
    evaluator.plot_confusion_matrices_comparison()
    evaluator.plot_roc_curve(
    model_names=['market_expansion', 'default_prevention', 'risk_based_pricing'], 
    add_thresholds=True
)

    print("\nAll evaluations completed successfully!")
    # Print coefficients for each model
for model_name, model_info in business_models.models.items():
    trainer = model_info['trainer']
    features = model_info['features']
    print(f"\n===== COEFFICIENTS FOR {model_name.upper()} MODEL =====")
    coef_df = trainer.get_feature_importance(features)
    print(coef_df)
    
    # Optionally visualize
    evaluator.plot_feature_importance(trainer, features)
