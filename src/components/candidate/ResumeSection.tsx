
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";
import { useState, useCallback } from "react";

interface ResumeSectionProps {
  resume: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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
    <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Upload className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Resume Upload</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Upload your resume (PDF, DOC, DOCX - Max 10MB)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Resume File *
            </Label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-blue-300 hover:border-blue-400'
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
                required
              />
              <label htmlFor="resume" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-blue-600 font-medium">Click to upload or drag and drop</div>
                  <div className="text-gray-500 text-sm">PDF, DOC, DOCX (max 10MB) - Required</div>
                </div>
              </label>
            </div>
          </div>

          {resume && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
                  {resume.name}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {formatFileSize(resume.size)}
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• Supported formats: PDF, DOC, DOCX</p>
            <p>• Maximum file size: 10MB</p>
            <p>• Make sure your resume is up-to-date and clearly shows your teaching experience</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeSection;
