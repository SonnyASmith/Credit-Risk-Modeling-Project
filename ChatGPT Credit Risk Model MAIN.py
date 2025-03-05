import joblib
import numpy as np

# Load trained model and scaler
model = joblib.load("loan_risk_model.pkl")  # Ensure the model is saved beforehand
scaler = joblib.load("scaler.pkl")
label_encoder = joblib.load("label_encoder.pkl")

def classify_risk(loan_amount, interest_rate, dti, bankruptcies, annual_income, total_accounts):
    """Predicts the risk category based on input features."""
    # Prepare input data
    input_data = np.array([[loan_amount, interest_rate, dti, bankruptcies, annual_income, total_accounts]])
    input_data = scaler.transform(input_data)  # Scale data
    
    # Predict risk category
    risk_label = model.predict(input_data)[0]
    risk_category = label_encoder.inverse_transform([risk_label])[0]
    
    return risk_category

if __name__ == "__main__":
    print("Loan Risk Assessment")
    
    # Collect user input
    loan_amount = float(input("Enter Loan Amount ($): "))
    interest_rate = float(input("Enter Interest Rate (%): "))
    dti = float(input("Enter Debt-to-Income Ratio (%): "))
    bankruptcies = int(input("Enter Number of Past Bankruptcies: "))
    annual_income = float(input("Enter Annual Income ($): "))
    total_accounts = int(input("Enter Total Credit Accounts: "))
    
    # Predict risk
    risk = classify_risk(loan_amount, interest_rate, dti, bankruptcies, annual_income, total_accounts)
    print(f"Predicted Risk Category: {risk}")
