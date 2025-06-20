import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import Button from './Button';
import FilePreview from './FilePreview';
import { Evidence } from '../../types';

interface MultiFileUploadProps {
  evidence: Evidence[];
  onFilesSelected: (files: FileList) => void;
  onRemoveFile?: (evidenceId: string) => void;
  onPreviewFile?: (evidence: Evidence) => void;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  evidence,
  onFilesSelected,
  onRemoveFile,
  onPreviewFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {evidence.map((ev) => (
          <FilePreview
            key={ev.id}
            fileName={ev.fileName}
            onRemove={() => onRemoveFile?.(ev.id)}
            onPreview={() => onPreviewFile?.(ev)}
          />
        ))}
      </div>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Upload size={16} />}
          onClick={handleClick}
        >
          Add Evidence
        </Button>
      </div>
    </div>
  );
};

export default MultiFileUpload;