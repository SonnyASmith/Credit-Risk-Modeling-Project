"""
Unified Credit Risk Model Framework

This module provides a unified framework for training, evaluating, and comparing
different credit risk models using a consistent approach.

Convention for target variable:
- 0: Loan paid off
- 1: Loan not paid off
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
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# Model configurations

'''
Original config:
        'default_features': [
            "loan_amnt", "int_rate", "dti", "pub_rec_bankruptcies",
            "annual_inc", "total_acc"
        ],
'''
MODEL_CONFIGS = {
    'random_forest': {
        'default_features': [
            "dti","annual_inc", "total_acc",
            "loan_amnt","pub_rec","installment","tax_liens"
                             
        ],
        'class': RandomForestClassifier,
        'default_params': {'n_estimators': 100, 'random_state': 42}
    },
    'logistic_regression': {
        'default_features': [
            "dti","annual_inc", "total_acc",
            "loan_amnt","pub_rec","installment","tax_liens"
        ],
        'class': LogisticRegression,
        'default_params': {'max_iter': 500, 'random_state': 42}
    }
}

# Set default visualization style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (10, 6)

# For reproducibility
RANDOM_STATE = 42


class CreditDataProcessor:
    """
    Handles data processing for credit risk models.

    This class loads, processes, and prepares data for training and evaluating
    credit risk models with flexible feature selection.
    """

    def __init__(self, data_path="imputed_data.csv", target_col="loan_paid"):
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

    def get_feature_names(self, model_type=None):
        """
        Get feature names for the specified model type.

        Args:
            model_type (str): Type of model ('random_forest', 'logistic_regression')
                              If None, returns all numeric features

        Returns:
            list: List of feature column names
        """
        if self.df is None:
            self.load_data()

        if model_type and model_type in MODEL_CONFIGS:
            return MODEL_CONFIGS[model_type]['default_features']

        # Default: return all numeric columns except the target
        numeric_cols = self.df.select_dtypes(include=['int64', 'float64']).columns
        return [col for col in numeric_cols if col != self.target_col]

    def prepare_data(self, features=None, model_type=None, test_size=0.2):
        """
        Prepare data for model training and evaluation.

        Args:
            features (list): List of feature column names to use
                            If None, uses default features for model_type
            model_type (str): Type of model to use features for
            test_size (float): Proportion of data to use for testing

        Returns:
            self: For method chaining
        """
        if self.df is None:
            self.load_data()

        # Determine features to use
        if features is None:
            features = self.get_feature_names(model_type)

        self.features = features
        print(f"Using features: {self.features}")

        # Prepare X and y
        X = self.df[self.features]

        # Convention: 0 = loan paid off, 1 = loan not paid off
        y = (self.df[self.target_col] != 0).astype(int)
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
    Trains credit risk models with consistent interface.

    This class handles model training and prediction for different
    types of credit risk models with a unified interface.
    """

    def __init__(self, model_type='random_forest', model_params=None):
        """
        Initialize the model trainer.

        Args:
            model_type (str): Type of model to train ('random_forest', 'logistic_regression')
            model_params (dict): Parameters to pass to the model constructor
        """
        if model_type not in MODEL_CONFIGS:
            raise ValueError(f"Unsupported model type: {model_type}. "
                             f"Choose from: {list(MODEL_CONFIGS.keys())}")

        self.model_type = model_type
        self.model_config = MODEL_CONFIGS[model_type]

        # Use default params if none provided
        if model_params is None:
            model_params = self.model_config['default_params']

        # Create model instance
        self.model = self.model_config['class'](**model_params)
        self.model_name = f"{self.model.__class__.__name__}"
        print(f"Created {self.model_name} model")

    def get_default_features(self):
        """Get the default features for this model type."""
        return self.model_config['default_features']

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

    def predict(self, X):
        """
        Make predictions with the trained model.

        Args:
            X: Feature data to predict with

        Returns:
            y_pred: Class predictions
        """
        return self.model.predict(X)

    def predict_proba(self, X):
        """
        Get prediction probabilities.

        Args:
            X: Feature data to predict with

        Returns:
            y_proba: Probability predictions
        """
        if hasattr(self.model, 'predict_proba'):
            proba = self.model.predict_proba(X)
            # Return probability of class 1 (not paid)
            return proba[:, 1]
        else:
            raise AttributeError(f"{self.model_name} does not support predict_proba")

    def save_model(self, path=None):
        """
        Save the trained model to a file.

        Args:
            path (str): Path to save the model
                       If None, uses 'model_type_model.pkl'

        Returns:
            self: For method chaining
        """
        if path is None:
            path = f"{self.model_type}_model.pkl"

        joblib.dump(self.model, path)
        print(f"Model saved to {path}")
        return self

    @classmethod
    def load_model(cls, path, model_type=None):
        """
        Load a trained model from a file.

        Args:
            path (str): Path to the model file
            model_type (str): Type of model being loaded

        Returns:
            CreditModelTrainer: Trainer with loaded model
        """
        # Infer model type from filename if not provided
        if model_type is None:
            if 'random_forest' in path:
                model_type = 'random_forest'
            elif 'logistic' in path:
                model_type = 'logistic_regression'
            else:
                raise ValueError("Could not infer model type from filename. "
                                 "Please specify model_type.")

        # Create instance without initializing model
        trainer = cls(model_type=model_type)

        # Replace with loaded model
        trainer.model = joblib.load(path)
        print(f"Model loaded from {path}")
        return trainer

    def get_feature_importance(self, feature_names=None):
        """
        Get feature importance if supported by model.

        Args:
            feature_names (list): Names of features

        Returns:
            pd.DataFrame: Feature importance data sorted by importance
        """
        if hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_

            if feature_names is None:
                feature_names = [f"feature_{i}" for i in range(len(importances))]

            # Return as DataFrame for easier handling
            importance_df = pd.DataFrame({
                'feature': feature_names,
                'importance': importances
            })
            return importance_df.sort_values('importance', ascending=False)

        elif hasattr(self.model, 'coef_'):
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

        else:
            print(f"Model {self.model_name} does not support feature importance.")
            return None


