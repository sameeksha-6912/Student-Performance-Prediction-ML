# Student Performance Prediction using Machine Learning

**IBM SkillsBuild Data Analytics with AI Academic Internship Program**  
*Conducted by BharatCares in association with AICTE*  
**Candidate Name:** Sameeksha  
**Email:** sameekshauniyal05@gmail.com  

---

## Submission Files

As per BharatCares submission requirements, the following four files are submitted:

| # | File | Format | Description |
|---|------|--------|-------------|
| 1 | `Sameeksha_StudentPerformancePrediction.ipynb` | `.ipynb` (Jupyter Notebook) | Complete project code -- executed with all outputs |
| 2 | `requirements.txt` | `.txt` | Python libraries/dependencies required to run the project |
| 3 | `Sameeksha_StudentPerformancePrediction_ProjectReport.docx` | `.docx` (Microsoft Word) | Complete project documentation and report |
| 4 | `README.md` | `.md` (Markdown) | Project overview, dataset link, technologies, setup instructions |

---

## Project Description

A full-stack Machine Learning web application that predicts a student's final academic grade (`G3`, scale 0-20) based on 32 input features including demographic background, study habits, family support, and historical exam scores.

- **Backend:** Flask REST API  
- **Frontend:** React (Vite)  
- **ML Model:** Random Forest Regressor (scikit-learn)  
- **Dataset:** [`data/student-mat.csv`](https://www.kaggle.com/datasets/uciml/student-alcohol-consumption) (395 samples)

---

## Dataset

- **Kaggle Dataset:** [Student Performance Data Set / Student Alcohol Consumption](https://www.kaggle.com/datasets/uciml/student-alcohol-consumption)  
- **Alternate Reference:** [https://www.kaggle.com/datasets/whenamancodes/student-performance](https://www.kaggle.com/datasets/whenamancodes/student-performance)  
- **Dimensions:** 395 rows x 33 columns  
- **Target Variable:** `G3` -- Final continuous grade (0-20 scale)  
- **Key Features:** `G1`, `G2` (exam scores), `studytime`, `failures`, `absences`, `Medu`, `Fedu`, `higher`

---

## Technologies Used

- **Python 3.12**
- **Pandas**, **NumPy** -- Data manipulation
- **Matplotlib**, **Seaborn** -- Visualization
- **Scikit-learn** -- Model training and evaluation
- **Joblib** -- Model serialization
- **Flask** -- REST API backend
- **React + Vite** -- Frontend UI
- **Jupyter Notebook** -- Interactive ML pipeline

---

## Machine Learning Model

- **Algorithm:** `RandomForestRegressor` (`n_estimators=100`, `random_state=42`, `n_jobs=-1`)
- **Encoding:** `pd.get_dummies(df, drop_first=True)` (One-Hot Encoding)
- **Split:** 80% Train / 20% Test (`random_state=42`)

---

## Results

| Metric | Value |
|--------|-------|
| **R2 Score** | **0.8148** (81.48% variance explained) |
| **MAE** | **1.1646** points |
| **MSE** | **3.7977** |
| **RMSE** | **1.9488** |

---

## Project Workflow

```
Dataset Acquisition (Kaggle/UCI)
       |
Data Cleaning and Missing Value Check
       |
Exploratory Data Analysis (EDA and Visualizations)
       |
Data Preprocessing (One-Hot Encoding)
       |
Train-Test Split (80/20, random_state=42)
       |
Model Training (RandomForestRegressor)
       |
Model Evaluation (MAE, MSE, RMSE, R2)
       |
Model Saved -> Flask API -> React Frontend
```

---

## How to Run

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Jupyter Notebook (ML Pipeline)
```bash
jupyter notebook Sameeksha_StudentPerformancePrediction.ipynb
```

### 3. Start Flask Backend
```bash
python backend/app.py
```

### 4. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:3000** in your browser.

---

## Project Structure

```
project_sameeksha/
|
|-- data/
|   +-- student-mat.csv                                   # Dataset (395 records)
|
|-- figures/                                              # Generated EDA plots
|   |-- fig1_target_distribution.png
|   |-- fig2_correlation_heatmap.png
|   |-- fig3_studytime_failures_vs_g3.png
|   |-- fig4_actual_vs_predicted.png
|   |-- fig5_feature_importance.png
|   +-- fig6_residual_distribution.png
|
|-- backend/
|   |-- app.py                                            # Flask REST API
|   |-- train_model.py                                    # Model training script
|   +-- model/student_performance_rf_model.joblib         # Saved model
|
|-- frontend/
|   +-- src/App.jsx                                       # React UI
|
|-- models/
|   +-- student_performance_rf_model.joblib               # Saved ML model
|
|-- Sameeksha_StudentPerformancePrediction.ipynb          # Jupyter Notebook (submission)
|-- requirements.txt                                      # Dependencies (submission)
|-- Sameeksha_StudentPerformancePrediction_ProjectReport.docx  # Report (submission)
+-- README.md                                             # This file (submission)
```
