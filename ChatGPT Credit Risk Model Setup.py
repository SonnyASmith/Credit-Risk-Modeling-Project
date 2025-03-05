import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import pandas as pd

# Load dataset
file_path = "resampled_loan_data.csv"  # Update path if needed
df = pd.read_csv(file_path)

# Select relevant features
features = ["loan_amnt", "int_rate", "dti", "pub_rec_bankruptcies", "annual_inc", "total_acc"]
X = df[features]

# Encode risk category labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(df["loan_paid"])

# Split data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model, scaler, and label encoder
joblib.dump(model, "loan_risk_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("Model, scaler, and encoder saved successfully!")
