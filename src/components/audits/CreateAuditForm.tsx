import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Audit } from '../../types';
import { requiredDocuments } from '../../data/requiredDocuments';

interface CreateAuditFormProps {
  onAuditCreate: (audit: Audit) => void;
}

const auditTypeOptions = [
  { value: 'Internal', label: 'Internal' },
  { value: 'Certification', label: 'Certification' },
  { value: 'Surveillance', label: 'Surveillance' },
  { value: 'Recertification', label: 'Recertification' },
];

const CreateAuditForm: React.FC<CreateAuditFormProps> = ({ onAuditCreate }) => {
  const navigate = useNavigate();
  const [auditName, setAuditName] = useState('');
  const [auditType, setAuditType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [typeError, setTypeError] = useState('');

  // Initialize documents with pending status for all required documents
  const createInitialDocuments = (): Document[] => {
    return requiredDocuments.map(doc => ({
      id: crypto.randomUUID(),
      name: doc.label,
      type: doc.type,
      file: null,
      uploadedAt: null,
      status: 'pending'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    if (!auditName.trim()) {
      setNameError('Audit name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!auditType) {
      setTypeError('Audit type is required');
      isValid = false;
    } else {
      setTypeError('');
    }
    
    if (!isValid) return;
    
    setIsLoading(true);
    
    // Create new audit
    const newAudit: Audit = {
      id: crypto.randomUUID(),
      name: auditName,
      startDate: new Date().toISOString(),
      framework: 'ISO 27001',
      type: auditType as 'Internal' | 'Certification' | 'Surveillance' | 'Recertification',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: createInitialDocuments(),
      missingDocuments: [],
      missingInformation: [],
    };
    
    // Simulate API call
    setTimeout(() => {
      onAuditCreate(newAudit);
      setIsLoading(false);
      navigate(`/audits/${newAudit.id}`);
    }, 1000);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Audit</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              id="audit-name"
              label="Audit Name"
              placeholder="Enter audit name"
              value={auditName}
              onChange={(e) => setAuditName(e.target.value)}
              error={nameError}
            />
            
            <Select
              id="audit-type"
              label="Audit Type"
              options={auditTypeOptions}
              value={auditType}
              onChange={(value) => setAuditType(value)}
              error={typeError}
              helperText="Select the type of audit to be performed"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => navigate('/audits')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            leftIcon={<PlusCircle size={18} />}
            isLoading={isLoading}
          >
            Create Audit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateAuditForm;