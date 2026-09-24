"""
Model Training and Export Script for Student Performance Prediction.
Exact replication of the logic in Sameeksha_StudentPerformancePrediction.ipynb:
- Dataset: data/student-mat.csv
- Preprocessing: pd.get_dummies(df, drop_first=True)
- Model: RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
- Train/Test Split: test_size=0.20, random_state=42
- Output: models/student_performance_rf_model.joblib and backend/model/student_performance_rf_model.joblib
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class StudentPerformanceModelBundle:
    """
    Wrapper holding the trained RandomForestRegressor and metadata for
    preprocessing raw 32-feature input into the exact 41-feature dummy schema.
    """
    def __init__(self, model, feature_columns, categorical_columns, numerical_columns, reference_sample):
        self.model = model
        self.feature_columns = feature_columns
        self.categorical_columns = categorical_columns
        self.numerical_columns = numerical_columns
        self.reference_sample = reference_sample

    def preprocess(self, input_data):
        """
        Converts a dictionary or DataFrame of raw student features into
        the exact 41-column DataFrame expected by the trained model.
        """
        if isinstance(input_data, dict):
            df_input = pd.DataFrame([input_data])
        elif isinstance(input_data, pd.DataFrame):
            df_input = input_data.copy()
        else:
            raise ValueError("Input data must be a dictionary or a pandas DataFrame")

        # Combine with reference sample to ensure all dummy columns are formed identically
        combined_df = pd.concat([self.reference_sample, df_input], ignore_index=True)
        combined_encoded = pd.get_dummies(combined_df, drop_first=True)

        # Extract only the input rows (skip the reference sample rows)
        input_encoded = combined_encoded.iloc[len(self.reference_sample):].copy()

        # Reindex to guarantee exact column match and order
        input_aligned = input_encoded.reindex(columns=self.feature_columns, fill_value=0)
        return input_aligned

    def predict(self, input_data):
        """Generates G3 grade prediction for the raw input data."""
        processed = self.preprocess(input_data)
        predictions = self.model.predict(processed)
        return predictions


def train_and_save():
    # Resolve paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'student-mat.csv')
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    # 1. Load dataset
    df = pd.read_csv(data_path)
    print(f"Loaded dataset with shape: {df.shape}")

    # 2. Identify categorical and numerical features
    raw_feature_cols = [c for c in df.columns if c != 'G3']
    categorical_cols = df[raw_feature_cols].select_dtypes(include=['object']).columns.tolist()
    numerical_cols = df[raw_feature_cols].select_dtypes(include=['int64', 'float64']).columns.tolist()

    # 3. Preprocessing using pd.get_dummies (Notebook Section 11)
    df_encoded = pd.get_dummies(df, drop_first=True)
    X = df_encoded.drop('G3', axis=1)
    y = df_encoded['G3']
    feature_columns = list(X.columns)

    print(f"Encoded feature matrix X shape: {X.shape} (41 features)")
    print(f"Target vector y shape: {y.shape}")

    # 4. Train-Test Split (Notebook Section 12)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    # 5. Train RandomForestRegressor (Notebook Section 13)
    rf_model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)
    print("RandomForestRegressor trained successfully.")

    # 6. Model Evaluation (Notebook Section 14)
    y_pred = rf_model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)

    print("=== MODEL EVALUATION METRICS ===")
    print(f"Mean Absolute Error (MAE):     {mae:.4f}")
    print(f"Mean Squared Error (MSE):      {mse:.4f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"R² Score:                      {r2:.4f} ({r2*100:.2f}%)")

    # 7. Create Model Bundle
    reference_sample = df[raw_feature_cols].copy()
    bundle = StudentPerformanceModelBundle(
        model=rf_model,
        feature_columns=feature_columns,
        categorical_columns=categorical_cols,
        numerical_columns=numerical_cols,
        reference_sample=reference_sample
    )

    # Test the bundle prediction on the first test sample
    sample_raw = df.iloc[y_test.index[0]][raw_feature_cols].to_dict()
    test_pred = bundle.predict(sample_raw)[0]
    expected_pred = y_pred[0]
    print(f"Sample raw prediction test: Predicted={test_pred:.2f}, Expected={expected_pred:.2f}")
    assert np.isclose(test_pred, expected_pred), "Bundle prediction did not match direct model prediction!"

    # 8. Save Model to models/ and backend/model/
    models_dir = os.path.join(base_dir, 'models')
    backend_model_dir = os.path.join(base_dir, 'backend', 'model')
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(backend_model_dir, exist_ok=True)

    dest_models = os.path.join(models_dir, 'student_performance_rf_model.joblib')
    dest_backend = os.path.join(backend_model_dir, 'student_performance_rf_model.joblib')

    joblib.dump(bundle, dest_models)
    joblib.dump(bundle, dest_backend)

    print(f"Model saved to: {dest_models}")
    print(f"Model saved to: {dest_backend}")


if __name__ == '__main__':
    train_and_save()