class CreditModelEvaluator:
    """
    Evaluates and compares credit risk models.

    This class provides comprehensive evaluation metrics and visualization
    for credit risk models.
    """

    def __init__(self, output_dir='.'):
        """
        Initialize the model evaluator.

        Args:
            output_dir (str): Directory to save evaluation outputs
        """
        self.output_dir = output_dir
        self.class_names = ['Paid', 'Not Paid']  # 0: Paid, 1: Not Paid
        self.evaluation_results = {}

    def evaluate_model(self, model_trainer, X_test, y_test, model_name=None):
        """
        Evaluate a model and store results.

        Args:
            model_trainer: Trained CreditModelTrainer instance
            X_test: Test feature data
            y_test: Test target data
            model_name (str): Name to identify this model evaluation
                             If None, uses model_trainer.model_name

        Returns:
            dict: Evaluation metrics
        """
        if model_name is None:
            model_name = model_trainer.model_name

        print(f"\n===== EVALUATING MODEL: {model_name} =====")

        # Get predictions
        y_pred = model_trainer.predict(X_test)

        try:
            y_pred_proba = model_trainer.predict_proba(X_test)
            has_proba = True
        except (AttributeError, NotImplementedError):
            y_pred_proba = None
            has_proba = False
            print("Note: This model doesn't support probability predictions")

        # Calculate basic metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred),
            'y_pred': y_pred,
            'y_true': y_test  # Store y_test for ROC curve
        }

        # Add probability-based metrics if available
        if has_proba:
            metrics['y_pred_proba'] = y_pred_proba
            metrics['auc_roc'] = roc_auc_score(y_test, y_pred_proba)
            metrics['avg_precision'] = average_precision_score(y_test, y_pred_proba)

        # Print basic metrics
        print("\n===== MODEL PERFORMANCE METRICS =====")
        print(f"Accuracy:  {metrics['accuracy']:.4f}")
        print(f"Precision: {metrics['precision']:.4f}")
        print(f"Recall:    {metrics['recall']:.4f}")
        print(f"F1 Score:  {metrics['f1']:.4f}")
        if has_proba:
            print(f"AUC-ROC:   {metrics['auc_roc']:.4f}")
            print(f"Avg Prec:  {metrics['avg_precision']:.4f}")

        # Print classification report
        print("\n===== CLASSIFICATION REPORT =====")
        print(classification_report(y_test, y_pred, target_names=self.class_names))

        # Get confusion matrix detail
        cm = metrics['confusion_matrix']
        tn, fp, fn, tp = cm.ravel()

        print("\n===== CONFUSION MATRIX BREAKDOWN =====")
        print(f"True Negatives (correctly predicted as paid):      {tn}")
        print(f"False Positives (incorrectly predicted as not paid): {fp}")
        print(f"False Negatives (incorrectly predicted as paid):   {fn}")
        print(f"True Positives (correctly predicted as not paid):    {tp}")

        # Store results for later comparison
        self.evaluation_results[model_name] = metrics

        return metrics

    def plot_confusion_matrix(self, model_name=None, ax=None, cmap='Blues', save=True):
        """
        Plot confusion matrix for a model.

        Args:
            model_name (str): Name of the model to plot
                             If None and only one model evaluated, uses that model
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
        ax.set_title(f'{model_name} Confusion Matrix')

        # Save if requested
        if save:
            filename = f"{model_name.lower().replace(' ', '_')}_confusion_matrix.png"
            filepath = f"{self.output_dir}/{filename}"
            plt.savefig(filepath)
            print(f"Confusion matrix saved to {filepath}")

        return fig

    def plot_roc_curve(self, model_names=None, ax=None, save=True):
        """
        Plot ROC curve for one or more models.

        Args:
            model_names (list): Names of models to plot
                               If None, plots all models with probability predictions
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
            model_names = [
                name for name, results in self.evaluation_results.items()
                if 'y_pred_proba' in results
            ]
        elif isinstance(model_names, str):
            model_names = [model_names]

        # Plot ROC curve for each model
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                print(f"Warning: No evaluation results for {model_name}")
                continue

            results = self.evaluation_results[model_name]
            if 'y_pred_proba' not in results:
                print(f"Warning: No probability predictions for {model_name}")
                continue

            # Get true values and probability predictions
            if 'y_true' not in results:
                print(f"Warning: No ground truth values for {model_name}")
                continue

            y_true = results['y_true']
            y_pred_proba = results['y_pred_proba']

            # Calculate ROC curve
            fpr, tpr, _ = roc_curve(y_true, y_pred_proba)
            auc = roc_auc_score(y_true, y_pred_proba)

            ax.plot(fpr, tpr, label=f'{model_name} (AUC = {auc:.4f})')

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
                               If None, plots all models with probability predictions
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
            model_names = [
                name for name, results in self.evaluation_results.items()
                if 'y_pred_proba' in results
            ]
        elif isinstance(model_names, str):
            model_names = [model_names]

        # Plot precision-recall curve for each model
        for model_name in model_names:
            if model_name not in self.evaluation_results:
                print(f"Warning: No evaluation results for {model_name}")
                continue

            results = self.evaluation_results[model_name]
            if 'y_pred_proba' not in results:
                print(f"Warning: No probability predictions for {model_name}")
                continue

            if 'y_true' not in results:
                print(f"Warning: No ground truth values for {model_name}")
                continue

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

        if importance_df is None:
            print(f"Model {model_trainer.model_name} does not support feature importance.")
            return None

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
        ax.set_xlabel('Importance')
        ax.set_ylabel('Feature')

        # Save if requested
        if save:
            filename = f"{model_trainer.model_type}_feature_importance.png"
            filepath = f"{self.output_dir}/{filename}"
            plt.savefig(filepath)
            print(f"Feature importance plot saved to {filepath}")

        return fig

    def compare_models(self, metric='f1'):
        """
        Compare models based on a specific metric.

        Args:
            metric (str): Metric to compare models on

        Returns:
            pd.DataFrame: Comparison of models
        """
        if not self.evaluation_results:
            print("No models evaluated yet.")
            return None

        # Collect metrics from all models
        metrics = ['accuracy', 'precision', 'recall', 'f1']
        if all('auc_roc' in results for results in self.evaluation_results.values()):
            metrics.append('auc_roc')

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
                          If None, uses accuracy, precision, recall, f1
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
                               If None, uses all evaluated models
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

            # Get confusion matrix
            cm = self.evaluation_results[model_name]['confusion_matrix']

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
            ax.set_title(f'{model_name} Confusion Matrix')

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
    output_dir = "model_evaluation"
    os.makedirs(output_dir, exist_ok=True)

    # Step 1: Process data
    data_processor = CreditDataProcessor()

    # Random Forest
    print("\n===== RANDOM FOREST MODEL =====")
    rf_features = MODEL_CONFIGS['random_forest']['default_features']
    data_processor.prepare_data(features=rf_features, model_type='random_forest')
    X_train, y_train = data_processor.get_training_data()
    X_test, y_test = data_processor.get_test_data()

    # Train Random Forest model
    rf_trainer = CreditModelTrainer(model_type='random_forest')
    rf_trainer.train(X_train, y_train)

    # Evaluate Random Forest model
    evaluator = CreditModelEvaluator(output_dir=output_dir)
    evaluator.evaluate_model(rf_trainer, X_test, y_test, model_name='RandomForest')
    evaluator.plot_confusion_matrix(model_name='RandomForest')
    evaluator.plot_roc_curve()
    evaluator.plot_feature_importance(rf_trainer, feature_names=rf_features)

    # Logistic Regression
    print("\n===== LOGISTIC REGRESSION MODEL =====")
    lr_features = MODEL_CONFIGS['logistic_regression']['default_features']
    data_processor.prepare_data(features=lr_features, model_type='logistic_regression')
    X_train, y_train = data_processor.get_training_data()
    X_test, y_test = data_processor.get_test_data()

    # Train Logistic Regression model
    lr_trainer = CreditModelTrainer(model_type='logistic_regression')
    lr_trainer.train(X_train, y_train)

    # Evaluate Logistic Regression model
    evaluator.evaluate_model(lr_trainer, X_test, y_test, model_name='LogisticRegression')
    evaluator.plot_confusion_matrix(model_name='LogisticRegression')
    evaluator.plot_roc_curve()
    evaluator.plot_feature_importance(lr_trainer, feature_names=lr_features)

    # Compare models
    comparison = evaluator.compare_models()
    evaluator.plot_model_comparison()

    # Plot ROC curves for both models together
    evaluator.plot_roc_curve(model_names=['RandomForest', 'LogisticRegression'])

    # Add a precision-recall curve comparison
    evaluator.plot_precision_recall_curve(model_names=['RandomForest', 'LogisticRegression'])

    # Add side-by-side confusion matrix comparison
    evaluator.plot_confusion_matrices_comparison(model_names=['RandomForest', 'LogisticRegression'])

    print("\nAll evaluations completed successfully!")
