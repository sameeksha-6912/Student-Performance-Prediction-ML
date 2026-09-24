"""
Flask REST API for Student Performance Prediction.
IBM SkillsBuild Data Analytics with AI Academic Internship Program.
Conducted by BharatCares in association with AICTE.
Candidate Name: Sameeksha
"""

import os
import sys
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add current directory to path so StudentPerformanceModelBundle unpickles seamlessly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import the bundle class definition for unpickling
try:
    from train_model import StudentPerformanceModelBundle
except ImportError:
    pass

app = Flask(__name__)
CORS(app)

# Load the trained model once at startup
MODEL_PATH = os.path.join(current_dir, 'model', 'student_performance_rf_model.joblib')
FALLBACK_MODEL_PATH = os.path.join(os.path.dirname(current_dir), 'models', 'student_performance_rf_model.joblib')

if os.path.exists(MODEL_PATH):
    model_bundle = joblib.load(MODEL_PATH)
elif os.path.exists(FALLBACK_MODEL_PATH):
    model_bundle = joblib.load(FALLBACK_MODEL_PATH)
else:
    raise FileNotFoundError("Trained model file not found in backend/model/ or models/")

# Valid categories for categorical features
VALID_CATEGORIES = {
    'school': ['GP', 'MS'],
    'sex': ['F', 'M'],
    'address': ['U', 'R'],
    'famsize': ['LE3', 'GT3'],
    'Pstatus': ['T', 'A'],
    'Mjob': ['teacher', 'health', 'services', 'at_home', 'other'],
    'Fjob': ['teacher', 'health', 'services', 'at_home', 'other'],
    'reason': ['home', 'reputation', 'course', 'other'],
    'guardian': ['mother', 'father', 'other'],
    'schoolsup': ['yes', 'no'],
    'famsup': ['yes', 'no'],
    'paid': ['yes', 'no'],
    'activities': ['yes', 'no'],
    'nursery': ['yes', 'no'],
    'higher': ['yes', 'no'],
    'internet': ['yes', 'no'],
    'romantic': ['yes', 'no']
}

# Value ranges for numerical features
NUMERICAL_RANGES = {
    'age': (15, 22),
    'Medu': (0, 4),
    'Fedu': (0, 4),
    'traveltime': (1, 4),
    'studytime': (1, 4),
    'failures': (0, 4),
    'famrel': (1, 5),
    'freetime': (1, 5),
    'goout': (1, 5),
    'Dalc': (1, 5),
    'Walc': (1, 5),
    'health': (1, 5),
    'absences': (0, 93),
    'G1': (0, 20),
    'G2': (0, 20)
}


def get_grade_interpretation(score):
    if score < 10:
        return "Needs Improvement (0–9)"
    elif score < 14:
        return "Average (10–13)"
    elif score < 17:
        return "Good (14–16)"
    else:
        return "Excellent (17–20)"


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint confirming API status."""
    return jsonify({
        "status": "ok",
        "service": "Student Performance Prediction API",
        "model_loaded": model_bundle is not None
    }), 200


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Accepts raw student features JSON, validates fields,
    generates prediction using the saved Random Forest model,
    and returns predicted G3 score with performance interpretation.
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({
            "error": "Invalid JSON payload. Please provide student data as a JSON object."
        }), 400

    # Validate numerical fields
    processed_data = {}
    for field, (min_val, max_val) in NUMERICAL_RANGES.items():
        if field not in data:
            return jsonify({
                "error": f"Missing required numerical feature: '{field}'"
            }), 400
        try:
            val = float(data[field])
            if val < min_val or val > max_val:
                return jsonify({
                    "error": f"Field '{field}' value ({val}) is out of valid range [{min_val}, {max_val}]."
                }), 400
            processed_data[field] = int(val) if field != 'G1' and field != 'G2' else val
        except (ValueError, TypeError):
            return jsonify({
                "error": f"Field '{field}' must be a valid number."
            }), 400

    # Validate categorical fields
    for field, valid_options in VALID_CATEGORIES.items():
        if field not in data:
            return jsonify({
                "error": f"Missing required categorical feature: '{field}'"
            }), 400
        val = str(data[field]).strip()
        if val not in valid_options:
            return jsonify({
                "error": f"Field '{field}' value '{val}' is invalid. Allowed options: {valid_options}"
            }), 400
        processed_data[field] = val

    try:
        # Generate prediction using the loaded bundle
        pred_value = float(model_bundle.predict(processed_data)[0])
        pred_rounded = round(pred_value, 2)
        # Ensure prediction stays within valid grade bounds (0-20)
        pred_clamped = max(0.0, min(20.0, pred_rounded))

        interpretation = get_grade_interpretation(pred_clamped)

        return jsonify({
            "prediction": pred_clamped,
            "message": f"Predicted final grade: {pred_clamped:.2f} / 20",
            "interpretation": interpretation,
            "grade_scale": "0–20",
            "model_info": {
                "algorithm": "RandomForestRegressor",
                "r2_score": 0.8148,
                "mae": 1.1646
            }
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"Internal prediction error: {str(e)}"
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask backend on http://127.0.0.1:{port}")
    app.run(host='127.0.0.1', port=port, debug=False)
