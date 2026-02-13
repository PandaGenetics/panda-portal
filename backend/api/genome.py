"""
Genome browser API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import get_db

router = APIRouter()


@router.get("/species")
async def list_species(token: dict = Depends(auth_dependency)):
    """List available species"""
    return [
        {"id": "giant_panda", "name": "Giant Panda (Ailuropoda melanoleuca)"},
        {"id": "snow_leopard", "name": "Snow Leopard (Panthera uncia)"},
    ]


@router.get("/{species}/refs")
async def list_references(species: str, token: dict = Depends(auth_dependency)):
    """List reference genomes for a species"""
    return {
        "giant_panda": [
            {
                "id": "asm92444v1",
                "name": "ASM92444v1",
                "description": "Reference genome assembly",
                "fasta_url": "/api/files/genome/giant_panda/reference/asm92444v1.fa",
                "fai_url": "/api/files/genome/giant_panda/reference/asm92444v1.fa.fai",
                "gff_url": "/api/files/genome/giant_panda/reference/asm92444v1.gff",
            }
        ]
    }


@router.get("/{species}/tracks")
async def list_tracks(species: str, token: dict = Depends(auth_dependency)):
    """List available tracks for a species"""
    return []
