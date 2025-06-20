export interface Audit {
  id: string;
  name: string;
  framework: 'ISO 27001';
  type: 'Internal' | 'Certification' | 'Surveillance' | 'Recertification';
  status: 'draft' | 'in-progress' | 'completed';
  createdAt: string;
  startDate: string;
  updatedAt: string;
  documents: Document[];
  missingDocuments: string[];
  missingInformation: MissingInformation[];
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  file: File | null;
  uploadedAt: string | null;
  status: 'pending' | 'uploaded' | 'validated' | 'invalid';
}

export type DocumentType = 
  | 'ISMS'
  | 'IT_SECURITY_POLICY'
  | 'STATEMENT_OF_APPLICABILITY'
  | 'RISK_REGISTER'
  | 'INVENTORY_OF_ASSETS'
  | 'INCIDENT_MANAGEMENT'
  | 'SECURE_DEVELOPMENT'
  | 'MANAGEMENT_REVIEW'
  | 'INTERNAL_AUDIT_REPORT'
  | 'ORGANIZATION_CHART';

export interface MissingInformation {
  requirement: string;
  isoReference: string;
  documentType: string;
  description: string;
}

export interface RequiredDocument {
  type: DocumentType;
  label: string;
  description: string;
}

export interface ISORequirement {
  requirement: string;
  isoReference: string;
  documentType: string;
}

export interface ManagementClause {
  clauseNumber: string;
  requirement: string;
  category: string;
  status: 'Acceptable' | 'Nonconformity' | 'Not Applicable';
  isManualOverride?: boolean;
  originalStatus?: 'Acceptable' | 'Nonconformity' | 'Not Applicable';
  statusOverrideJustification?: string;
  nonconformitySeverity?: NonconformitySeverity;
  documentsReferenced: DocumentReference[];
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
  isAIGenerated: boolean;
  auditorNotes?: string;
  nonConformities: NonConformity[];
  evidence: Evidence[];
}

export interface DocumentReference {
  documentId: string;
  documentName: string;
  sections: string[];
  justification: string;
}

export interface NonConformity {
  id: string;
  description: string;
  severity: 'Major' | 'Minor' | 'Observation' | 'Opportunity for Improvement';
  evidence: string;
}

export interface AnnexAControl {
  controlNumber: string;
  requirement: string;
  control: string;
  category: string;
  status: 'Acceptable' | 'Nonconformity' | 'Not Applicable';
  isManualOverride?: boolean;
  originalStatus?: 'Acceptable' | 'Nonconformity' | 'Not Applicable';
  statusOverrideJustification?: string;
  nonconformitySeverity?: NonconformitySeverity;
  documentsReferenced: DocumentReference[];
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
  isAIGenerated: boolean;
  auditorNotes?: string;
  nonConformities: NonConformity[];
  evidence: Evidence[];
}

export type NonconformitySeverity = 'Major' | 'Minor' | 'Observation' | 'Opportunity for Improvement';

export interface Evidence {
  id: string;
  fileName: string;
  uploadedAt: string;
  description: string;
  file: File | null;
}