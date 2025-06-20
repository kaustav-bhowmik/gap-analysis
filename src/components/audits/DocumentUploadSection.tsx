import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, XCircle, Upload, AlertTriangle, FileText } from 'lucide-react';
import { Document } from '../../types';
import FileUpload from '../ui/FileUpload';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { isoRequirements } from '../../data/isoRequirements';
import { Card, CardContent } from '../ui/Card';

const requiredDocuments = [
  'ISMS Scope Document',
  'Information Security Policy',
  'IT Security Policy',
  'Statement of Applicability',
  'Risk Assessment Plan',
  'Risk Assessment Report',
  'Inventory of Assets',
  'Incident Management Procedure',
  'Secure Development Policy',
  'Management Review',
  'Internal Audit Report',
  'Organization Chart'
];

interface DocumentUploadSectionProps {
  documents: Document[];
  onDocumentUpdate: (updatedDocument: Document) => void;
  onAnalysisComplete: (results: { complete: any[]; incomplete: any[]; }) => void;
  auditId: string;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  documents,
  onDocumentUpdate,
  onAnalysisComplete,
  auditId
}) => {  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get unique validated documents
  const validatedDocs = documents.filter(doc => doc.status === 'validated');
  const uniqueValidatedDocs = Array.from(new Set(validatedDocs.map(doc => doc.name)));
  const totalDocsCount = requiredDocuments.length;
  const completedDocsCount = uniqueValidatedDocs.length;
  const remainingDocsCount = totalDocsCount - completedDocsCount;

  useEffect(() => {
    if (analysisResults && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [analysisResults, uniqueValidatedDocs]);

  const matchDocumentToRequirement = (filename: string, requirement: string) => {
    const normalizedFilename = filename.toLowerCase();
    const normalizedRequirement = requirement.toLowerCase();
    
    return requiredDocuments.some(doc => {
      const normalizedDoc = doc.toLowerCase();
      return normalizedFilename.includes(normalizedDoc) || 
             normalizedFilename.includes(normalizedRequirement);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleAnalyzeDocuments = () => {
    setIsAnalyzing(true);
    const results = { complete: [], incomplete: [] };
    let updatedDocuments = [...documents];
    let currentFileIndex = 0;
    
    // Simulate document analysis
    setTimeout(() => {
      // Process each selected file
      selectedFiles.forEach(file => {
        const fileName = file.name.toLowerCase();
        
        // Find matching requirement by checking if the file name contains any required document name
        const matchedRequirement = requiredDocuments.find(req => 
          fileName.includes(req.toLowerCase().replace(/\s+/g, '')) || // Check without spaces
          fileName.includes(req.toLowerCase()) // Check with spaces
        );

        if (matchedRequirement) {
          const newDoc = {
            id: crypto.randomUUID(),
            name: matchedRequirement,
            type: 'ISMS',
            file: file,
            uploadedAt: new Date().toISOString(),
            status: 'validated' as const
          };

          // Remove existing document with same name if it exists
          updatedDocuments = updatedDocuments.filter(doc => 
            doc.name.toLowerCase() !== matchedRequirement.toLowerCase()
          );

          // Add new document
          updatedDocuments.push(newDoc);
        }
      });

      // Update all documents at once
      updatedDocuments.forEach(doc => {
        onDocumentUpdate(doc);
      });

      // Process requirements for analysis results
      isoRequirements.forEach(req => {
        const hasValidDocument = updatedDocuments.some(doc => 
          doc.status === 'validated' &&
          (doc.name.toLowerCase().includes(req.documentType.toLowerCase()) ||
           doc.name.toLowerCase().replace(/\s+/g, '').includes(req.documentType.toLowerCase().replace(/\s+/g, '')))
        );
        
        if (hasValidDocument) {
          results.complete.push(req);
        } else {
          results.incomplete.push(req);
        }
      });

      // Simulate analyzing each file
      const analyzeNextFile = () => {
        if (currentFileIndex < selectedFiles.length) {
          setAnalyzingFile(selectedFiles[currentFileIndex].name);
          currentFileIndex++;
          setTimeout(analyzeNextFile, 1000);
        } else {
          setAnalysisResults(results);
          onAnalysisComplete(results);
          setIsAnalyzing(false);
          setAnalyzingFile(null);
        }
      };
      analyzeNextFile();
    }, 2000);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div ref={containerRef} className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
      <div className="flex justify-end">
        <Button
          variant="outline"
          leftIcon={<Info size={18} />}
          onClick={() => setShowRequirements(true)}
        >
          View Requirements
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Upload</h3>
          {documents.some(doc => doc.status === 'validated') && (
            <div className="mb-4">
              <Alert variant="info" title={`Completed Documents (${completedDocsCount} of ${totalDocsCount})`}>
                <p className="mb-2">The following documents have been validated and cannot be modified:</p>
                {uniqueValidatedDocs.length > 0 ? (
                  <div className="space-y-1">
                    {uniqueValidatedDocs.map(docName => (
                      <div key={docName} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{docName}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <p className="mt-2 text-sm text-gray-600">
                  {remainingDocsCount} of {totalDocsCount} documents remaining
                </p>
              </Alert>
            </div>
          )}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX up to 10MB each
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleAnalyzeDocuments}
              isLoading={isAnalyzing}
              disabled={selectedFiles.length === 0}
            >
              Analyze Documents
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && analyzingFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 p-4 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
            />
            <span className="text-blue-700">
              Analyzing: {analyzingFile}
            </span>
          </div>
        </motion.div>
      )}
      {analysisResults && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requirement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISO Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isoRequirements.map((req, index) => (
                  <tr key={index}>
                    <motion.td initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.requirement}
                    </motion.td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.isoReference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.documentType}
                    </td>
                    <motion.td initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }} className="px-6 py-4 whitespace-nowrap">
                      {analysisResults.complete.includes(req) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" /> Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-4 w-4 mr-1" /> Missing
                        </span>
                      )}
                    </motion.td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requirements Modal */}
      <Modal
        isOpen={showRequirements}
        onClose={() => setShowRequirements(false)}
        title="Required ISO 27001 Documentation"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            The following documents are required for ISO 27001 certification:
          </p>
          <div className="space-y-2">
            {requiredDocuments.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700">{doc}</span>
              </motion.div>
            ))}
          </div>
          <Button
            className="mt-4"
            onClick={() => setShowRequirements(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentUploadSection;