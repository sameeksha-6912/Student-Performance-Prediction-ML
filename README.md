# Student Performance Prediction using Machine Learning

**IBM SkillsBuild Data Analytics with AI Academic Internship Program**  
*Conducted by BharatCares in association with AICTE*  
**Candidate Name:** Sameeksha  

---

## Project Description
This project presents an end-to-end Supervised Machine Learning regression pipeline designed to predict students' final academic performance (Final Grade `G3` on a 0–20 scale) based on demographic attributes, socioeconomic background, study habits, school attendance, and historical examination scores. The project follows best practices in exploratory data analysis (EDA), data cleaning, feature preprocessing, ensemble model training, and empirical evaluation.

## Objective
The primary objective of this project is to build an accurate and interpretable predictive model that enables educational institutions, instructors, and parents to identify at-risk students well before final examinations occur, thereby facilitating timely academic intervention and personalized tutoring.

## Dataset
- **Kaggle Dataset Name:** Student Performance Data Set / Student Alcohol Consumption
- **Actual Kaggle Dataset Link:** [https://www.kaggle.com/datasets/uciml/student-alcohol-consumption](https://www.kaggle.com/datasets/uciml/student-alcohol-consumption)
- **Alternate Kaggle Reference:** [https://www.kaggle.com/datasets/whenamancodes/student-performance](https://www.kaggle.com/datasets/whenamancodes/student-performance)
- **Dataset Dimensions:** 395 rows, 33 columns
- **Important Features:**
  - `G1`, `G2`: First and second period exam grades (0–20 scale)
  - `studytime`: Weekly study hours (1: <2h, 2: 2–5h, 3: 5–10h, 4: >10h)
  - `failures`: Number of past class failures (0 to 4)
  - `absences`: Total number of school absences (0 to 93)
  - `Medu`, `Fedu`: Mother and father education level (0 to 4)
  - `schoolsup`, `famsup`: Extra school and family educational support (yes/no)
  - `higher`: Aspiration to pursue higher education (yes/no)
- **Target Variable:** `G3` (Final continuous grade on a 0–20 scale)

## Technologies Used
- **Python 3.12**
- **Pandas** (Data manipulation and encoding)
- **NumPy** (Numerical operations)
- **Matplotlib & Seaborn** (Data visualization and statistical plots)
- **Scikit-learn** (Model training, train-test splitting, and evaluation metrics)
- **Jupyter Notebook** (Interactive experimentation and pipeline execution)

## Machine Learning Model
- **Algorithm Selected:** `RandomForestRegressor` (`n_estimators=100`, `random_state=42`)
- **Task Type:** Supervised Regression (predicting continuous final grade `G3`)
- **Why Random Forest was Selected:**
  - Reduces variance and prevents overfitting through ensemble averaging across 100 decision trees.
  - Effectively models non-linear relationships and interactions between behavioral and academic features.
  - Provides built-in feature importance rankings to assist educational stakeholders.

## Project Workflow
```
Dataset Acquisition
       ↓
Data Cleaning & Missing Value Verification
       ↓
Exploratory Data Analysis (EDA & Visualizations)
       ↓
Data Preprocessing (One-Hot Categorical Encoding)
       ↓
Train-Test Split (80% Train, 20% Test, random_state=42)
       ↓
Model Training (Random Forest Regressor)
       ↓
Model Evaluation (MAE, MSE, RMSE, R² Score)
       ↓
Sample Test Predictions & Residual Analysis
```

## Results
The model was evaluated on the unseen test dataset (79 student records) yielding the following genuine performance metrics:

| Metric | Obtained Value | Description |
| :--- | :--- | :--- |
| **Mean Absolute Error (MAE)** | **1.1646** | Average deviation of ~1.16 grade points on a 20-point scale |
| **Mean Squared Error (MSE)** | **3.7977** | Average squared error across all test predictions |
| **Root Mean Squared Error (RMSE)** | **1.9488** | Standard deviation of prediction residuals |
| **R² Score (Variance Explained)** | **0.8148 (81.48%)** | Explains over 81.48% of total variance in final grades |

### Sample Predictions Comparison:
| Student # | Actual Grade (G3) | Predicted Grade | Absolute Error |
| :---: | :---: | :---: | :---: |
| 1 | 10.0 | 8.32 | 1.68 |
| 2 | 12.0 | 11.78 | 0.22 |
| 3 | 5.0 | 6.50 | 1.50 |
| 4 | 10.0 | 9.76 | 0.24 |
| 5 | 9.0 | 8.80 | 0.20 |

## How to Run

### 1. Clone/Download the Repository
```bash
git clone <repository-url>
cd project_sameeksha
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start Jupyter Notebook
```bash
jupyter notebook
```

### 4. Open and Run the Notebook
- Open `Sameeksha_StudentPerformancePrediction.ipynb`
- Click **Kernel → Restart & Run All** to execute all cells.

## Project Structure
```
project_sameeksha/
│
├── data/
│   └── student-mat.csv                                  # Authentic Kaggle/UCI Dataset (395 records)
│
├── figures/                                             # High-resolution generated plots
│   ├── fig1_target_distribution.png
│   ├── fig2_correlation_heatmap.png
│   ├── fig3_studytime_failures_vs_g3.png
│   ├── fig4_actual_vs_predicted.png
│   ├── fig5_feature_importance.png
│   └── fig6_residual_distribution.png
│
├── Sameeksha_StudentPerformancePrediction.ipynb            # Fully executed Jupyter Notebook
├── requirements.txt                                     # Python dependencies
├── Sameeksha_StudentPerformancePrediction_ProjectReport.docx# Formal Internship Project Report
└── README.md                                            # Project documentation and summary
```
