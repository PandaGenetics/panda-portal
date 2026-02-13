"""
Role-based access control utilities
"""
from typing import List, Dict
from dataclasses import dataclass


@dataclass
class Role:
    name: str
    description: str
    permissions: List[str]


# Define all roles and their permissions
ROLES: Dict[str, Role] = {
    "public": Role(
        name="public",
        description="Public user",
        permissions=[
            "view_public_datasets",
            "use_genome_browser",
        ]
    ),
    "registered": Role(
        name="registered",
        description="Registered user",
        permissions=[
            "view_public_datasets",
            "use_genome_browser",
            "download_datasets",
            "save_analysis",
            "view_history",
        ]
    ),
    "researcher": Role(
        name="researcher",
        description="Verified researcher",
        permissions=[
            "view_public_datasets",
            "use_genome_browser",
            "download_datasets",
            "save_analysis",
            "view_history",
            "use_blast",
            "create_analysis",
            "private_workspace",
        ]
    ),
    "collaborator": Role(
        name="collaborator",
        description="Project collaborator",
        permissions=[
            "view_public_datasets",
            "use_genome_browser",
            "download_datasets",
            "save_analysis",
            "view_history",
            "use_blast",
            "create_analysis",
            "private_workspace",
            "access_shared_datasets",
            "team_workspace",
        ]
    ),
    "admin": Role(
        name="admin",
        description="Administrator",
        permissions=[
            "*",  # All permissions
        ]
    ),
}


def get_role_permissions(role_name: str) -> List[str]:
    """Get permissions for a role"""
    role = ROLES.get(role_name)
    if not role:
        return ROLES["public"].permissions
    return role.permissions


def can_access_dataset(
    user_role: str,
    dataset_access_level: str,
    user_permissions: List[str] = None
) -> bool:
    """Check if user can access a dataset"""
    access_hierarchy = {
        "public": 0,
        "registered": 1,
        "researcher": 2,
        "collaborator": 3,
        "admin": 4,
    }
    
    user_level = access_hierarchy.get(user_role, 0)
    required_level = access_hierarchy.get(dataset_access_level, 1)
    
    return user_level >= required_level


def check_permission(
    user_permissions: List[str],
    required_permission: str
) -> bool:
    """Check if user has a specific permission"""
    if "*" in user_permissions:
        return True
    return required_permission in user_permissions
