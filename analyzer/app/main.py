from fastapi import FastAPI
from pydantic import BaseModel, Field

from .matcher import analyze


app = FastAPI(title="Job Description Analyzer")


class AnalyzeRequest(BaseModel):
    jobDescription: str = Field(min_length=1)
    resumeSkills: list[str] = []


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze_endpoint(req: AnalyzeRequest):
    return analyze(req.jobDescription, req.resumeSkills)