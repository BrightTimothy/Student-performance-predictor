# 🎓 Student Performance Predictor

An AI-powered early warning system that identifies at-risk university students before they fail or drop out — giving academic advisors a weekly shortlist of who needs attention and exactly why.

Built with Python, XGBoost, SHAP, and FastAPI. Trained on the [Open University Learning Analytics Dataset (OULAD)](https://analyse.kmi.open.ac.uk/open-dataset).

---

## 📌 Problem

Universities lose students to academic failure and dropout every semester. By the time a student is visibly struggling, it is often too late to intervene effectively. Academic advisors are stretched thin and have no systematic way to know which students need attention first.

This system changes that — flagging at-risk students early, with clear and explainable reasons, so advisors can act before a student fails.

---

## ✨ Features

- **Risk scoring** — every student receives a risk score (0–100) and a tier: `Safe`, `Watch`, `At-Risk`, or `Critical`
- **Explainable predictions** — SHAP values surface the top 3 reasons behind each flag (e.g. "attendance dropped 30% this month")
- **Advisor dashboard** — a clean web interface showing a ranked list of students by risk, with semester trend charts
- **Weekly digest** — automated email report sent to department heads every Monday morning
- **No black boxes** — every prediction can be traced back to specific, actionable student behaviours

---

## 🗂️ Project Structure

```
student-performance-predictor/
│
├── data/
│   ├── raw/                  # Original OULAD CSVs (not tracked by git)
│   └── processed/            # Cleaned, merged feature tables
│
├── notebooks/
│   ├── 01_eda.ipynb          # Exploratory data analysis
│   ├── 02_feature_eng.ipynb  # Feature engineering & merging tables
│   ├── 03_modelling.ipynb    # Model training & evaluation
│   └── 04_shap_analysis.ipynb # Explainability analysis
│
├── models/
│   └── xgb_model.pkl         # Saved trained model (not tracked by git)
│
├── api/
│   ├── main.py               # FastAPI app entry point
│   └── routes/
│       ├── predict.py        # Prediction endpoint
│       └── students.py       # Student data endpoints
│
├── dashboard/                # Frontend (React or Streamlit)
│
├── tests/
│   ├── test_model.py
│   └── test_api.py
│
├── docs/
│   ├── proposal.md           # University pitch/proposal
│   └── data_access_agreement_template.md
│
├── .env.example              # Environment variable template
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 📊 Dataset

This project uses the **Open University Learning Analytics Dataset (OULAD)**.

| Table | Description |
|---|---|
| `studentInfo.csv` | Demographics and final results (target label) |
| `studentAssessment.csv` | Assignment scores and submission dates |
| `studentVle.csv` | Click-level engagement with the learning platform |

**To get the data:**
1. Download from [https://analyse.kmi.open.ac.uk/open-dataset](https://analyse.kmi.open.ac.uk/open-dataset)
2. Extract all CSV files into `data/raw/`
3. Run `notebooks/01_eda.ipynb` to verify the load

> ⚠️ Raw data is excluded from this repository via `.gitignore`. Never commit student data to a public repository.

---

## 🧠 Model

| Detail | Value |
|---|---|
| Algorithm | XGBoost Classifier |
| Target | `final_result` (Pass / Fail / Withdrawn / Distinction) |
| Key features | Prior GPA, attendance rate, assignment submission rate, VLE click activity, year of study |
| Explainability | SHAP values per prediction |
| Primary metric | Recall on at-risk class (missing a struggling student is worse than a false alarm) |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/student-performance-predictor.git
cd student-performance-predictor
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add your environment variables

```bash
cp .env.example .env
# Then fill in your values inside .env
```

### 5. Add the dataset

Download OULAD CSVs and place them in `data/raw/`. See the [Dataset](#-dataset) section above.

### 6. Run the notebooks in order

```
notebooks/01_eda.ipynb
notebooks/02_feature_eng.ipynb
notebooks/03_modelling.ipynb
notebooks/04_shap_analysis.ipynb
```

### 7. Start the API

```bash
uvicorn api.main:app --reload
```

API will be live at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Get risk score for a single student |
| `GET` | `/students` | List all students with risk tiers |
| `GET` | `/students/{id}` | Get full risk profile for one student |
| `GET` | `/digest/weekly` | Generate the weekly advisor digest |

---

## 🛡️ Ethics & Privacy

- All student data used in development is **anonymised** — no names, emails, or identifying information
- Model predictions are **advisory only** — final decisions always rest with a human advisor
- SHAP explanations ensure the system is **transparent and auditable**
- Data access obtained under a formal **research data agreement** with the university

---

## 🗺️ Roadmap

- [x] Project scaffold and folder structure
- [ ] Exploratory data analysis (EDA)
- [ ] Feature engineering — merge OULAD tables
- [ ] Train and evaluate XGBoost model
- [ ] SHAP explainability layer
- [ ] FastAPI backend
- [ ] Advisor dashboard (frontend)
- [ ] Automated weekly email digest
- [ ] Pilot with one university department
- [ ] Formal proposal and stipend agreement

---

## 🤝 Contributing

This project is under active development as part of a university internship initiative. If you are an advisor, lecturer, or developer interested in collaborating, please open an issue or reach out directly.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Akpan, Bright Timothy**
AI/ML Engineer | [GitHub](https://github.com/BrightTimothy) | [LinkedIn](www.linkedin.com/in/brighttimothy)

> *Built to help universities keep their students.*