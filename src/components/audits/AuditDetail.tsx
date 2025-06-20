import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, FileText, BrainCircuit, CheckSquare, BarChart, Clock } from 'lucide-react';
import { Audit, Document, MissingInformation } from '../../types';
import { requiredDocuments } from '../../data/requiredDocuments';
import ISOAssessment from './ISOAssessment';
import { isoRequirements } from '../../data/isoRequirements';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import DocumentUploadSection from './DocumentUploadSection';

interface AuditDetailProps {
  audits: Audit[];
  onUpdateAudit: (updatedAudit: Audit) => void;
}

const AuditDetail: React.FC<AuditDetailProps> = ({ audits, onUpdateAudit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('documents');
  const [analysisState, setAnalysisState] = useState<{ complete: any[]; incomplete: any[]; } | null>(null);
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);

  const audit = audits.find((a) => a.id === id);

  useEffect(() => {
    if (analysisState) {
      onUpdateAudit({
        ...audit!,
        missingInformation: analysisState.incomplete.map(item => ({
          requirement: item.requirement,
          isoReference: item.isoReference,
          documentType: item.documentType,
          description: `Missing required information for ${item.requirement}`
        }))
      });
    }
  }, [analysisState]);

  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">Audit not found</p>
        <Button onClick={() => navigate('/audits')}>Back to Audits</Button>
      </div>
    );
  }

  const handleDocumentUpdate = (updatedDocument: Document) => {
    // Find existing document or add new one
    let updatedDocuments = [...audit.documents];
    const existingIndex = updatedDocuments.findIndex(doc => 
      doc.name.toLowerCase() === updatedDocument.name.toLowerCase()
    );
    
    if (existingIndex >= 0) {
      updatedDocuments[existingIndex] = updatedDocument;
    } else {
      updatedDocuments.push(updatedDocument);
    }
    
    const updatedAudit = {
      ...audit,
      documents: updatedDocuments,
      updatedAt: new Date().toISOString(),
    };
    
    onUpdateAudit(updatedAudit);
  };

  const getUploadedDocumentsCount = () => {
    return audit.documents.filter((doc) => doc.status === 'validated').length;
  };

  const getTotalDocumentsCount = () => {
    return audit.documents.length;
  };

  const getMissingDocumentsCount = () => {
    return audit.documents.filter((doc) => doc.status === 'pending').length;
  };

  const isAllDocumentsValidated = audit.documents.every(
    (doc) => doc.status === 'validated'
  );
  
  const getAuditStatus = () => {
    // Get unique validated documents
    const validatedDocs = audit.documents.filter(doc => doc.status === 'validated');
    const uniqueValidatedDocs = Array.from(new Set(validatedDocs.map(doc => doc.name)));
    const validatedCount = uniqueValidatedDocs.length;
    const totalDocsCount = requiredDocuments.length;
    const remainingCount = totalDocsCount - validatedCount;
    
    if (validatedCount === 0) {
      return {
        status: 'Draft',
        description: 'New Audit Created - No documents uploaded',
        icon: <Clock className="h-10 w-10 text-gray-500 mr-4" />,
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
    }
    
    if (validatedCount > 0 && validatedCount < totalDocsCount) {
      return {
        status: 'Documentation Pending',
        description: `${remainingCount} of ${totalDocsCount} documents needed`,
        icon: <AlertTriangle className="h-10 w-10 text-yellow-500 mr-4" />,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }
    
    if (remainingCount === 0 && analysisState) {
      return {
        status: 'Documents Analysed',
        description: 'ISO assessment ready',
        icon: <CheckSquare className="h-10 w-10 text-green-500 mr-4" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }

    if (remainingCount === 0) {
      return {
        status: 'Documents Uploaded',
        description: 'Ready for analysis',
        icon: <BrainCircuit className="h-10 w-10 text-blue-500 mr-4" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }
  };
  
  const auditStatus = getAuditStatus();

  // Mock missing information for demo
  const mockMissingInformation: MissingInformation[] = [
    {
      requirement: 'Information security policy',
      isoReference: 'Clause 5.2',
      documentType: 'Information Security Policy',
      description: 'The uploaded document doesn\'t include the management statement of commitment to information security.'
    },
    {
      requirement: 'Risk assessment process',
      isoReference: 'Clause 6.1.2',
      documentType: 'Risk Assessment and Treatment Methodology',
      description: 'The risk assessment criteria are not clearly defined in the document.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/audits')}
            className="p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{audit.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-600">{audit.framework}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">Started {new Date(audit.startDate).toLocaleDateString()}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{audit.type}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            leftIcon={<BarChart size={18} />}
            onClick={() => navigate(`/audits/${audit.id}/report`)}
            disabled={!isAssessmentCompleted}
          >
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${auditStatus.bgColor} ${auditStatus.borderColor}`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              {auditStatus.icon}
              <div>
                <p className="text-sm font-medium text-gray-800">Audit Status</p>
                <p className="text-2xl font-bold text-gray-900">{auditStatus.status}</p>
                <p className="text-sm text-gray-700 mt-1">{auditStatus.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('missing-info')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'missing-info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Missing Information
          </button>
          <button
            onClick={() => setActiveTab('iso-assessment')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'iso-assessment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ISO 27001 Assessment
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'documents' && (
          <DocumentUploadSection
            documents={audit.documents}
            onDocumentUpdate={(doc) => {
              handleDocumentUpdate(doc);
              setAnalysisState(null);
            }}
            onAnalysisComplete={setAnalysisState}
            auditId={audit.id}
          />
        )}

        {activeTab === 'missing-info' && (
          <div className="space-y-4">
            {auditStatus.status === 'Draft' ? (
              <Alert variant="info" title="Documentation Analysis">
                <p>Based on the ISO 27001 requirements, the following documentation needs to be provided. Each section includes detailed recommendations and potential sources.</p>
                <div className="mt-4 space-y-4">
                  {isoRequirements.map((req, index) => (
                    <Card key={index} className="border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="text-base font-medium text-gray-900">{req.requirement}</h3>
                            <p className="mt-2 text-sm text-gray-600">{getRequirementAnalysis(req.documentType)}</p>
                            <div className="mt-2 flex flex-wrap text-xs text-gray-500 space-x-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">ISO Ref: {req.isoReference}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Required Document: {req.documentType}</span>
                            </div>
                            <div className="mt-3 bg-blue-50 p-3 rounded-md">
                              <h4 className="text-sm font-medium text-blue-900">Where to find this information:</h4>
                              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                                {getDocumentationSources(req.documentType).map((source, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{source}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Alert>
            ) : auditStatus.status === 'Documentation Pending' ? (
              <>
                <Alert variant="warning" title="Missing Information Detected">
                  <p>The following information is required but missing or incomplete in your uploaded documents.</p>
                  <div className="mt-4">
                    <Button
                      onClick={() => setActiveTab('documents')}
                      leftIcon={<FileText size={18} />}
                    >
                      Upload Missing Documents
                    </Button>
                  </div>
                </Alert>
                
                <div className="space-y-4">
                  {isoRequirements.filter(req => 
                    !audit.documents.some(doc => 
                      doc.status === 'validated' && doc.name.toLowerCase().includes(req.documentType.toLowerCase())
                    )
                  ).map((item, index) => (
                    <Card key={index} className="border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="text-base font-medium text-gray-900">{item.requirement}</h3>
                            <div className="mt-2 flex flex-wrap text-xs text-gray-500 space-x-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">ISO Ref: {item.isoReference}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Document: {item.documentType}</span>
                              <button
                                onClick={() => setActiveTab('documents')}
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                              >
                                Upload Document →
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Alert variant="success" title="No Missing Information">
                <p>All required information is present in the uploaded documents. You can proceed with the assessment.</p>
              </Alert>
            )}
          </div>
        )}

        {activeTab === 'iso-assessment' && (
          <ISOAssessment
            isAssessmentStarted={isAssessmentStarted}
            onStartAssessment={() => {
              setIsAssessmentStarted(true);
              setIsAssessmentCompleted(true);
              setAnalysisState({ complete: [], incomplete: [] });
              onUpdateAudit({
                ...audit,
                status: 'completed'
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

const getRequirementAnalysis = (documentType: string): string => {
  const analyses: Record<string, string> = {
    'ISMS Scope document': 'This document should clearly define the boundaries of your information security management system. Include details about organizational units, locations, assets, technologies, and business processes within scope.',
    'Information Security Policy': 'The policy should include: (1) Management commitment statement signed by senior leadership, (2) High-level security objectives aligned with business goals, (3) Framework for risk assessment and control implementation, (4) Compliance requirements and consequences of violations, (5) Review and update procedures.',
    'Risk Assessment and Treatment Methodology': 'Document your systematic approach to identifying, analyzing, and treating information security risks. Include risk acceptance criteria, assessment scales, and treatment options.',
    'Statement of Applicability': 'For each Annex A control: (1) Document if it\'s applicable or not, (2) Provide detailed justification for inclusion/exclusion, (3) Current implementation status, (4) Control owner, (5) Implementation evidence, (6) Measurement metrics.',
    'Risk Treatment Plan': 'Detail specific actions, resources, responsibilities, and timelines for implementing security controls to address identified risks.',
    'List of Security Objectives': 'Each objective should specify: (1) Measurable targets, (2) Timeline for achievement, (3) Required resources, (4) Responsible parties, (5) Success criteria, (6) Monitoring and reporting frequency.',
    'Risk Assessment & Treatment Report': 'Present findings from your risk assessment process, including identified threats, vulnerabilities, potential impacts, and selected treatment options.',
    'Inventory of Assets': 'For each asset document: (1) Unique identifier, (2) Type and classification, (3) Owner and custodian, (4) Location, (5) Business value, (6) Security classification, (7) Handling requirements, (8) Backup requirements, (9) Access restrictions.',
    'IT Security Policy': 'Specify technical security requirements, acceptable use guidelines, and specific controls for protecting information assets.',
    'Incident Management Procedure': 'Include: (1) Incident classification criteria, (2) Reporting procedures and contacts, (3) Response team structure, (4) Investigation process, (5) Communication templates, (6) Escalation procedures, (7) Recovery steps, (8) Post-incident review process.',
    'Secure Development Policy': 'Establish security requirements and practices for software development and system engineering activities.',
    'Organization Chart': 'Should cover: (1) Information security roles and reporting lines, (2) Security committee structure, (3) Role descriptions and responsibilities, (4) Delegation of authority, (5) Segregation of duties, (6) Security-related competency requirements.'
  };
  return analyses[documentType] || 'Detailed analysis not available for this document type.';
};

const getDocumentationSources = (documentType: string): string[] => {
  const sources: Record<string, string[]> = {
    'ISMS Scope document': [
      'Business strategy documents and organizational charts',
      'Network diagrams and system architecture documentation (check with IT infrastructure team)',
      'Process maps and business flow diagrams',
      'Contracts with external service providers (consult legal department)',
      'Data flow diagrams (work with system architects)',
      'Business continuity documentation'
    ],
    'Information Security Policy': [
      'Corporate governance documentation',
      'Regulatory compliance requirements',
      'Industry best practices and standards (ISO 27002 guidance)',
      'Previous security policies and procedures',
      'Board meeting minutes discussing security strategy',
      'Annual security reports and assessments'
    ],
    'Risk Assessment and Treatment Methodology': [
      'Industry standard risk assessment frameworks (e.g., ISO 27005)',
      'Previous risk assessments and audit reports',
      'Business impact analysis documents',
      'Threat intelligence reports',
      'Security incident history and trends',
      'Vendor risk assessments'
    ],
    'Statement of Applicability': [
      'Current security controls documentation',
      'Risk assessment results',
      'Compliance requirements documentation',
      'Technical configuration standards'
    ],
    'Risk Treatment Plan': [
      'Project management documentation',
      'Security improvement initiatives',
      'Budget and resource allocation documents',
      'Technology roadmap'
    ],
    'Inventory of Assets': [
      'IT asset management system',
      'Configuration management database (CMDB)',
      'Data flow diagrams',
      'Network discovery scan results'
    ],
    'IT Security Policy': [
      'Current technical standards and procedures',
      'Industry security guidelines',
      'Vendor security recommendations (collect from key technology providers)',
      'Security incident history',
      'System configuration baselines',
      'Network security architecture documents'
    ],
    'Incident Management Procedure': [
      'Previous incident reports and lessons learned',
      'Business continuity plans',
      'Emergency contact lists',
      'Escalation procedures',
      'Incident response playbooks',
      'Communication templates and procedures',
      'Service level agreements for incident response'
    ],
    'Secure Development Policy': [
      'Development team documentation',
      'Application security testing reports',
      'Secure coding guidelines',
      'Security requirements specifications',
      'DevSecOps procedures and tools documentation',
      'Security testing methodologies',
      'Code review guidelines'
    ],
    'Organization Chart': [
      'HR organizational structure documents',
      'Role descriptions and responsibilities',
      'Security committee charters',
      'RACI matrices'
    ]
  };
  return sources[documentType] || ['Consult with relevant department heads', 'Review existing documentation'];
};

export default AuditDetail;