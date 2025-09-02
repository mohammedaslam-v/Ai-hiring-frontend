
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
    <div className="space-y-5 animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-teal-100 shadow-lg hover:shadow-xl transition-all duration-400" style={{animationDelay: '0.4s'}}>
      <div className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400 group-hover:rotate-12 group-hover:shadow-xl">
          <Upload className="h-5 w-5 text-white group-hover:animate-bounce" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">Resume *</h3>
          <p className="text-sm text-gray-600 mt-1">Upload your professional resume</p>
        </div>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-500 bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 hover:shadow-xl hover:-translate-y-1 group ${
          isDragOver 
            ? 'border-teal-500 bg-gradient-to-br from-teal-100 via-blue-100 to-cyan-100 scale-105 shadow-2xl' 
            : 'border-teal-300 hover:border-teal-400 hover:scale-102'
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
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
              <Upload className="h-8 w-8 text-white group-hover:animate-bounce" />
            </div>
            <div className="text-teal-600 font-semibold text-lg group-hover:text-teal-700 transition-colors duration-300">Click to upload or drag and drop</div>
            <div className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">PDF, DOC, DOCX (max 10MB) - Required</div>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent rounded-full animate-pulse"></div>
          </div>
        </label>
      </div>

      {resume && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 via-blue-50 to-cyan-50 rounded-xl border border-teal-200 animate-fade-in shadow-lg hover:shadow-xl transition-all duration-400">
          <FileText className="h-6 w-6 text-teal-600 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-teal-900 truncate">
              {resume.name}
            </p>
            <p className="text-sm text-teal-700 font-medium">
              {formatFileSize(resume.size)}
            </p>
          </div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default ResumeSection;
