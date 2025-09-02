
import { Upload, FileText } from "lucide-react";
import { useState, useCallback } from "react";

import { ResumeSectionProps } from '@/types/candidate';

const ResumeSection = ({ resume, onFileUpload }: ResumeSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Directly call the file upload handler with the file
        const event = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onFileUpload(event);
      }
    }
  }, [onFileUpload]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Upload className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Resume *</h3>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors bg-blue-50 ${
          isDragOver 
            ? 'border-blue-500 bg-blue-100' 
            : 'border-blue-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onFileUpload}
          className="hidden"
        />
        <label htmlFor="resume" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <div className="text-blue-600 font-medium text-lg">Click to upload or drag and drop</div>
            <div className="text-gray-500 text-sm">PDF, DOC, DOCX (max 10MB) - Required</div>
          </div>
        </label>
      </div>

      {resume && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <FileText className="h-5 w-5 text-blue-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900 truncate">
              {resume.name}
            </p>
            <p className="text-xs text-blue-700">
              {formatFileSize(resume.size)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSection;
