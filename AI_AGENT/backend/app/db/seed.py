"""
CircularFlow AI - Database Seed Script
Populates all tables with realistic institutional demo data.

IDEMPOTENT: Safe to run multiple times against PostgreSQL.
Uses Session.merge() which performs INSERT or UPDATE (upsert) based on primary key.

Usage (from backend/ directory):
    python -m app.db.seed
"""

import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import SessionLocal, engine
from app.db.base import Base
from app.models import (
    Department, User, Circular, CircularVersion,
    Recipient, Acknowledgement, ActionItem, AuditLog
)


def seed():
    """
    Idempotent seed for PostgreSQL.
    Uses db.merge() — if a record with the same primary key already exists,
    it is updated; otherwise it is inserted.  Safe to run on a populated DB.
    """
    db = SessionLocal()

    try:
        print("[SEED] Seeding CircularFlow AI PostgreSQL database...")
        print("[SEED] Using merge() strategy — safe to run multiple times.\n")

        # ── 1. Departments ────────────────────────────────────────────────────
        departments = [
            Department(id="dept-cse",   name="Computer Science & Engineering",            code="CSE",   description="B.Tech, M.Tech, Ph.D programmes in CS"),
            Department(id="dept-ece",   name="Electronics & Communication Engineering",    code="ECE",   description="Electronics, VLSI, Embedded Systems"),
            Department(id="dept-eee",   name="Electrical & Electronics Engineering",       code="EEE",   description="Power systems and electrical drives"),
            Department(id="dept-mech",  name="Mechanical Engineering",                    code="MECH",  description="Manufacturing, Thermodynamics, Robotics"),
            Department(id="dept-admin", name="Administration & Registrar Office",          code="ADMIN", description="Institutional administration and governance"),
            Department(id="dept-acad",  name="Academic Affairs & Dean's Office",           code="ACAD",  description="Academic policy, examinations, and curriculum"),
            Department(id="dept-it",    name="IT & Cyber Security",                       code="IT",    description="Campus IT infrastructure and security operations"),
            Department(id="dept-fin",   name="Finance & Accounts",                        code="FIN",   description="Budget, payroll, vendor payments"),
            Department(id="dept-safety",name="Health, Safety & Environment",               code="HSE",   description="Emergency response and campus safety"),
        ]
        for obj in departments:
            db.merge(obj)
        db.flush()
        print(f"[OK] Departments upserted:       {len(departments)}")

        # ── 2. Users ──────────────────────────────────────────────────────────
        users = [
            User(
                id="usr-reg-01", name="Dr. K. S. R. Murthy", email="registrar@vignan.ac.in",
                role="Registrar", department_id="dept-admin",
                department_name="Administration & Registrar Office",
                designation="University Registrar & Executive Admin",
                can_upload_documents=True, can_edit_documents=True,
                can_approve_directives=True, can_broadcast_nudge=True,
            ),
            User(
                id="usr-fac-01", name="Prof. K. Rajasekhar", email="hod.cse@vignan.ac.in",
                role="Faculty", department_id="dept-cse",
                department_name="Computer Science & Engineering",
                designation="Professor & Head of Department",
                can_upload_documents=True, can_edit_documents=True,
                can_approve_directives=True, can_broadcast_nudge=True,
            ),
            User(
                id="usr-stu-01", name="Vikramaditya Rao", email="vikram.22cse088@vignan.ac.in",
                role="Student", department_id="dept-cse",
                department_name="Computer Science & Engineering",
                designation="Undergraduate Student (B.Tech CSE)",
                can_upload_documents=False, can_edit_documents=False,
                can_approve_directives=False, can_broadcast_nudge=False,
            ),
        ]
        for obj in users:
            db.merge(obj)
        db.flush()
        print(f"[OK] Users upserted:             {len(users)}")

        # ── 3. Circulars ──────────────────────────────────────────────────────
        # Note: Insert superseded circulars FIRST because circ-001 FK references circ-005
        circulars = [
            # Superseded / archived circulars first (no FK deps to other circulars)
            Circular(
                id="circ-005", ref_no="CIR-2026-041",
                title="Legacy Biometric Attendance Guidelines 2024 (Superseded)",
                department="Academic Affairs", department_id="dept-acad",
                category="Policy & Compliance", status="Superseded", priority="Low",
                published_date="2024-06-10", effective_date="2024-07-01", expiry_date="2026-01-31",
                version="v1.0", author="Academic Section", signatory="Registrar",
                summary="Replaced by CIR-2026-052. Prior biometric rules lacked facial recognition provisions and real-time ERP sync.",
                body="This circular is archived and superseded. Please consult CIR-2026-052 for currently enforceable regulations.",
                superseded_by_id=None, superseded_by_ref="CIR-2026-052",
                target_audience=["All Staff"], tags=["Attendance", "Archived", "Superseded"],
                required_actions=[],
                acknowledgement_rate=100.0, total_recipients=950, acknowledged_recipients=950,
                file_attachment="CIR-2026-041_Legacy_Biometric.pdf",
            ),
            Circular(
                id="circ-006", ref_no="CIR-2026-018",
                title="Computing Lab Acceptable Usage Policy 2023 (Superseded)",
                department="IT & Cyber Security", department_id="dept-it",
                category="IT & Data Governance", status="Superseded", priority="Low",
                published_date="2023-08-15", effective_date="2023-09-01", expiry_date="2026-02-14",
                version="v1.0", author="IT Directorate", signatory="IT Director",
                summary="Replaced by CIRC-2026-089. Prior policy covered basic network access without AI or high-performance GPU governance.",
                body="Archived circular. For active GPU and AI governance requirements, refer to CIRC-2026-089.",
                superseded_by_id=None, superseded_by_ref="CIRC-2026-089",
                target_audience=["All Staff", "All Students"], tags=["IT Policy", "Superseded", "Archived"],
                required_actions=[],
                acknowledgement_rate=98.2, total_recipients=840, acknowledged_recipients=825,
                file_attachment="CIR-2026-018_Computing_Labs_2023.pdf",
            ),
            # Active and current circulars
            Circular(
                id="circ-001", ref_no="CIR-2026-052",
                title="Biometric Attendance & Leave Regularization Framework 2026",
                department="Academic Affairs", department_id="dept-acad",
                category="Policy & Compliance", status="Active", priority="Critical",
                published_date="2026-01-15", effective_date="2026-02-01", expiry_date="2027-01-31",
                version="v2.1", author="Dr. K. S. R. Murthy", signatory="Registrar & Academic Council",
                summary="Mandates mandatory 80% biometric attendance for faculty, research scholars, and undergraduate students with automated weekly payroll/hall-ticket compliance checks.",
                body="Pursuant to the resolutions of the 48th Academic Council Meeting, all constituent colleges and academic departments must enforce biometric RFID & facial recognition logging. Students with attendance below 75% without authorized medical condonation will be disbarred from end-semester examinations.",
                supersedes_id="circ-005", supersedes_ref="CIR-2026-041",
                target_audience=["All Faculty", "All Students", "Department Heads", "Dean Academics"],
                tags=["Attendance", "Biometric", "Leave Policy", "Examination Eligibility", "HRMS"],
                required_actions=["Sync departmental biometric readers to central ERP server by Jan 31.", "Display mandatory 80% attendance notice on departmental digital boards.", "Establish medical grievance desk in Dean of Student Affairs office."],
                acknowledgement_rate=94.5, total_recipients=1250, acknowledged_recipients=1181,
                file_attachment="CIR-2026-052_Biometric_Framework.pdf",
            ),
            Circular(
                id="circ-002", ref_no="CIRC-2026-089",
                title="Institutional AI Governance, Ethics & High-Performance Compute Access",
                department="IT & Cyber Security", department_id="dept-it",
                category="IT & Data Governance", status="Active", priority="Critical",
                published_date="2026-02-10", effective_date="2026-02-15", expiry_date="2027-02-14",
                version="v1.4", author="Prof. K. Rajasekhar", signatory="Chief Technology Officer & Dean Research",
                summary="Establishes ethical guidelines, responsible use charters, and cluster access protocols for Generative AI and GPU compute resources across all campus research labs.",
                body="With the deployment of the 64-GPU NVIDIA DGX cluster for university research, strict data governance protocols are established. Storing personally identifiable institutional records, unreleased exam papers, or confidential patents in third-party public AI models is strictly prohibited.",
                supersedes_id="circ-006", supersedes_ref="CIR-2026-018",
                target_audience=["Research Scholars", "CSE Faculty", "AI & Data Science Labs", "IT Staff"],
                tags=["AI Ethics", "Data Governance", "GPU Cluster", "Cyber Security", "Research Integrity"],
                required_actions=["Sign institutional compute safety undertaking before receiving SSH cluster keys.", "Audit departmental AI project code repositories for API key leaks.", "Conduct quarterly AI ethics training for post-graduate students."],
                acknowledgement_rate=89.2, total_recipients=680, acknowledged_recipients=607,
                file_attachment="CIRC-2026-089_AI_Governance_Charter.pdf",
            ),
            Circular(
                id="circ-003", ref_no="CIRC-2026-092",
                title="Revised End-Semester Exam Valuation & Moderation Directives 2026",
                department="Finance & Examination Cell", department_id="dept-fin",
                category="Policy & Compliance", status="Active", priority="High",
                published_date="2026-02-18", effective_date="2026-03-01", expiry_date="2026-12-31",
                version="v3.0", author="Controller of Examinations", signatory="Vice-Chancellor & Controller of Examinations",
                summary="Details digital script evaluation, double-blind moderation for outliers (>15% variance), and remunerations for chief examiners and evaluators.",
                body="To ensure transparency and rapid publication of semester results, all paper evaluations will transition to the On-Screen Marking (OSM) portal. Evaluators must complete a minimum quota of 40 scripts per session.",
                target_audience=["All Teaching Faculty", "Examination Cell Staff", "Department HODs"],
                tags=["Examinations", "OSM Evaluation", "Moderation", "Academic Standards"],
                required_actions=["Complete mandatory 1-hour OSM system refresher tutorial by Feb 28.", "HODs to submit verified lists of eligible course evaluators to Exam Cell."],
                acknowledgement_rate=91.0, total_recipients=520, acknowledged_recipients=473,
                file_attachment="CIRC-2026-092_Exam_Valuation_Directives.pdf",
            ),
            Circular(
                id="circ-004", ref_no="CIRC-2026-068",
                title="Laboratory Equipment Procurement & Annual Maintenance Contracts (AMC)",
                department="Operations & Logistics", department_id="dept-admin",
                category="Financial & Delegation", status="Active", priority="Medium",
                published_date="2026-01-28", effective_date="2026-02-05", expiry_date="2027-03-31",
                version="v1.2", author="Estate & Procurement Officer", signatory="Finance Officer & Registrar",
                summary="Standard Operating Procedure for departmental CAPEX requisitions, vendor vetting, and statutory calibration of laboratory instruments.",
                body="All capital asset requisitions exceeding INR 5,00,000 must include a minimum of three comparative vendor quotations, technical committee evaluation minutes, and AMC cost projections for five years.",
                target_audience=["Lab Technicians", "Department Purchase Committees", "Finance Office"],
                tags=["Procurement", "AMC", "CAPEX", "Lab Calibration", "Finance"],
                required_actions=["Submit annual calibration status reports to Central Quality Assurance Cell.", "Upload vendor service agreements into ERP Procurement Module."],
                acknowledgement_rate=86.4, total_recipients=310, acknowledged_recipients=268,
                file_attachment="CIRC-2026-068_Procurement_SOP.pdf",
            ),
            Circular(
                id="circ-007", ref_no="CIRC-2026-095",
                title="Campus Emergency Evacuation & Fire Safety Protocol (Draft Under Review)",
                department="Health & Safety", department_id="dept-safety",
                category="Safety & Security", status="Under Review", priority="Critical",
                published_date="2026-02-25", effective_date="2026-03-15", expiry_date="2028-03-14",
                version="v0.9", author="Chief Security Officer", signatory="Pending Executive Board Approval",
                summary="Standard operating procedures for emergency sirens, designated assembly areas, floor warden responsibilities, and mandatory bi-annual drill protocols.",
                body="Draft circular under administrative review. Establishes campus-wide emergency exit routes, extinguisher inspection cadences, and disabled person evacuation assistance squads for all high-rise academic blocks.",
                target_audience=["All Campus Occupants", "Security Squad", "Hostel Wardens"],
                tags=["Safety", "Emergency", "Fire Drill", "Under Review"],
                required_actions=["Review assembly zone map in Annexure II.", "Nominate 2 floor wardens per academic department."],
                acknowledgement_rate=0.0, total_recipients=0, acknowledged_recipients=0,
                file_attachment="CIRC-2026-095_Safety_Draft.pdf",
            ),
        ]

        # Now update back-references for superseded circulars
        circ5_patch = Circular(id="circ-005", superseded_by_id="circ-001")
        circ6_patch = Circular(id="circ-006", superseded_by_id="circ-002")

        for obj in circulars:
            db.merge(obj)
        db.flush()

        # Patch superseded_by_id FK after all circulars are inserted
        db.merge(circ5_patch)
        db.merge(circ6_patch)
        db.flush()
        print(f"[OK] Circulars upserted:         {len(circulars)}")

        # ── 4. Circular Versions ──────────────────────────────────────────────
        versions = [
            CircularVersion(id="ver-001-v1", circular_id="circ-001", version_number="v1.0", title="Biometric Attendance Guidelines (Initial)", change_summary="Initial release of biometric attendance mandate.", published_date="2024-06-10", created_by="Academic Section"),
            CircularVersion(id="ver-001-v2", circular_id="circ-001", version_number="v2.0", title="Biometric Attendance & Leave Regularization (Revised)", change_summary="Added RFID + facial recognition; integrated ERP sync.", published_date="2026-01-10", created_by="Dr. K. S. R. Murthy"),
            CircularVersion(id="ver-001-v3", circular_id="circ-001", version_number="v2.1", title="Biometric Attendance & Leave Regularization Framework 2026", change_summary="Added medical grievance desk provision, updated penalty clauses.", published_date="2026-01-15", created_by="Dr. K. S. R. Murthy"),
            CircularVersion(id="ver-002-v1", circular_id="circ-002", version_number="v1.0", title="AI Governance Guidelines (Draft)", change_summary="Initial draft for AI usage in classrooms.", published_date="2026-01-20", created_by="IT Directorate"),
            CircularVersion(id="ver-002-v2", circular_id="circ-002", version_number="v1.4", title="Institutional AI Governance, Ethics & HPC Access", change_summary="Extended to cover DGX GPU cluster and third-party model prohibitions.", published_date="2026-02-10", created_by="Prof. K. Rajasekhar"),
        ]
        for obj in versions:
            db.merge(obj)
        db.flush()
        print(f"[OK] Circular versions upserted: {len(versions)}")

        # ── 5. Recipients ─────────────────────────────────────────────────────
        recipients = [
            Recipient(id="rec-001", name="Prof. K. Rajasekhar",    role="HOD",     department="Computer Science & Engineering",      email="hod.cse@vignan.ac.in"),
            Recipient(id="rec-002", name="Prof. S. Narayana Rao",  role="HOD",     department="Electronics & Communication Engg",    email="hod.ece@vignan.ac.in"),
            Recipient(id="rec-003", name="Prof. D. Ramaiah",        role="HOD",     department="Electrical & Electronics Engineering", email="hod.eee@vignan.ac.in"),
            Recipient(id="rec-004", name="Prof. V. Suresh Kumar",   role="HOD",     department="Mechanical Engineering",              email="hod.mech@vignan.ac.in"),
            Recipient(id="rec-005", name="Dr. R. Priya",            role="Faculty", department="Computer Science & Engineering",      email="r.priya@vignan.ac.in"),
            Recipient(id="rec-006", name="Mr. B. Srinivas",         role="Faculty", department="Computer Science & Engineering",      email="b.srinivas@vignan.ac.in"),
            Recipient(id="rec-007", name="Vikramaditya Rao",        role="Student", department="Computer Science & Engineering",      email="vikram.22cse088@vignan.ac.in"),
            Recipient(id="rec-008", name="Anjali Priya",            role="Student", department="Electronics & Communication Engg",    email="anjali.21ece045@vignan.ac.in"),
            Recipient(id="rec-009", name="Rohan Varma",             role="Student", department="Mechanical Engineering",              email="rohan.22mech011@vignan.ac.in"),
            Recipient(id="rec-010", name="IT Support Team",         role="Staff",   department="IT & Cyber Security",                 email="itsupport@vignan.ac.in"),
        ]
        for obj in recipients:
            db.merge(obj)
        db.flush()
        print(f"[OK] Recipients upserted:        {len(recipients)}")

        # ── 6. Acknowledgements ───────────────────────────────────────────────
        acks = [
            Acknowledgement(id="ack-001", circular_id="circ-001", recipient_id="rec-001", delivery_status="Delivered", read_status="Read",   acknowledgement_status="Acknowledged", acknowledged_at="2026-01-18", last_activity="2026-01-18"),
            Acknowledgement(id="ack-002", circular_id="circ-001", recipient_id="rec-002", delivery_status="Delivered", read_status="Read",   acknowledgement_status="Acknowledged", acknowledged_at="2026-01-19", last_activity="2026-01-19"),
            Acknowledgement(id="ack-003", circular_id="circ-001", recipient_id="rec-005", delivery_status="Delivered", read_status="Read",   acknowledgement_status="Acknowledged", acknowledged_at="2026-01-20", last_activity="2026-01-20"),
            Acknowledgement(id="ack-004", circular_id="circ-001", recipient_id="rec-007", delivery_status="Delivered", read_status="Read",   acknowledgement_status="Pending",      last_activity="2026-01-17"),
            Acknowledgement(id="ack-005", circular_id="circ-002", recipient_id="rec-001", delivery_status="Delivered", read_status="Read",   acknowledgement_status="Acknowledged", acknowledged_at="2026-02-16", last_activity="2026-02-16"),
            Acknowledgement(id="ack-006", circular_id="circ-002", recipient_id="rec-010", delivery_status="Delivered", read_status="Read",   acknowledgement_status="Acknowledged", acknowledged_at="2026-02-17", last_activity="2026-02-17"),
            Acknowledgement(id="ack-007", circular_id="circ-003", recipient_id="rec-003", delivery_status="Delivered", read_status="Unread", acknowledgement_status="Pending",      last_activity="2026-02-20"),
            Acknowledgement(id="ack-008", circular_id="circ-004", recipient_id="rec-004", delivery_status="Delivered", read_status="Read",   acknowledgement_status="Acknowledged", acknowledged_at="2026-02-08", last_activity="2026-02-08"),
        ]
        for obj in acks:
            db.merge(obj)
        db.flush()
        print(f"[OK] Acknowledgements upserted:  {len(acks)}")

        # ── 7. Action Items ───────────────────────────────────────────────────
        actions = [
            ActionItem(id="act-001", action_id="ACT-2026-001", title="Sync biometric readers to ERP",       description="All departmental biometric RFID readers must be connected to central ERP by Jan 31.", source_circular_id="circ-001", source_circular_ref="CIR-2026-052", responsible_role="IT Coordinator",   responsible_department="IT & Cyber Security",           deadline="2026-01-31", priority="Critical", status="COMPLETED",    completed_at=datetime(2026, 1, 30)),
            ActionItem(id="act-002", action_id="ACT-2026-002", title="Display 80% attendance notice",       description="Post digital notice boards displaying mandatory 80% attendance requirement.",         source_circular_id="circ-001", source_circular_ref="CIR-2026-052", responsible_role="HOD",               responsible_department="Academic Affairs",               deadline="2026-02-05", priority="High",     status="COMPLETED",    completed_at=datetime(2026, 2, 4)),
            ActionItem(id="act-003", action_id="ACT-2026-003", title="Sign GPU cluster safety undertaking", description="All research staff must sign institutional compute safety undertaking before SSH key issuance.", source_circular_id="circ-002", source_circular_ref="CIRC-2026-089", responsible_role="Researcher",        responsible_department="Computer Science & Engineering", deadline="2026-02-28", priority="Critical", status="IN_PROGRESS"),
            ActionItem(id="act-004", action_id="ACT-2026-004", title="Complete OSM refresher tutorial",     description="All faculty evaluators must complete 1-hour On-Screen Marking system refresher before Feb 28.", source_circular_id="circ-003", source_circular_ref="CIRC-2026-092", responsible_role="Faculty",           responsible_department="Academic Affairs",               deadline="2026-02-28", priority="High",     status="OVERDUE"),
            ActionItem(id="act-005", action_id="ACT-2026-005", title="Submit calibration status reports",   description="Submit annual calibration status reports for all ISO-certified labs to Quality Assurance Cell.", source_circular_id="circ-004", source_circular_ref="CIRC-2026-068", responsible_role="Lab Technician",    responsible_department="Operations & Logistics",         deadline="2026-03-31", priority="Medium",   status="NOT_STARTED"),
            ActionItem(id="act-006", action_id="ACT-2026-006", title="Nominate floor wardens",              description="Each department must nominate 2 floor wardens as per draft evacuation protocol.",          source_circular_id="circ-007", source_circular_ref="CIRC-2026-095", responsible_role="HOD",               responsible_department="Health & Safety",                deadline="2026-03-10", priority="Critical", status="NOT_STARTED"),
            ActionItem(id="act-007", action_id="ACT-2026-007", title="Audit AI code repositories",          description="Audit departmental AI project code repositories for embedded API key leaks.",             source_circular_id="circ-002", source_circular_ref="CIRC-2026-089", responsible_role="IT Coordinator",    responsible_department="IT & Cyber Security",            deadline="2026-03-15", priority="High",     status="OVERDUE"),
            ActionItem(id="act-008", action_id="ACT-2026-008", title="Submit evaluator list to Exam Cell",  description="HODs to submit verified lists of eligible course evaluators to Exam Cell.",               source_circular_id="circ-003", source_circular_ref="CIRC-2026-092", responsible_role="HOD",               responsible_department="Academic Affairs",               deadline="2026-02-25", priority="High",     status="COMPLETED",    completed_at=datetime(2026, 2, 24)),
        ]
        for obj in actions:
            db.merge(obj)
        db.flush()
        print(f"[OK] Actions upserted:           {len(actions)}")

        # ── 8. Audit Logs ─────────────────────────────────────────────────────
        audit_logs = [
            AuditLog(id="log-001", event_type="CIRCULAR_PUBLISHED",       description="Circular CIR-2026-052 published and distributed to 1250 recipients.",  user_role="Registrar", user_name="Dr. K. S. R. Murthy",    related_circular_id="circ-001", timestamp=datetime(2026, 1, 15, 10, 0)),
            AuditLog(id="log-002", event_type="CIRCULAR_PUBLISHED",       description="Circular CIRC-2026-089 published and distributed to 680 recipients.",   user_role="Registrar", user_name="Dr. K. S. R. Murthy",    related_circular_id="circ-002", timestamp=datetime(2026, 2, 10, 9, 30)),
            AuditLog(id="log-003", event_type="ACKNOWLEDGEMENT_RECEIVED", description="HOD CSE acknowledged CIR-2026-052 digitally.",                         user_role="Faculty",   user_name="Prof. K. Rajasekhar",    related_circular_id="circ-001", timestamp=datetime(2026, 1, 18, 14, 0)),
            AuditLog(id="log-004", event_type="ACTION_COMPLETED",         description="ACT-2026-001: Biometric ERP sync completed ahead of deadline.",         user_role="Staff",     user_name="IT Support Team",        related_circular_id="circ-001", timestamp=datetime(2026, 1, 30, 16, 45)),
            AuditLog(id="log-005", event_type="CIRCULAR_SUPERSEDED",      description="CIR-2026-041 superseded by CIR-2026-052 effective 2026-02-01.",         user_role="Registrar", user_name="Dr. K. S. R. Murthy",    related_circular_id="circ-005", timestamp=datetime(2026, 2, 1, 0, 0)),
            AuditLog(id="log-006", event_type="ACTION_OVERDUE",           description="ACT-2026-004: OSM tutorial completion deadline passed, HODs notified.", user_role="System",    user_name="Cira AI Engine",         related_circular_id="circ-003", timestamp=datetime(2026, 3, 1, 8, 0)),
            AuditLog(id="log-007", event_type="LOGIN",                    description="User login: Dr. K. S. R. Murthy (Registrar) at 09:12 IST.",            user_role="Registrar", user_name="Dr. K. S. R. Murthy",    timestamp=datetime(2026, 3, 5, 9, 12)),
            AuditLog(id="log-008", event_type="CIRCULAR_DRAFT_CREATED",   description="Draft CIRC-2026-095 (Fire Safety) created and sent for executive review.", user_role="Staff", user_name="Chief Security Officer", related_circular_id="circ-007", timestamp=datetime(2026, 2, 25, 11, 30)),
        ]
        for obj in audit_logs:
            db.merge(obj)

        db.commit()

        print("\n[DONE] Seed complete! Summary:")
        print(f"   Departments:       {len(departments)}")
        print(f"   Users:             {len(users)}")
        print(f"   Circulars:         {len(circulars)}")
        print(f"   Circular Versions: {len(versions)}")
        print(f"   Recipients:        {len(recipients)}")
        print(f"   Acknowledgements:  {len(acks)}")
        print(f"   Actions:           {len(actions)}")
        print(f"   Audit Logs:        {len(audit_logs)}")

    except Exception as exc:
        db.rollback()
        print(f"\n[ERROR] Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
