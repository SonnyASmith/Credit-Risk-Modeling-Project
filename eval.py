import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
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


def load_model_and_data(model_path="loan_risk_model.pkl",
                        scaler_path="scaler.pkl",
                        encoder_path="label_encoder.pkl",
                        test_data_path="imputed_data.csv"):
    """Load the model, preprocessing tools, and test data."""
    # Load model and preprocessing tools
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    label_encoder = joblib.load(encoder_path)

    # Load dataset
    df = pd.read_csv(test_data_path)

    # Select relevant features
    features = ["loan_amnt", "int_rate", "dti", "pub_rec_bankruptcies", "annual_inc", "total_acc"]
    X = df[features]

    # Check for and handle missing values
    print(f"Missing values before imputation:\n{X.isna().sum()}")

    # Impute missing values with median (for numeric data)
    for col in X.columns:
        if X[col].isna().any():
            median_val = X[col].median()
            X[col] = X[col].fillna(median_val)
            print(f"Imputed missing values in '{col}' with median: {median_val}")

    # Ensure we have no missing values in target
    if df["loan_paid"].isna().any():
        print("WARNING: Missing values in target variable. Dropping those rows.")
        df = df.dropna(subset=["loan_paid"])
        X = df[features]  # Update X after dropping rows

    # Encode target
    y_true = label_encoder.transform(df["loan_paid"])

    # Scale features
    X_scaled = scaler.transform(X)

    # Verify no NaNs in scaled data
    if np.isnan(X_scaled).any():
        print("WARNING: NaN values still present after scaling. Replacing with zeros.")
        X_scaled = np.nan_to_num(X_scaled)

    return model, X_scaled, y_true, label_encoder, df[features], df["loan_paid"]


def evaluate_model(model, X_test, y_true, label_encoder, class_names=None):
    """Evaluate model performance with multiple metrics."""
    # Get predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]  # Probability of positive class

    # If class names not provided, get from encoder
    if class_names is None:
        class_names = label_encoder.classes_

    # Ensure class_names are strings, not numpy numbers
    if hasattr(class_names, 'dtype') and np.issubdtype(class_names.dtype, np.number):
        class_names = [str(name) for name in class_names]

    # Calculate metrics
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)

    # AUC-ROC
    auc_roc = roc_auc_score(y_true, y_pred_proba)

    # Print metrics
    print("\n===== MODEL EVALUATION =====")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(f"AUC-ROC Score: {auc_roc:.4f}")

    # Print classification report
    print("\n===== CLASSIFICATION REPORT =====")
    try:
        print(classification_report(y_true, y_pred, target_names=class_names))
    except TypeError as e:
        print(f"Could not use target_names due to: {e}")
        print(classification_report(y_true, y_pred))

    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'auc_roc': auc_roc,
        'y_pred': y_pred,
        'y_pred_proba': y_pred_proba
    }


def plot_confusion_matrix(y_true, y_pred, class_names):
    """Plot confusion matrix."""
    plt.figure(figsize=(8, 6))
    cm = confusion_matrix(y_true, y_pred)

    # Ensure class_names are strings
    if not all(isinstance(name, str) for name in class_names):
        class_names = [str(name) for name in class_names]

    try:
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=class_names, yticklabels=class_names)
    except Exception as e:
        print(f"Warning when plotting confusion matrix: {e}")
        # Fallback: don't use class names for labels
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')

    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.tight_layout()

    try:
        plt.savefig('confusion_matrix.png')
        print("Confusion matrix saved as 'confusion_matrix.png'")
    except Exception as e:
        print(f"Could not save confusion matrix: {e}")

    try:
        plt.show()
    except Exception as e:
        print(f"Could not display confusion matrix: {e}")

    # Calculate and print confusion matrix metrics
    tn, fp, fn, tp = cm.ravel()
    print(f"\n===== CONFUSION MATRIX BREAKDOWN =====")
    print(f"True Negatives: {tn}")
    print(f"False Positives: {fp}")
    print(f"False Negatives: {fn}")
    print(f"True Positives: {tp}")


