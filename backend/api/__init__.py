"""
API routes package
"""
from api.auth import router as auth_router
from api.users import router as users_router
from api.genome import router as genome_router
from api.datasets import router as datasets_router
from api.tools import router as tools_router
from api.pedigree import router as pedigree_router
from api.files import router as files_router
