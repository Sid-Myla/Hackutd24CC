import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Load the dataset
file_path = "../train.csv"
data = pd.read_csv(file_path)

# Display the first few rows to understand the structure
print("Initial dataset:")
print(data.head())

def calculate_adjusted_credit_score(row):
    # Assign weights to each factor
    weights = {
        'delay_days': -0.2,
        'delayed_payments': -0.3,
        'credit_inquiries': -0.2,
        'invested_monthly': 0.3,
        'total_emi': -0.1
    }
    
    # Normalizing values
    delay_days_normalized = min(max(row['Delay_from_due_date'] / 30, 0), 1)
    delayed_payments_normalized = min(max(row['Num_of_Delayed_Payment'] / 10, 0), 1)
    credit_inquiries_normalized = min(max(row['Num_Credit_Inquiries'] / 10, 0), 1)
    invested_monthly_normalized = min(max(row['Amount_invested_monthly'] / 1000, 0), 1)
    total_emi_normalized = min(max(row['Total_EMI_per_month'] / 1000, 0), 1)
    
    # Calculate the weighted score
    score = (
        weights['delay_days'] * delay_days_normalized +
        weights['delayed_payments'] * delayed_payments_normalized +
        weights['credit_inquiries'] * credit_inquiries_normalized +
        weights['invested_monthly'] * invested_monthly_normalized +
        weights['total_emi'] * total_emi_normalized
    )
    
    # Normalize score to the range 0-1
    score_normalized = min(max((score + 1) / 2, 0), 1)
    
    # Map classification to score range
    credit_score_bounds = {
        'Poor': (580, 624),
        'Standard': (625, 709),
        'Good': (710, 769),
        'Very Good': (770, 799),
        'Exceptional': (800, 850)  # Assuming 850 as a hypothetical upper bound
    }
    
    # Get the range for the classification
    classification = row['Credit_Score']
    lower_bound, upper_bound = credit_score_bounds.get(classification, (580, 850))
    
    # Scale the normalized score to the classification range
    score_adjusted = lower_bound + score_normalized * (upper_bound - lower_bound)
    
    # Ensure the score stays within the classification bounds
    return round(min(max(score_adjusted, lower_bound), upper_bound))


# Apply the function to calculate numeric credit scores for the dataset
data['Calculated_Credit_Score'] = data.apply(calculate_adjusted_credit_score, axis=1)

# Display the updated dataset with the new calculated numeric credit score
print("\nDataset with calculated numeric credit scores:")
print(data[['Delay_from_due_date', 'Num_of_Delayed_Payment', 'Num_Credit_Inquiries', 
           'Amount_invested_monthly', 'Total_EMI_per_month', 'Calculated_Credit_Score']].head())

# Save the updated dataset to a new CSV file
updated_file_path = '../train_credit.csv'
data.to_csv(updated_file_path, index=False)

print(f"\nUpdated dataset saved to: {updated_file_path}")

# ------------------ TRAINING THE MODEL STARTS HERE --------------------
# Features and Target Variable
features = [
    'Delay_from_due_date', 'Num_of_Delayed_Payment', 
    'Num_Credit_Inquiries', 'Amount_invested_monthly', 
    'Total_EMI_per_month', 'Credit_Utilization_Ratio',
    'Monthly_Inhand_Salary', 'Interest_Rate', 'Num_of_Loan'
]
target = 'Calculated_Credit_Score'

# Drop rows with missing values
data_cleaned = data.dropna(subset=features + [target])

# Split into Training and Testing sets
X = data_cleaned[features]
y = data_cleaned[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Training the Random Forest Regressor
model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)
print("\nSample Predictions:")
df = pd.DataFrame({'Actual': y_test, 'Predicted': y_pred})
print(df[:20])

# Accuracy calculation with tolerance level
def calculate_accuracies(df):
    correct_predictions=0
    for row in df.itertuples():
        if abs(row.Actual - row.Predicted) <= 50: # Change tolerance level here
            correct_predictions+=1
    print(correct_predictions)
    print(len(df))
    accuracy_tolerance = (correct_predictions / len(df)) * 100
    return accuracy_tolerance

# Calculate standard metrics
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Calculate accuracies with different tolerance levels
accuracy_tol = calculate_accuracies(df)


print(f"Accuracy: {accuracy_tol:.2f}%")

# Calculate score ranges for credit categories
def get_prediction_category(score):
    if score >= 800:
        return 'Exceptional'
    elif score >= 770:
        return 'Very Good'
    elif score >= 710:
        return 'Good'
    elif score >= 625:
        return 'Standard'
    else:
        return 'Poor'

# Compare predicted vs actual categories
y_test_categories = [get_prediction_category(score) for score in y_test]
y_pred_categories = [get_prediction_category(score) for score in y_pred]
category_accuracy = np.mean(np.array(y_test_categories) == np.array(y_pred_categories)) * 100


# Save the trained model
import joblib
model_file_path = "./credit_score_model2.pkl"
joblib.dump(model, model_file_path)
print(f"\nModel saved to: {model_file_path}")