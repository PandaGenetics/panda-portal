"""
Tools API endpoints (BLAST, alignment, etc.)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from datetime import datetime
from db import get_db, AnalysisJob
from api.auth import auth_dependency
from services.blast_service import blast_service

router = APIRouter()


@router.post("/blast")
async def submit_blast(
    request: Dict,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Submit and run BLAST search"""
    # Validate request
    query_sequence = request.get("sequence") or request.get("query")
    if not query_sequence:
        raise HTTPException(status_code=400, detail="Sequence is required")
    
    database = request.get("database", "giant_panda")
    program = request.get("program", "blastn")
    expect = float(request.get("expect", 0.001))
    num_results = int(request.get("num_results", 20))
    
    # Run BLAST
    result = blast_service.run_blast(
        query_sequence=query_sequence,
        database=database,
        program=program,
        expect=expect,
        num_results=num_results,
    )
    
    # Create job record
    job = AnalysisJob(
        user_id=token.get("sub"),
        job_type="blast",
        status="completed",
        input_params=request,
        result_path=result.get("job_id"),
        started_at=datetime.utcnow(),
        completed_at=datetime.utcnow(),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    return {
        "job_id": job.id,
        "status": "completed",
        "result": result,
    }


@router.post("/blast/simulate")
async def submit_blast_simulate(
    request: Dict,
    token: dict = Depends(auth_dependency),
    db: Session = Depends(get_db)
):
    """Submit BLAST job (simulated)"""
    query_sequence = request.get("sequence") or request.get("query")
    if not query_sequence:
        raise HTTPException(status_code=400, detail="Sequence is required")
    
    database = request.get("database", "giant_panda")
    
    # Create job
    job = AnalysisJob(
        user_id=token.get("sub"),
        job_type="blast",
        status="pending",
        input_params=request,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    return {
        "job_id": job.id,
        "status": "pending",
        "message": "BLAST job submitted. Use GET /api/tools/blast/{job_id} to check status.",
    }


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
        "job_type": job.job_type,
        "result": job.result_path,
        "created_at": job.created_at,
        "started_at": job.started_at,
        "completed_at": job.completed_at,
    }
