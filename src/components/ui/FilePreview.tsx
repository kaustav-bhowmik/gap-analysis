import React from 'react';
import { FileText, X, ExternalLink } from 'lucide-react';
import Button from './Button';

interface FilePreviewProps {
  fileName: string;
  onRemove?: () => void;
  onPreview?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileName, onRemove, onPreview }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600 truncate max-w-[150px]">{fileName}</span>
      </div>
      <div className="flex items-center space-x-1">
        {onPreview && (
          <button
            onClick={onPreview}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Preview file"
          >
            <ExternalLink className="h-4 w-4 text-gray-500" />
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Remove file"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilePreview;