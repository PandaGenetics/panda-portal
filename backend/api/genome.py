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
                "id": "ASM200744v3_real",
                "name": "ASM200744v3 (Real Test Data)",
                "description": "Giant Panda Reference Genome ASM200744v3 - Test data with representative sequences",
                "fasta_url": f"/api/files/genome/{species}/reference/ASM200744v3_genomic.fna",
                "fai_url": f"/api/files/genome/{species}/reference/ASM200744v3_genomic.fna.fai",
                "gff_url": f"/api/files/genome/{species}/annotation/genes.gff3",
                "chromosomes": 22,
                "total_length": "30.5 Mb (sample)",
                "genes": 47140,
                "data_source": "Test data based on ASM200744v3",
            },
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
