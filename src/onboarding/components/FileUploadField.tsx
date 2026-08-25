// Onboarding module - document upload control.
//
// Checks size and type in the browser so an oversized file is caught before it
// is sent; the backend enforces the same limits again on arrival.

import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import {
  ACCEPTED_FILE_EXTENSIONS,
  MAX_FILE_SIZE_MB,
} from '../onboarding.constants';
import { OnboardingFileKey, OnboardingFormik } from '../onboarding.types';
import { FieldError, FieldHint } from './OnboardingFields';

interface FileUploadFieldProps {
  formik: OnboardingFormik;
  name: OnboardingFileKey;
  label: string;
  required?: boolean;
  hint?: string;
  onFileChange: (fieldName: OnboardingFileKey, file: File | null) => void;
}

/** Human-readable file size, e.g. "1.4 MB". */
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUploadField = ({
  formik, name, label, required, hint, onFileChange,
}: FileUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const file = formik.values[name];
  const error = formik.touched[name] && formik.errors[name]
    ? String(formik.errors[name])
    : undefined;

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(name, event.target.files?.[0] ?? null);
  };

  const handleRemove = () => {
    onFileChange(name, null);
    // Clear the native input too, so re-picking the same file still fires onChange.
    if (inputRef.current) inputRef.current.value = '';
  };

  const isImage = file?.type.startsWith('image/');

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none block">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={ACCEPTED_FILE_EXTENSIONS}
        onChange={handleSelect}
        className="hidden"
      />

      {file ? (
        // --- Attached: show what will be uploaded, with a way to remove it ---
        <div className={`
          flex items-center gap-2.5 p-2.5 rounded-lg border-2
          bg-bambinos-blue/[0.04] dark:bg-bambinos-blue/10
          ${error ? 'border-red-400 dark:border-red-500' : 'border-bambinos-blue/30 dark:border-bambinos-blue/40'}
        `}>
          <div className="w-7 h-7 rounded-md bg-bambinos-blue/10 dark:bg-bambinos-blue/20 flex items-center justify-center shrink-0">
            {isImage
              ? <ImageIcon className="h-3.5 w-3.5 text-bambinos-blue" />
              : <FileText className="h-3.5 w-3.5 text-bambinos-blue" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remove ${label}`}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        // --- Empty: the whole box is the picker ---
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`
            w-full flex items-center gap-2.5 p-2.5 rounded-lg
            border-2 border-dashed text-left
            bg-gray-50/50 dark:bg-gray-700/40
            transition-all duration-200
            hover:border-bambinos-blue/50 hover:bg-white dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-bambinos-blue/30
            ${error
              ? 'border-red-400 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600'}
          `}
        >
          <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-600/50 flex items-center justify-center shrink-0">
            <Upload className="h-3.5 w-3.5 text-gray-500 dark:text-gray-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200">Choose file</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              PDF, JPG, PNG · up to {MAX_FILE_SIZE_MB}MB
            </p>
          </div>
        </button>
      )}

      <FieldHint hint={hint} />
      <FieldError message={error} />
    </div>
  );
};

export default FileUploadField;
