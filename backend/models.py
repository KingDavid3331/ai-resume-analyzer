from pydantic import BaseModel
from typing import List


class AnalyzeResponse(BaseModel):
    score: int  # 0-100
    missing_keywords: List[str]
    suggestions: List[str]
