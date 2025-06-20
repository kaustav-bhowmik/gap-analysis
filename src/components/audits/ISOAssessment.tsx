import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, MinusCircle, ChevronDown, ChevronUp, ChevronRight, ExternalLink, Download, Search, Filter, Upload } from 'lucide-react';
import { ManagementClause, DocumentReference, NonConformity, AnnexAControl, Evidence } from '../../types';
import { managementClauses } from '../../data/managementClauses';
import { annexAControls } from '../../data/annexAControls';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import SidePanel from '../ui/SidePanel';
import Input from '../ui/Input';
import Select from '../ui/Select';
import MultiFileUpload from '../ui/MultiFileUpload';

interface ISOAssessmentProps {
  isAssessmentStarted: boolean;
  onStartAssessment: () => void;
}

const categories = Array.from(new Set(managementClauses.map(clause => clause.category)));
const statuses = ['Acceptable', 'Nonconformity', 'Not Applicable'];
const confidenceLevels = ['High', 'Medium', 'Low', 'Uncertain'];

const ISOAssessment: React.FC<ISOAssessmentProps> = ({ isAssessmentStarted, onStartAssessment }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'annexA'>('management');
  const [managementClausesList, setManagementClausesList] = useState(managementClauses);
  const [annexAControlsList, setAnnexAControlsList] = useState(annexAControls);
  const [selectedClause, setSelectedClause] = useState<ManagementClause | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentReference | null>(null);
  const [showNonConformities, setShowNonConformities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedConfidence, setSelectedConfidence] = useState('');
  const [selectedItem, setSelectedItem] = useState<ManagementClause | AnnexAControl | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedItemStatus, setSelectedItemStatus] = useState<string>('');
  const [selectedItemConfidence, setSelectedItemConfidence] = useState<string>('');
  const [selectedNonConformitySeverity, setSelectedNonConformitySeverity] = useState<string>('');
  const [auditorNotes, setAuditorNotes] = useState<string>('');

  const handleItemClick = (item: ManagementClause | AnnexAControl) => {
    setSelectedItem(item);
    setSidePanelOpen(true);
    setSelectedItemStatus(item.status);
    setSelectedItemConfidence(item.confidence);
    setAuditorNotes(item.auditorNotes || '');
  };

  const handleStatusUpdate = () => {
    if (!selectedItem) return;
    if (!auditorNotes.trim()) return; // Prevent saving without auditor notes
    
    const updatedItem = {
      ...selectedItem,
      status: selectedItemStatus as 'Acceptable' | 'Nonconformity' | 'Not Applicable',
      isManualOverride: true,
      originalStatus: selectedItem.status,
      nonconformitySeverity: selectedItemStatus === 'Nonconformity' ? selectedNonConformitySeverity as NonconformitySeverity : undefined,
      auditorNotes,
      isAIGenerated: false
    };

    if (activeTab === 'management') {
      const updatedClauses = managementClausesList.map(clause =>
        clause.clauseNumber === selectedItem.clauseNumber ? updatedItem : clause
      );
      setManagementClausesList(updatedClauses);
    } else {
      const updatedControls = annexAControlsList.map(control =>
        control.controlNumber === (selectedItem as AnnexAControl).controlNumber ? updatedItem : control
      );
      setAnnexAControlsList(updatedControls);
    }

    setEditingStatus(false);
  };

  // Get categories based on active tab
  const categories = Array.from(new Set(
    activeTab === 'management' 
      ? managementClausesList.map(clause => clause.category)
      : annexAControlsList.map(control => control.category)
  ));

  const filteredItems = (activeTab === 'management' ? managementClausesList : annexAControlsList).filter(item => {
    const matchesSearch = item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activeTab === 'management' 
                           ? item.clauseNumber.toLowerCase().includes(searchTerm.toLowerCase())
                           : item.controlNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesConfidence = !selectedConfidence || item.confidence === selectedConfidence;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesConfidence;
  });

  const exportToCSV = () => {
    const headers = [
      'Clause Number',
      'Requirement',
      'Category',
      'Status',
      'Documents Referenced',
      'Confidence',
      'Non-Conformities'
    ];

    const rows = filteredItems.map(item => [
      activeTab === 'management' ? item.clauseNumber : item.controlNumber,
      item.requirement,
      item.category,
      item.status,
      item.documentsReferenced.map(doc => doc.documentName).join('; '),
      item.confidence,
      item.nonConformities.length
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `iso-${activeTab}-assessment-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleFileUpload = (itemId: string, files: FileList, isManagementClause: boolean) => {
    const newEvidence = Array.from(files).map(file => ({
        id: crypto.randomUUID(),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        description: '',
        file
    }));

    if (isManagementClause) {
      const updatedClauses = managementClausesList.map(clause => {
        if (clause.clauseNumber === itemId) {
          return {
            ...clause,
            evidence: [...(clause.evidence || []), ...newEvidence]
          };
        }
        return clause;
      });
      setManagementClausesList(updatedClauses);
    } else {
      const updatedControls = annexAControlsList.map(control => {
        if (control.controlNumber === itemId) {
          return {
            ...control,
            evidence: [...(control.evidence || []), ...newEvidence]
          };
        }
        return control;
      });
      setAnnexAControlsList(updatedControls);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Acceptable':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Nonconformity':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Not Applicable':
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Acceptable':
        return 'bg-green-50 text-green-800';
      case 'Nonconformity':
        return 'bg-red-50 text-red-800';
      case 'Not Applicable':
        return 'bg-gray-50 text-gray-800';
      default:
        return '';
    }
  };

  const toggleNonConformities = (clauseNumber: string) => {
    setShowNonConformities(prev => 
      prev.includes(clauseNumber) 
        ? prev.filter(num => num !== clauseNumber)
        : [...prev, clauseNumber]
    );
  };

  if (!isAssessmentStarted) {
    return (
      <div className="py-8 text-center">
        <Button onClick={onStartAssessment}>Begin Assessment</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('management');
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedStatus('');
              setSelectedConfidence('');
            }}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'management'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Management Clauses
          </button>
          <button
            onClick={() => {
              setActiveTab('annexA');
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedStatus('');
              setSelectedConfidence('');
            }}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'annexA'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Annex A Controls
          </button>
        </nav>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Assessment Date: {new Date().toLocaleString()}
        </div>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
          onClick={exportToCSV}
        >
          Export to CSV
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Search by Clause Number or Requirement"
                placeholder={activeTab === 'management' 
                  ? "e.g., '4.1' or 'Context of Organization'"
                  : "e.g., 'A.5.1' or 'Information Security Policies'"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Filter by Category"
                options={[
                  { value: '', label: 'All' },
                  ...categories.map(cat => ({ value: cat, label: cat }))
                ]}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
              
              <Select
                label="Filter by Status"
                options={[
                  { value: '', label: 'All' },
                  ...statuses.map(status => ({ value: status, label: status }))
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
              />
              
              <Select
                label="Filter by Confidence"
                options={[
                  { value: '', label: 'All' },
                  ...confidenceLevels.map(level => ({ value: level, label: level }))
                ]}
                value={selectedConfidence}
                onChange={setSelectedConfidence}
              />
            </div>
          </div>
          
          {(searchTerm || selectedCategory || selectedStatus || selectedConfidence) && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-gray-600">
                {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setSelectedConfidence('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Clause #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requirement
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Category
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Documents Referenced
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Confidence Level
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Non-Conformities
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <React.Fragment key={activeTab === 'management' ? item.clauseNumber : item.controlNumber}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <td className="px-4 py-3 cursor-pointer hover:bg-gray-100">
                    <div className="font-medium text-blue-600 hover:text-blue-800">
                      {activeTab === 'management' ? item.clauseNumber : item.controlNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">
                      {activeTab === 'management' ? (
                        item.requirement
                      ) : (
                        <div className="line-clamp-2">{item.requirement}</div>
                      )}
                    </div>
                    {activeTab === 'annexA' && (
                      <div className="mt-2 text-sm italic text-gray-500 line-clamp-1">Control: {(item as AnnexAControl).control}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {item.documentsReferenced.map((doc) => (
                        <Button
                          key={doc.documentId}
                          size="sm"
                          variant="outline"
                          leftIcon={<FileText className="h-4 w-4" />}
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowDocumentModal(true);
                          }}
                        >
                          {doc.documentName}
                        </Button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.isManualOverride ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Manually Edited
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.confidence === 'High' ? 'bg-green-100 text-green-800' : ''}
                        ${item.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${item.confidence === 'Low' ? 'bg-red-100 text-red-800' : ''}
                        ${item.confidence === 'Uncertain' ? 'bg-gray-100 text-gray-800' : ''}`}
                      >
                        {item.confidence}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.nonConformities.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleNonConformities(activeTab === 'management' ? item.clauseNumber : item.controlNumber)}
                      >
                        {item.nonConformities.length} Issues
                        {showNonConformities.includes(activeTab === 'management' ? item.clauseNumber : item.controlNumber) ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <MultiFileUpload
                      evidence={item.evidence || []}
                      onFilesSelected={(files) => handleFileUpload(
                        activeTab === 'management' ? item.clauseNumber : item.controlNumber,
                        files,
                        activeTab === 'management'
                      )}
                      onRemoveFile={(evidenceId) => {
                        // Handle file removal
                        if (activeTab === 'management') {
                          const updatedClauses = managementClausesList.map(clause => ({
                            ...clause,
                            evidence: clause.evidence?.filter(ev => ev.id !== evidenceId) || []
                          }));
                          setManagementClausesList(updatedClauses);
                        } else {
                          const updatedControls = annexAControlsList.map(control => ({
                            ...control,
                            evidence: control.evidence?.filter(ev => ev.id !== evidenceId) || []
                          }));
                          setAnnexAControlsList(updatedControls);
                        }
                      }}
                      onPreviewFile={(evidence) => {
                        setSelectedEvidence(evidence);
                        setShowPreviewModal(true);
                      }}
                    />
                  </td>
                </tr>
                {showNonConformities.includes(activeTab === 'management' ? item.clauseNumber : item.controlNumber) && 
                 item.nonConformities.map((nc) => (
                  <motion.tr
                    key={nc.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50"
                  >
                    <td className="px-6 py-4" colSpan={7}>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-red-800">Non-Conformity</h4>
                          <p className="mt-1 text-sm text-red-700">{nc.description}</p>
                          <p className="mt-1 text-sm text-red-600">Evidence: {nc.evidence}</p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <SidePanel
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        title={`${selectedItem?.clauseNumber || selectedItem?.controlNumber || ''} Assessment Details`}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Requirement</h3>
              <p className="mt-2 text-base text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedItem?.requirement}</p>
            </div>
            
            {'control' in (selectedItem || {}) && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Control Implementation</h3>
                <p className="mt-2 text-base text-gray-900 bg-gray-50 p-4 rounded-lg">{(selectedItem as AnnexAControl)?.control}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-2 text-base text-gray-900">{selectedItem?.category}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Assessment Status</h3>
              <div className="mt-2">
                {editingStatus ? (
                  <div className="space-y-4">
                    <Select
                      label="Status"
                      placeholder="Select assessment status"
                      options={[
                        { value: 'Acceptable', label: 'Acceptable' },
                        { value: 'Nonconformity', label: 'Nonconformity' },
                        { value: 'Not Applicable', label: 'Not Applicable' }
                      ]}
                      value={selectedItemStatus}
                      onChange={setSelectedItemStatus}
                      onChange={(value) => {
                        setSelectedItemStatus(value);
                        if (value !== 'Nonconformity') {
                          setSelectedNonConformitySeverity('');
                        }
                      }}
                    />
                    {selectedItemStatus === 'Nonconformity' && (
                      <Select
                        label="Non-Conformity Severity"
                        placeholder="Select severity level"
                        options={[
                          { value: 'Major', label: 'Major' },
                          { value: 'Minor', label: 'Minor' },
                          { value: 'Observation', label: 'Observation' },
                          { value: 'Opportunity for Improvement', label: 'Opportunity for Improvement' }
                        ]}
                        value={selectedNonConformitySeverity}
                        onChange={setSelectedNonConformitySeverity}
                      />
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auditor Notes *
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                        value={auditorNotes}
                        onChange={(e) => setAuditorNotes(e.target.value)}
                        placeholder="Add your assessment notes here (required)..."
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingStatus(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={!auditorNotes.trim() || (selectedItemStatus === 'Nonconformity' && !selectedNonConformitySeverity)}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${selectedItem?.status === 'Acceptable' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedItem?.status === 'Nonconformity' ? 'bg-red-100 text-red-800' : ''}
                      ${selectedItem?.status === 'Not Applicable' ? 'bg-gray-100 text-gray-800' : ''}`} 
                    >
                      {getStatusIcon(selectedItem?.status || '')}
                      <span className="ml-2">{selectedItem?.status}</span>
                      {selectedItem?.isManualOverride && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          Manual Edit
                        </span>
                      )}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingStatus(true)}
                    >
                      Update Status
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Confidence Level</h3>
              <div className="mt-2">
                {!editingStatus && !selectedItem?.isManualOverride && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${selectedItem?.confidence === 'High' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedItem?.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedItem?.confidence === 'Low' ? 'bg-red-100 text-red-800' : ''}
                    ${selectedItem?.confidence === 'Uncertain' ? 'bg-gray-100 text-gray-800' : ''}`}
                  >
                    {selectedItem?.confidence}
                  </span>
                )}
                {!editingStatus && selectedItem?.isManualOverride && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Manually Edited
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {!editingStatus && selectedItem?.auditorNotes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Auditor Notes</h3>
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                {selectedItem.auditorNotes}
              </p>
            </div>
          )}

          {selectedItem?.documentsReferenced?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Referenced Documents</h3>
                <span className="text-xs text-gray-500">{selectedItem.documentsReferenced.length} documents</span>
              </div>
              <div className="mt-2 space-y-3">
                {selectedItem.documentsReferenced.map((doc) => (
                  <div key={doc.documentId} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">{doc.documentName}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/documents/${doc.documentId}`, '_blank')}
                      >
                        View Document
                      </Button>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="font-medium mb-1">Referenced Sections:</div>
                      <ul className="list-disc pl-5 mt-1">
                        {doc.sections.map((section, index) => (
                          <li key={index}>{section}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="font-medium text-gray-600 mb-1">Implementation Justification:</div>
                      <p className="mt-1">{doc.justification}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItem?.nonConformities?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Non-Conformities</h3>
                <span className="text-xs text-gray-500">{selectedItem.nonConformities.length} issues found</span>
              </div>
              <div className="mt-2 space-y-3">
                {selectedItem.nonConformities.map((nc) => (
                  <div key={nc.id} className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <div className="font-medium text-red-800">Non-Conformity</div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div>
                        <div className="text-sm font-medium text-red-700">Description:</div>
                        <p className="mt-1 text-sm text-red-700">{nc.description}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-700">Supporting Evidence:</div>
                        <p className="mt-1 text-sm text-red-700">{nc.evidence}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItem?.evidence?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Assessment Evidence</h3>
                <span className="text-xs text-gray-500">{selectedItem.evidence.length} files</span>
              </div>
              <div className="mt-2 space-y-3">
                {selectedItem.evidence.map((ev) => (
                  <div key={ev.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{ev.fileName}</div>
                          <div className="text-xs text-gray-500">Uploaded {new Date(ev.uploadedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEvidence(ev);
                          setShowPreviewModal(true);
                        }}
                      >
                        Preview
                      </Button>
                    </div>
                    {ev.description && (
                      <p className="mt-2 text-sm text-gray-600">{ev.description}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <MultiFileUpload
                  evidence={selectedItem.evidence}
                  onFilesSelected={(files) => handleFileUpload(
                    activeTab === 'management' ? selectedItem.clauseNumber : selectedItem.controlNumber,
                    files,
                    activeTab === 'management'
                  )}
                  onRemoveFile={(evidenceId) => {
                    if (activeTab === 'management') {
                      const updatedClauses = managementClausesList.map(clause => ({
                        ...clause,
                        evidence: clause.evidence?.filter(ev => ev.id !== evidenceId) || []
                      }));
                      setManagementClausesList(updatedClauses);
                    } else {
                      const updatedControls = annexAControlsList.map(control => ({
                        ...control,
                        evidence: control.evidence?.filter(ev => ev.id !== evidenceId) || []
                      }));
                      setAnnexAControlsList(updatedControls);
                    }
                  }}
                  onPreviewFile={(evidence) => {
                    setSelectedEvidence(evidence);
                    setShowPreviewModal(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </SidePanel>

      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title={selectedDocument?.documentName || ''}
      >
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="text-sm font-medium text-gray-900">Referenced Sections</h4>
            <ul className="mt-2 space-y-2">
              {selectedDocument?.sections.map((section, index) => (
                <li key={index} className="text-sm text-gray-600">• {section}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900">Justification</h4>
            <p className="mt-2 text-sm text-gray-600">{selectedDocument?.justification}</p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDocumentModal(false)}
            >
              Close
            </Button>
            <Button
              leftIcon={<ExternalLink size={16} />}
              onClick={() => {
                // Open document preview in new tab
                window.open(`/documents/${selectedDocument?.documentId}`, '_blank');
              }}
            >
              Preview Document
            </Button>
          </div>
        </div>
      </Modal>
      
      <Modal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedEvidence(null);
        }}
        title="Evidence Preview"
      >
        <div className="space-y-4">
          {selectedEvidence && (
            <>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{selectedEvidence.fileName}</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Uploaded: {new Date(selectedEvidence.uploadedAt).toLocaleString()}</p>
                {selectedEvidence.description && (
                  <p className="mt-2">{selectedEvidence.description}</p>
                )}
              </div>
              {selectedEvidence.file && (
                <div className="mt-4">
                  <object
                    data={URL.createObjectURL(selectedEvidence.file)}
                    type={selectedEvidence.file.type}
                    className="w-full h-96 border rounded-lg"
                  >
                    <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Preview not available</p>
                    </div>
                  </object>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowPreviewModal(false);
                setSelectedEvidence(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ISOAssessment;