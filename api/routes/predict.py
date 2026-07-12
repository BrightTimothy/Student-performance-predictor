from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import shap

router = APIRouter()

# Load the trained model once when the API starts
MODEL_PATH = Path(__file__).resolve().parent.parent.parent / "models" / "xgb_model.pkl"
model = joblib.load(MODEL_PATH)
explainer = shap.TreeExplainer(model)

# Human-readable labels for each feature
FEATURE_LABELS = {
    "highest_education": "Prior education level",
    "imd_band": "Neighbourhood deprivation level",
    "age_band": "Age group",
    "num_of_prev_attempts": "Number of previous attempts",
    "studied_credits": "Course workload (credits)",
    "mean_score": "Average assessment score",
    "max_score": "Highest assessment score",
    "min_score": "Lowest assessment score",
    "number_of_takes": "Number of assessments submitted",
    "mean_weight": "Average assessment weight",
    "total_clicks": "Total platform engagement",
    "num_active_days": "Number of active days",
    "avg_daily_clicks": "Average daily engagement",
    "region_East Anglian Region": "Region: East Anglian",
    "region_East Midlands Region": "Region: East Midlands",
    "region_Ireland": "Region: Ireland",
    "region_London Region": "Region: London",
    "region_North Region": "Region: North",
    "region_North Western Region": "Region: North Western",
    "region_Scotland": "Region: Scotland",
    "region_South East Region": "Region: South East",
    "region_South Region": "Region: South",
    "region_South West Region": "Region: South West",
    "region_Wales": "Region: Wales",
    "region_West Midlands Region": "Region: West Midlands",
    "region_Yorkshire Region": "Region: Yorkshire"
}


class StudentData(BaseModel):
    highest_education: int
    imd_band: int
    age_band: int
    num_of_prev_attempts: int
    studied_credits: int
    region_East_Anglian_Region: int = Field(alias="region_East Anglian Region")
    region_East_Midlands_Region: int = Field(alias="region_East Midlands Region")
    region_Ireland: int = Field(alias="region_Ireland")
    region_London_Region: int = Field(alias="region_London Region")
    region_North_Region: int = Field(alias="region_North Region")
    region_North_Western_Region: int = Field(alias="region_North Western Region")
    region_Scotland: int = Field(alias="region_Scotland")
    region_South_East_Region: int = Field(alias="region_South East Region")
    region_South_Region: int = Field(alias="region_South Region")
    region_South_West_Region: int = Field(alias="region_South West Region")
    region_Wales: int = Field(alias="region_Wales")
    region_West_Midlands_Region: int = Field(alias="region_West Midlands Region")
    region_Yorkshire_Region: int = Field(alias="region_Yorkshire Region")
    mean_score: float
    max_score: float
    min_score: float
    number_of_takes: int
    mean_weight: float
    total_clicks: float
    num_active_days: float
    avg_daily_clicks: float


@router.post("/predict")
def predict(data: StudentData):
    # Convert incoming data to a dataframe
    input_df = pd.DataFrame([data.model_dump(by_alias=True)])

    # Make prediction
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]

    # Determine risk tier
    if probability >= 0.75:
        tier = "Critical"
    elif probability >= 0.5:
        tier = "At-Risk"
    elif probability >= 0.25:
        tier = "Watch"
    else:
        tier = "Safe"

    # Calculate SHAP values for this student
    shap_values = explainer.shap_values(input_df)

    # Pair feature names with their SHAP values
    feature_impacts = list(zip(input_df.columns, shap_values[0]))

    # Sort by absolute impact (biggest influence first)
    feature_impacts.sort(key=lambda x: abs(x[1]), reverse=True)

    # Take top 3 and format them
    top_reasons = []
    for feature, impact in feature_impacts[:3]:
        direction = "increases risk" if impact > 0 else "decreases risk"
        top_reasons.append({
            "feature": FEATURE_LABELS.get(feature, feature),
            "impact": direction
        })

    return {
        "at_risk": int(prediction),
        "risk_score": round(float(probability) * 100, 1),
        "risk_tier": tier,
        "top_reasons": top_reasons
    }