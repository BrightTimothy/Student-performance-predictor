from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router

app = FastAPI(
    title="PredictEd API",
    description="An AI-powered early warning system that predicts at-risk students using XGBoost",
    version="1.0.0"
)

# Allow frontend to talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register the predict router
app.include_router(router)

@app.get("/")
def root():
    return {"message": "PredictEd API is running"}