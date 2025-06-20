import { ManagementClause } from '../types';

export const managementClauses: ManagementClause[] = [
  {
    clauseNumber: '4.1',
    requirement: 'Understanding the organization and its context',
    category: 'Context of the Organization',
    status: 'Acceptable',
    documentsReferenced: [
      {
        documentId: '1',
        documentName: 'ISMS Scope Document',
        sections: ['1.2 Organizational Context', '1.3 External Factors'],
        justification: 'The document clearly defines internal and external issues relevant to the organization\'s purpose.'
      }
    ],
    confidence: 'High',
    nonConformities: []
  },
  {
    clauseNumber: '4.2',
    requirement: 'Understanding the needs and expectations of interested parties',
    category: 'Context of the Organization',
    status: 'Nonconformity',
    documentsReferenced: [
      {
        documentId: '2',
        documentName: 'Stakeholder Analysis',
        sections: ['2.1 Stakeholder Identification'],
        justification: 'Stakeholder requirements are not fully documented or regularly reviewed.'
      }
    ],
    confidence: 'Low',
    nonConformities: [
      {
        id: 'NC001',
        description: 'No formal process for regular review of stakeholder requirements',
        severity: 'Minor',
        evidence: 'Last stakeholder review was conducted over 12 months ago'
      }
    ]
  }
];