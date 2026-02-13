"""
Tools API endpoints (BLAST, alignment, etc.)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from datetime import datetime
from db import get_db, AnalysisJob

router = APIRouter()


@router.post("/blast")
async def submit_blast(
    request: Dict,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Submit BLAST job"""
    job = AnalysisJob(
        user_id=token.get("sub"),
        job_type="blast",
        status="pending",
        input_params=request,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"job_id": job.id, "status": "pending"}


@router.get("/blast/{job_id}")
async def get_blast_result(
    job_id: int,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Get BLAST job status/result"""
    job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "job_id": job.id,
        "status": job.status,
        "result": job.result_path,
        "created_at": job.created_at,
        "completed_at": job.completed_at,
    }
