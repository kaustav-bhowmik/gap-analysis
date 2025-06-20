import { RequiredDocument } from '../types';

export const requiredDocuments: RequiredDocument[] = [
  {
    type: 'ISMS',
    label: 'ISMS Scope Document & Information Security Policy',
    description: 'Defines the scope of the ISMS and outlines the organization\'s information security policy.'
  },
  {
    type: 'IT_SECURITY_POLICY',
    label: 'IT Security Policy',
    description: 'Outlines the rules and guidelines for securing IT systems and data.'
  },
  {
    type: 'STATEMENT_OF_APPLICABILITY',
    label: 'Statement of Applicability',
    description: 'Documents the controls from ISO 27001 Annex A that are applicable to the organization.'
  },
  {
    type: 'RISK_REGISTER',
    label: 'Risk Register',
    description: 'Risk Assessment Plan and Risk Assessment Report detailing identified risks and their treatments.'
  },
  {
    type: 'INVENTORY_OF_ASSETS',
    label: 'Inventory of Assets',
    description: 'A complete inventory of information assets within the scope of the ISMS.'
  },
  {
    type: 'INCIDENT_MANAGEMENT',
    label: 'Incident Management Procedure',
    description: 'Procedures for identifying, reporting, and managing security incidents.'
  },
  {
    type: 'SECURE_DEVELOPMENT',
    label: 'Secure Development Policy',
    description: 'Guidelines for developing secure applications and systems.'
  },
  {
    type: 'MANAGEMENT_REVIEW',
    label: 'Management Review',
    description: 'Documentation of management reviews of the ISMS.'
  },
  {
    type: 'INTERNAL_AUDIT_REPORT',
    label: 'Internal Audit Report',
    description: 'Results of internal audits conducted on the ISMS.'
  },
  {
    type: 'ORGANIZATION_CHART',
    label: 'Organization Chart',
    description: 'Structure of the organization, including roles and responsibilities related to information security.'
  }
];