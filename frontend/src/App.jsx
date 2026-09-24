import React, { useState } from 'react';
import './App.css';

const DEFAULT_STUDENT = {
  school: 'GP',
  sex: 'F',
  age: 17,
  address: 'U',
  famsize: 'GT3',
  Pstatus: 'T',
  Medu: 3,
  Fedu: 3,
  Mjob: 'services',
  Fjob: 'other',
  reason: 'course',
  guardian: 'mother',
  traveltime: 1,
  studytime: 2,
  failures: 0,
  schoolsup: 'no',
  famsup: 'yes',
  paid: 'no',
  activities: 'yes',
  nursery: 'yes',
  higher: 'yes',
  internet: 'yes',
  romantic: 'no',
  famrel: 4,
  freetime: 3,
  goout: 3,
  Dalc: 1,
  Walc: 2,
  health: 4,
  absences: 4,
  G1: 12,
  G2: 13
};

const PRESETS = {
  excellent: {
    ...DEFAULT_STUDENT,
    age: 16,
    Medu: 4,
    Fedu: 4,
    Mjob: 'teacher',
    Fjob: 'services',
    studytime: 4,
    failures: 0,
    schoolsup: 'no',
    famsup: 'yes',
    paid: 'yes',
    higher: 'yes',
    absences: 2,
    G1: 17,
    G2: 18
  },
  average: {
    ...DEFAULT_STUDENT,
    age: 17,
    Medu: 2,
    Fedu: 2,
    studytime: 2,
    failures: 0,
    absences: 6,
    G1: 11,
    G2: 12
  },
  atRisk: {
    ...DEFAULT_STUDENT,
    age: 18,
    Medu: 1,
    Fedu: 1,
    studytime: 1,
    failures: 2,
    schoolsup: 'yes',
    famsup: 'no',
    higher: 'no',
    absences: 16,
    G1: 6,
    G2: 7
  }
};

