import { AnnexAControl } from '../types';

export const annexAControls: AnnexAControl[] = [
  {
    controlNumber: 'A.5.1',
    requirement: 'Information security policies',
    control: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties and reviewed at planned intervals and if significant changes occur.',
    category: 'Information Security Policies',
    status: 'Acceptable',
    documentsReferenced: [
      {
        documentId: '1',
        documentName: 'Information Security Policy',
        sections: ['2.1 Policy Overview', '2.2 Policy Statements'],
        justification: 'The information security policy document is comprehensive and properly approved by management.'
      }
    ],
    confidence: 'High',
    nonConformities: []
  },
  {
    controlNumber: 'A.6.1',
    requirement: 'Internal organization',
    control: 'Information security roles and responsibilities shall be defined and allocated according to the information security policy.',
    category: 'Organization of Information Security',
    status: 'Nonconformity',
    documentsReferenced: [
      {
        documentId: '2',
        documentName: 'Organization Chart',
        sections: ['1.1 Security Roles'],
        justification: 'Information security roles and responsibilities are not clearly defined.'
      }
    ],
    confidence: 'Low',
    nonConformities: [
      {
        id: 'NC002',
        description: 'Security roles and responsibilities not formally documented',
        severity: 'Major',
        evidence: 'No formal documentation of security responsibilities in job descriptions'
      }
    ]
  }
];