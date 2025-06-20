import React, { useState, useRef } from 'react';
import { DocumentType } from '../../types';

interface FileUploadProps {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  onFileUpload: (file: File) => void;
  accept?: string;
  documentType?: DocumentType;
  status?: 'pending' | 'uploaded' | 'validated' | 'invalid';
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  helperText,
  error,
  onFileUpload,
  accept = '.pdf,.doc,.docx',
  documentType,
  status = 'pending',
}) => {
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const statusColors = {
    pending: 'border-gray-300 bg-gray-50',
    uploaded: 'border-blue-300 bg-blue-50',
    validated: 'border-green-300 bg-green-50',
    invalid: 'border-red-300 bg-red-50',
  };

  const statusIcons = {
    pending: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    ),
    uploaded: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    ),
    validated: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    invalid: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    ),
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <div
        className={`mt-1 flex justify-center px-6 py-4 border-2 border-dashed rounded-md transition-colors
          ${isDragging ? 'border-blue-400 bg-blue-50' : statusColors[status]}
          ${fileName ? 'cursor-default' : 'cursor-pointer'}
        `}
        onClick={fileName ? undefined : handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <div className="flex justify-center">
            {statusIcons[status]}
          </div>
          <div className="flex text-sm text-gray-600">
            <input
              id={id}
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept={accept}
              onChange={handleFileChange}
            />
            {!fileName ? (
              <p className="relative">
                Drag and drop a file here, or <span className="text-blue-600 hover:text-blue-500">click to select a file</span>
              </p>
            ) : (
              <p className="relative">
                {fileName}
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-500 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  (Change)
                </button>
              </p>
            )}
          </div>
          {!fileName && (
            <p className="text-xs text-gray-500">
              {accept.split(',').join(', ')} up to 10MB
            </p>
          )}
        </div>
      </div>
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-description`}>
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;