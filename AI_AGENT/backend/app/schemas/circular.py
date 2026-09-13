from typing import List, Optional
from pydantic import BaseModel, Field

class ActionItemSchema(BaseModel):
    id: str
    task: str
    department: str
    assigned_role: str
    due_date: str
    priority: str
    status: str
    risk_level: Optional[str] = "Medium"

class Circular(BaseModel):
    model_config = {"from_attributes": True}

    id: str = Field(..., description="Unique Circular ID", example="circ-001")
    ref_no: str = Field(..., description="Institutional Reference Number", example="CIR-2026-052")
    title: str = Field(..., description="Directive Title", example="Biometric Attendance & Leave Regularization Framework 2026")
    department: str = Field(..., description="Issuing Department", example="Academic Affairs")
    category: str = Field(..., description="Classification category", example="Policy & Compliance")
    status: str = Field(..., description="Status (Active, Superseded, Under Review, Draft)", example="Active")
    priority: str = Field(..., description="Priority level (Critical, High, Medium, Low)", example="Critical")
    published_date: str = Field(..., description="Publication date", example="2026-01-15")
    effective_date: str = Field(..., description="Date directive takes legal force", example="2026-02-01")
    expiry_date: Optional[str] = Field(None, description="Expiry date if applicable", example="2027-01-31")
    version: str = Field(..., description="Version string", example="v2.1")
    author: Optional[str] = Field(None, description="Author or issuing official")
    signatory: Optional[str] = Field(None, description="Signing executive authority")
    summary: str = Field(..., description="Executive summary of the directive")
    body: str = Field(..., description="Full text and policy guidelines")
    supersedes_id: Optional[str] = Field(None, description="ID of prior circular replaced by this directive")
    supersedes_ref: Optional[str] = Field(None, description="Ref number of prior circular")
    superseded_by_id: Optional[str] = Field(None, description="ID of superseding circular if applicable")
    superseded_by_ref: Optional[str] = Field(None, description="Ref number of superseding circular")
    target_audience: List[str] = Field(default_factory=list, description="Target departments or roles")
    tags: List[str] = Field(default_factory=list, description="Descriptive metadata tags")
    required_actions: List[str] = Field(default_factory=list, description="List of immediate compliance action requirements")
    acknowledgement_rate: float = Field(default=0.0, description="Overall recipient acknowledgement percentage")
    total_recipients: int = Field(default=0, description="Total designated recipient count")
    acknowledged_recipients: int = Field(default=0, description="Count of acknowledged recipients")
    file_attachment: Optional[str] = Field(None, description="Name or path of PDF attachment")



class CircularListResponse(BaseModel):
    items: List[Circular]
    total: int
    active_count: int
    departments: List[str]
    page: int = 1
    page_size: int = 50
