"""
Genome browser API endpoints (Public access)
"""
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
from config import settings

router = APIRouter()


@router.get("/species")
async def list_species():
    """List available species"""
    return [
        {"id": "giant_panda", "name": "Giant Panda (Ailuropoda melanoleuca)"},
        {"id": "snow_leopard", "name": "Snow Leopard (Panthera uncia)"},
    ]


@router.get("/{species}/refs")
async def list_references(species: str):
    """List reference genomes for a species"""
    if species == "giant_panda":
        return [
            {
                "id": "ASM200744v3_complete",
                "name": "ASM200744v3 (Complete)",
                "description": f"Giant Panda Reference Genome ASM200744v3 - Full chromosome set",
                "fasta_url": f"/api/files/genome/{species}/reference/ASM200744v3_complete.fa",
                "fai_url": f"/api/files/genome/{species}/reference/ASM200744v3_complete.fa.fai",
                "gff_url": f"/api/files/genome/{species}/annotation/genes_complete.gff3",
                "chromosomes": 21,
                "total_length": "22.4 Gb",
            },
            {
                "id": "ASM200744v3",
                "name": "ASM200744v3 (Test)",
                "description": f"Giant Panda Reference Genome Assembly ASM200744v3 (Test Data - 8 chromosomes)",
                "fasta_url": f"/api/files/genome/{species}/reference/ASM200744v3.fa",
                "fai_url": f"/api/files/genome/{species}/reference/ASM200744v3.fa.fai",
                "gff_url": f"/api/files/genome/{species}/annotation/genes.gff3",
                "chromosomes": 8,
                "total_length": "8.4 Kb",
            }
        ]
    return [
        {
            "id": "chr1",
            "name": "Chromosome 1",
            "description": f"Chromosome 1 for {species.replace('_', ' ').title()}",
            "fasta_url": f"/api/files/genome/{species}/reference/chr1.fa",
            "fai_url": f"/api/files/genome/{species}/reference/chr1.fa.fai",
        }
    ]


@router.get("/{species}/tracks")
async def list_tracks(species: str):
    """List available tracks for a species"""
    return []