export default function App() {
  const [formData, setFormData] = useState(DEFAULT_STUDENT);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const loadPreset = (type) => {
    if (PRESETS[type]) {
      setFormData(PRESETS[type]);
      setError(null);
      setPredictionResult(null);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_STUDENT);
    setError(null);
    setPredictionResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    // Client-side validation
    if (formData.age < 15 || formData.age > 22) {
      setError('Age must be between 15 and 22.');
      setLoading(false);
      return;
    }
    if (formData.G1 < 0 || formData.G1 > 20 || formData.G2 < 0 || formData.G2 > 20) {
      setError('Exam grades (G1 and G2) must be between 0 and 20.');
      setLoading(false);
      return;
    }
    if (formData.absences < 0 || formData.absences > 93) {
      setError('Absences must be between 0 and 93.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to obtain prediction from backend.');
      }

      setPredictionResult(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server at http://127.0.0.1:5000. Please ensure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const getInterpretationClass = (score) => {
    if (score >= 17) return 'score-excellent';
    if (score >= 14) return 'score-good';
    if (score >= 10) return 'score-average';
    return 'score-needs-improvement';
  };

  return (
    <div className="app-container">
      {/* 1. Header */}
      <header className="header-card">
        <div className="badge-ribbon">IBM SkillsBuild × BharatCares × AICTE</div>
        <h1 className="main-title">Student Performance Prediction</h1>
        <p className="subtitle">
          Predict a student's final academic grade (G3) using an end-to-end Machine Learning Random Forest Regressor.
        </p>
        <div className="author-tag">
          Candidate: <strong>Sameeksha</strong> | Track: <strong>Data Analytics with AI Academic Internship</strong>
        </div>
      </header>

      {/* 2. Architecture Diagram Banner */}
      <section className="architecture-banner">
        <div className="arch-step">React Frontend</div>
        <div className="arch-arrow">→</div>
        <div className="arch-step">Flask REST API</div>
        <div className="arch-arrow">→</div>
        <div className="arch-step">Saved ML Model</div>
        <div className="arch-arrow">→</div>
        <div className="arch-step">Random Forest</div>
        <div className="arch-arrow">→</div>
        <div className="arch-step">Predicted G3 (0–20)</div>
      </section>

      {/* 3. Main Content: Form & Result */}
      <main className="main-grid">
        <div className="form-card">
          <div className="form-header">
            <h2>Student Attributes Input Form</h2>
            <p>Enter the student's academic history, lifestyle, and background features (32 inputs):</p>
          </div>

          <div className="presets-bar">
            <span>Quick Samples:</span>
            <button type="button" className="btn-preset" onClick={() => loadPreset('excellent')}>
              🌟 Top Student
            </button>
            <button type="button" className="btn-preset" onClick={() => loadPreset('average')}>
              📊 Average Student
            </button>
            <button type="button" className="btn-preset" onClick={() => loadPreset('atRisk')}>
              ⚠️ At-Risk Student
            </button>
            <button type="button" className="btn-preset btn-reset" onClick={handleReset}>
              🔄 Reset
            </button>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            {/* Section A: Academic History */}
            <div className="form-section">
              <h3 className="section-title">📚 1. Academic History (Strongest Predictors)</h3>
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="G1">First Period Grade (G1: 0–20)*</label>
                  <input
                    id="G1"
                    type="number"
                    name="G1"
                    min="0"
                    max="20"
                    step="0.5"
                    value={formData.G1}
                    onChange={handleChange}
                    required
                  />
                  <small className="field-hint">First semester exam score</small>
                </div>

                <div className="input-group">
                  <label htmlFor="G2">Second Period Grade (G2: 0–20)*</label>
                  <input
                    id="G2"
                    type="number"
                    name="G2"
                    min="0"
                    max="20"
                    step="0.5"
                    value={formData.G2}
                    onChange={handleChange}
                    required
                  />
                  <small className="field-hint">Midterm exam score</small>
                </div>

                <div className="input-group">
                  <label htmlFor="failures">Past Class Failures (0–4)*</label>
                  <select
                    id="failures"
                    name="failures"
                    value={formData.failures}
                    onChange={handleChange}
                  >
                    <option value={0}>0 failures</option>
                    <option value={1}>1 failure</option>
                    <option value={2}>2 failures</option>
                    <option value={3}>3 failures</option>
                    <option value={4}>4 or more failures</option>
                  </select>
                  <small className="field-hint">Number of past course failures</small>
                </div>
              </div>
            </div>

            {/* Section B: Study Habits & School Support */}
            <div className="form-section">
              <h3 className="section-title">⏱️ 2. Study Habits & School Support</h3>
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="studytime">Weekly Study Time*</label>
                  <select
                    id="studytime"
                    name="studytime"
                    value={formData.studytime}
                    onChange={handleChange}
                  >
                    <option value={1}>&lt; 2 hours / week</option>
                    <option value={2}>2 to 5 hours / week</option>
                    <option value={3}>5 to 10 hours / week</option>
                    <option value={4}>&gt; 10 hours / week</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="absences">School Absences (0–93)*</label>
                  <input
                    id="absences"
                    type="number"
                    name="absences"
                    min="0"
                    max="93"
                    value={formData.absences}
                    onChange={handleChange}
                    required
                  />
                  <small className="field-hint">Total missed school days</small>
                </div>

                <div className="input-group">
                  <label htmlFor="traveltime">Travel Time to School*</label>
                  <select
                    id="traveltime"
                    name="traveltime"
                    value={formData.traveltime}
                    onChange={handleChange}
                  >
                    <option value={1}>&lt; 15 min</option>
                    <option value={2}>15 to 30 min</option>
                    <option value={3}>30 min to 1 hour</option>
                    <option value={4}>&gt; 1 hour</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="schoolsup">Extra School Support</label>
                  <select
                    id="schoolsup"
                    name="schoolsup"
                    value={formData.schoolsup}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="famsup">Family Educational Support</label>
                  <select
                    id="famsup"
                    name="famsup"
                    value={formData.famsup}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="paid">Extra Paid Classes</label>
                  <select
                    id="paid"
                    name="paid"
                    value={formData.paid}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="activities">Extracurricular Activities</label>
                  <select
                    id="activities"
                    name="activities"
                    value={formData.activities}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section C: Social & Lifestyle */}
            <div className="form-section">
              <h3 className="section-title">🌱 3. Social & Lifestyle Indicators</h3>
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="higher">Higher Education Aspirations</label>
                  <select
                    id="higher"
                    name="higher"
                    value={formData.higher}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes (Plans higher studies)</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="internet">Internet Access at Home</label>
                  <select
                    id="internet"
                    name="internet"
                    value={formData.internet}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="romantic">Romantic Relationship</label>
                  <select
                    id="romantic"
                    name="romantic"
                    value={formData.romantic}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="famrel">Family Relationship Quality (1–5)</label>
                  <select
                    id="famrel"
                    name="famrel"
                    value={formData.famrel}
                    onChange={handleChange}
                  >
                    <option value={1}>1 - Very Bad</option>
                    <option value={2}>2 - Poor</option>
                    <option value={3}>3 - Neutral</option>
                    <option value={4}>4 - Good</option>
                    <option value={5}>5 - Excellent</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="freetime">Free Time After School (1–5)</label>
                  <select
                    id="freetime"
                    name="freetime"
                    value={formData.freetime}
                    onChange={handleChange}
                  >
                    <option value={1}>1 - Very Low</option>
                    <option value={2}>2 - Low</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Very High</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="goout">Going Out with Friends (1–5)</label>
                  <select
                    id="goout"
                    name="goout"
                    value={formData.goout}
                    onChange={handleChange}
                  >
                    <option value={1}>1 - Very Low</option>
                    <option value={2}>2 - Low</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Very High</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="Dalc">Workday Alcohol Consumption (1–5)</label>
                  <select
                    id="Dalc"
                    name="Dalc"
                    value={formData.Dalc}
                    onChange={handleChange}
                  >
                    <option value={1}>1 - Very Low</option>
                    <option value={2}>2 - Low</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Very High</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="Walc">Weekend Alcohol Consumption (1–5)</label>
                  <select
                    id="Walc"
                    name="Walc"
                    value={formData.Walc}
                    onChange={handleChange}
                  >
                    <option value={1}>1 - Very Low</option>
                    <option value={2}>2 - Low</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Very High</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="health">Current Health Status (1–5)</label>
                  <select
                    id="health"
                    name="health"
                    value={formData.health}
                    onChange={handleChange}
                  >
                    <option value={1}>1 - Very Bad</option>
                    <option value={2}>2 - Poor</option>
                    <option value={3}>3 - Normal</option>
                    <option value={4}>4 - Good</option>
                    <option value={5}>5 - Very Good</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section D: Demographic & Family Background */}
            <div className="form-section">
              <h3 className="section-title">🏠 4. Demographic & Family Background</h3>
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="school">School</label>
                  <select
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                  >
                    <option value="GP">Gabriel Pereira (GP)</option>
                    <option value="MS">Mousinho da Silveira (MS)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="sex">Gender</label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                  >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="age">Age (15–22)*</label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    min="15"
                    max="22"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="address">Address Type</label>
                  <select
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  >
                    <option value="U">Urban</option>
                    <option value="R">Rural</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="famsize">Family Size</label>
                  <select
                    id="famsize"
                    name="famsize"
                    value={formData.famsize}
                    onChange={handleChange}
                  >
                    <option value="GT3">Greater than 3 (&gt;3)</option>
                    <option value="LE3">Less or equal to 3 (≤3)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="Pstatus">Parent Cohabitation Status</label>
                  <select
                    id="Pstatus"
                    name="Pstatus"
                    value={formData.Pstatus}
                    onChange={handleChange}
                  >
                    <option value="T">Living Together</option>
                    <option value="A">Apart</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="Medu">Mother's Education Level</label>
                  <select
                    id="Medu"
                    name="Medu"
                    value={formData.Medu}
                    onChange={handleChange}
                  >
                    <option value={0}>0 - None</option>
                    <option value={1}>1 - Primary (4th grade)</option>
                    <option value={2}>2 - 5th to 9th grade</option>
                    <option value={3}>3 - Secondary Education</option>
                    <option value={4}>4 - Higher Education</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="Fedu">Father's Education Level</label>
                  <select
                    id="Fedu"
                    name="Fedu"
                    value={formData.Fedu}
                    onChange={handleChange}
                  >
                    <option value={0}>0 - None</option>
                    <option value={1}>1 - Primary (4th grade)</option>
                    <option value={2}>2 - 5th to 9th grade</option>
                    <option value={3}>3 - Secondary Education</option>
                    <option value={4}>4 - Higher Education</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="Mjob">Mother's Job</label>
                  <select
                    id="Mjob"
                    name="Mjob"
                    value={formData.Mjob}
                    onChange={handleChange}
                  >
                    <option value="services">Civil Services</option>
                    <option value="health">Healthcare</option>
                    <option value="teacher">Teacher</option>
                    <option value="at_home">At Home</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="Fjob">Father's Job</label>
                  <select
                    id="Fjob"
                    name="Fjob"
                    value={formData.Fjob}
                    onChange={handleChange}
                  >
                    <option value="other">Other</option>
                    <option value="services">Civil Services</option>
                    <option value="health">Healthcare</option>
                    <option value="teacher">Teacher</option>
                    <option value="at_home">At Home</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="reason">Reason to Choose School</label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                  >
                    <option value="course">Course Preference</option>
                    <option value="home">Close to Home</option>
                    <option value="reputation">School Reputation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="guardian">Student Guardian</label>
                  <select
                    id="guardian"
                    name="guardian"
                    value={formData.guardian}
                    onChange={handleChange}
                  >
                    <option value="mother">Mother</option>
                    <option value="father">Father</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="nursery">Attended Nursery School</label>
                  <select
                    id="nursery"
                    name="nursery"
                    value={formData.nursery}
                    onChange={handleChange}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Processing Model Inference...' : '🔮 Predict Final Grade (G3)'}
            </button>
          </form>
        </div>

        {/* Prediction Results & Status Display */}
        <div className="result-column">
          {error && (
            <div className="alert-box error-alert">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {loading && (
            <div className="loading-card">
              <div className="spinner"></div>
              <h3>Generating Prediction...</h3>
              <p>Passing 32 features to Flask API &amp; Random Forest Regressor</p>
            </div>
          )}

          {predictionResult && !loading && (
            <div className="result-card">
              <div className="result-badge">Prediction Output</div>
              <h3 className="result-title">Predicted Final Grade</h3>
              <div className={`score-display ${getInterpretationClass(predictionResult.prediction)}`}>
                {predictionResult.prediction.toFixed(2)} <span className="scale-label">/ 20</span>
              </div>

              <div className="interpretation-box">
                <span className="interp-label">Performance Category:</span>
                <span className={`interp-val ${getInterpretationClass(predictionResult.prediction)}`}>
                  {predictionResult.interpretation}
                </span>
              </div>

              <div className="benchmark-guide">
                <h4>Grading Benchmark Reference:</h4>
                <ul>
                  <li><span className="badge badge-needs">0–9</span> Needs Improvement (At-Risk)</li>
                  <li><span className="badge badge-avg">10–13</span> Average Passing</li>
                  <li><span className="badge badge-good">14–16</span> Good Performance</li>
                  <li><span className="badge badge-exc">17–20</span> Excellent Distinction</li>
                </ul>
              </div>

              <div className="disclaimer-note">
                ℹ️ <em>Note: This output is generated strictly as an AI/ML academic demonstration and should not be used as an official administrative grading decision.</em>
              </div>
            </div>
          )}

          {/* Model Metrics Info Card */}
          <div className="info-card">
            <h3>🤖 Model &amp; Evaluation Metrics</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td><strong>Algorithm:</strong></td>
                  <td>Random Forest Regressor</td>
                </tr>
                <tr>
                  <td><strong>Target Variable:</strong></td>
                  <td>Final Grade (G3, 0–20 scale)</td>
                </tr>
                <tr>
                  <td><strong>R² Score:</strong></td>
                  <td><strong>0.8148</strong> (81.48% variance explained)</td>
                </tr>
                <tr>
                  <td><strong>MAE:</strong></td>
                  <td><strong>1.1646</strong> points</td>
                </tr>
                <tr>
                  <td><strong>MSE:</strong></td>
                  <td><strong>3.7977</strong></td>
                </tr>
                <tr>
                  <td><strong>RMSE:</strong></td>
                  <td><strong>1.9488</strong></td>
                </tr>
                <tr>
                  <td><strong>Trees (Estimators):</strong></td>
                  <td>100 (`random_state=42`)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dataset Info Card */}
          <div className="info-card">
            <h3>📊 Dataset Source &amp; Characteristics</h3>
            <p>
              Trained on the benchmark Portuguese Secondary Education Mathematics dataset from Kaggle / UCI Machine Learning Repository.
            </p>
            <ul className="dataset-specs">
              <li><strong>Records:</strong> 395 student profiles</li>
              <li><strong>Attributes:</strong> 33 variables (32 predictors + G3)</li>
              <li><strong>Source:</strong> Paulo Cortez &amp; Alice Silva (2008)</li>
            </ul>
            <a
              href="https://www.kaggle.com/datasets/uciml/student-alcohol-consumption"
              target="_blank"
              rel="noopener noreferrer"
              className="dataset-link"
            >
              🔗 View Dataset on Kaggle
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-card">
        <p>
          <strong>Student Performance Prediction Full-Stack Application</strong>
        </p>
        <p>
          Candidate Name: <strong>Sameeksha</strong> | IBM SkillsBuild Data Analytics with AI Academic Internship Program
        </p>
        <p>
          Conducted by <strong>BharatCares</strong> in association with <strong>AICTE</strong>
        </p>
        <p>
          <a
            href="https://github.com/sameeksha-6912/Student-Performance-Prediction-ML"
            target="_blank"
            rel="noopener noreferrer"
            className="repo-link"
          >
            GitHub Repository: sameeksha-6912/Student-Performance-Prediction-ML
          </a>
        </p>
      </footer>
    </div>
  );
}