def plot_roc_curve(y_true, y_pred_proba):
    """Plot ROC curve."""
    fpr, tpr, thresholds = roc_curve(y_true, y_pred_proba)
    auc = roc_auc_score(y_true, y_pred_proba)

    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, label=f'AUC = {auc:.4f}')
    plt.plot([0, 1], [0, 1], 'k--')  # Diagonal line
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve')
    plt.legend(loc='lower right')
    plt.savefig('roc_curve.png')
    plt.show()


def plot_precision_recall_curve(y_true, y_pred_proba):
    """Plot precision-recall curve."""
    precision, recall, thresholds = precision_recall_curve(y_true, y_pred_proba)
    avg_precision = average_precision_score(y_true, y_pred_proba)

    plt.figure(figsize=(8, 6))
    plt.plot(recall, precision, label=f'Avg Precision = {avg_precision:.4f}')
    plt.xlabel('Recall')
    plt.ylabel('Precision')
    plt.title('Precision-Recall Curve')
    plt.legend(loc='lower left')
    plt.savefig('precision_recall_curve.png')
    plt.show()


def plot_feature_importance(model, feature_names):
    """Plot feature importance."""
    # Get feature importances
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]

    plt.figure(figsize=(10, 6))
    plt.title('Feature Importance')
    plt.bar(range(len(importances)), importances[indices], align='center')
    plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=90)
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    plt.show()

    # Print feature importance
    print("\n===== FEATURE IMPORTANCE =====")
    for i in indices:
        print(f"{feature_names[i]}: {importances[i]:.4f}")


def run_evaluation(use_test_split=False, test_size=0.2):
    """Run the complete evaluation."""
    # Load model and data
    model, X, y, label_encoder, X_df, y_df = load_model_and_data()

    # If using test split (instead of the pre-split data)
    if use_test_split:
        from sklearn.model_selection import train_test_split
        _, X_test, _, y_test = train_test_split(X, y, test_size=test_size, random_state=42, stratify=y)
    else:
        X_test, y_test = X, y

    # Get class names and convert to strings if needed
    class_names = label_encoder.classes_
    if hasattr(class_names, 'dtype') and np.issubdtype(class_names.dtype, np.number):
        print("Converting numeric class names to strings")
        class_names = [str(name) for name in class_names]

    # Print class labels information
    print(f"Class labels (type: {type(class_names).__name__}):")
    for i, name in enumerate(class_names):
        print(f"  Class {i}: {name} (type: {type(name).__name__})")

    # Evaluate model
    eval_results = evaluate_model(model, X_test, y_test, label_encoder, class_names)

    # Plot confusion matrix with string class names
    plot_confusion_matrix(y_test, eval_results['y_pred'], class_names)

    # Plot ROC curve
    plot_roc_curve(y_test, eval_results['y_pred_proba'])

    # Plot precision-recall curve
    plot_precision_recall_curve(y_test, eval_results['y_pred_proba'])

    # Plot feature importance
    plot_feature_importance(model, X_df.columns)

    return eval_results


if __name__ == "__main__":
    # Add version compatibility warning handling
    import warnings
    from sklearn.exceptions import InconsistentVersionWarning

    # Suppress version warnings
    warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

    try:
        run_evaluation()
        print("\nEvaluation completed successfully!")
    except Exception as e:
        print(f"\nError during evaluation: {e}")

        # Give guidance based on common errors
        if "Input X contains NaN" in str(e):
            print("\nAdditional debugging for NaN values:")
            model, X, y, label_encoder, X_df, y_df = load_model_and_data()
            print(f"\nFeature statistics after loading:")
            print(X_df.describe())
            print(f"\nAre there any NaN values? {np.isnan(X).any()}")
            if np.isnan(X).any():
                nan_counts = np.isnan(X).sum(axis=0)
                print(f"NaN counts per column: {nan_counts}")

                # Display rows with NaNs for debugging
                print("\nRows with NaN values in original data:")
                nan_rows = X_df[X_df.isna().any(axis=1)]
                if not nan_rows.empty:
                    print(nan_rows.head())