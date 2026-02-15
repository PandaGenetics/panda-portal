"""
Database initialization script
"""
from db.connection import engine, Base, SessionLocal
from db.models import User, Role, Dataset, AnalysisJob, PedigreeRecord, UserSession


def init_db():
    """Create all tables and default roles"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    print("✅ All tables created successfully!")
    
    # Create default roles
    db = SessionLocal()
    
    try:
        # Check if roles exist
        public_role = db.query(Role).filter(Role.name == "public").first()
        if not public_role:
            public_role = Role(
                name="public",
                description="Public user",
                permissions=["view_public_datasets", "use_genome_browser"]
            )
            db.add(public_role)
            print("✅ Created 'public' role")
        
        registered_role = db.query(Role).filter(Role.name == "registered").first()
        if not registered_role:
            registered_role = Role(
                name="registered",
                description="Registered user",
                permissions=["view_public_datasets", "use_genome_browser", "download_datasets", "save_analysis", "view_history"]
            )
            db.add(registered_role)
            print("✅ Created 'registered' role")
        
        researcher_role = db.query(Role).filter(Role.name == "researcher").first()
        if not researcher_role:
            researcher_role = Role(
                name="researcher",
                description="Researcher",
                permissions=["view_public_datasets", "use_genome_browser", "download_datasets", "save_analysis", "view_history", "use_blast", "create_analysis", "private_workspace"]
            )
            db.add(researcher_role)
            print("✅ Created 'researcher' role")
        
        collaborator_role = db.query(Role).filter(Role.name == "collaborator").first()
        if not collaborator_role:
            collaborator_role = Role(
                name="collaborator",
                description="Collaborator",
                permissions=["view_public_datasets", "use_genome_browser", "download_datasets", "save_analysis", "view_history", "use_blast", "create_analysis", "private_workspace", "access_shared_datasets", "team_workspace"]
            )
            db.add(collaborator_role)
            print("✅ Created 'collaborator' role")
        
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            admin_role = Role(
                name="admin",
                description="Administrator",
                permissions=["*"]
            )
            db.add(admin_role)
            print("✅ Created 'admin' role")
        
        db.commit()
        print("✅ All default roles created!")
        
    finally:
        db.close()


if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization complete!")
