// Onboarding module - shared form building blocks.
//
// The form has ~35 fields, so the input styling lives here once instead of
// being repeated in every section. Each control takes the formik instance plus
// a field name, which keeps value/error wiring impossible to get wrong. Every
// control renders an element whose id is the field name, so the page can scroll
// to the first invalid field on submit.

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  OnboardingChoiceOption,
  OnboardingFormValues,
  OnboardingFormik,
  OnboardingTextKey,
} from '../onboarding.types';

/** Shared input styling, matching the candidate application form. */
const INPUT_CLASSES = `
  h-9 text-xs
  bg-gray-50/50 dark:bg-gray-700/50
  border-2 border-gray-200/80 dark:border-gray-600
  rounded-lg
  text-gray-900 dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  transition-all duration-200
  hover:border-bambinos-blue/40 hover:bg-white dark:hover:bg-gray-700
  focus:border-bambinos-blue focus:ring-2 focus:ring-bambinos-blue/10 dark:focus:ring-bambinos-blue/20
  focus:bg-white dark:focus:bg-gray-700
`;

const ERROR_CLASSES = 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/10';

const LABEL_CLASSES = 'text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none block';

/** The error to show for a field, or undefined while it is untouched. */
const fieldError = (formik: OnboardingFormik, name: keyof OnboardingFormValues): string | undefined => {
  const touched = formik.touched[name];
  const error = formik.errors[name];
  return touched && error ? String(error) : undefined;
};

export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-xs font-medium mt-1 leading-none">{message}</p> : null;

export const FieldHint = ({ hint }: { hint?: string }) =>
  hint ? <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{hint}</p> : null;

// ---------------------------------------------------------------- Section card

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  accentClass?: string;
  children: ReactNode;
}

/** One titled block of the form. */
export const SectionCard = ({
  icon: Icon,
  title,
  description,
  accentClass = 'bg-bambinos-blue/10 dark:bg-bambinos-blue/20 text-bambinos-blue',
  children,
}: SectionCardProps) => (
  <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft transition-shadow duration-300 hover:shadow-soft-lg">
    <div className="flex items-center gap-3 mb-4 sm:mb-5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${accentClass}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-none">{title}</h3>
        {description && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-none">{description}</p>
        )}
      </div>
    </div>
    {children}
  </div>
);

// ----------------------------------------------------------------- Text field

interface TextFieldProps {
  formik: OnboardingFormik;
  name: OnboardingTextKey;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'url';
  required?: boolean;
  icon?: LucideIcon;
  maxLength?: number;
  hint?: string;
  /** Force upper case as the candidate types (PAN, IFSC). */
  uppercase?: boolean;
  /** Allow digits only (Aadhaar, account number). */
  numericOnly?: boolean;
  /** Bounds for date inputs, so the picker cannot offer an invalid date. */
  min?: string;
  max?: string;
}

export const TextField = ({
  formik, name, label, placeholder, type = 'text',
  required, icon: Icon, maxLength, hint, uppercase, numericOnly, min, max,
}: TextFieldProps) => {
  const error = fieldError(formik, name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (numericOnly) value = value.replace(/\D/g, '');
    if (uppercase) value = value.toUpperCase();
    // Re-validate only while an error is on screen, so it disappears as soon as
    // the value is fixed. Typing in a clean field stays free of validation work.
    formik.setFieldValue(name, value, Boolean(error));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={LABEL_CLASSES}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={formik.values[name]}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          maxLength={maxLength}
          min={min}
          max={max}
          placeholder={placeholder}
          className={`${INPUT_CLASSES} ${Icon ? 'pl-9' : ''} ${error ? ERROR_CLASSES : ''}`}
        />
      </div>
      <FieldHint hint={hint} />
      <FieldError message={error} />
    </div>
  );
};

// --------------------------------------------------------------- Select field

interface SelectFieldProps {
  formik: OnboardingFormik;
  name: OnboardingTextKey;
  label: string;
  options: Array<string | OnboardingChoiceOption>;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

export const SelectField = ({
  formik, name, label, options, placeholder = 'Select an option', required, hint,
}: SelectFieldProps) => {
  const error = fieldError(formik, name);
  const normalised = options.map(option =>
    typeof option === 'string' ? { value: option, label: option } : option
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={LABEL_CLASSES}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        value={formik.values[name] || undefined}
        onValueChange={(value) => {
          formik.setFieldTouched(name, true, false);
          // Validate straight away - a dropdown never fires a blur event, so
          // without this the error would stay on screen after choosing a value.
          formik.setFieldValue(name, value, true);
        }}
      >
        <SelectTrigger id={name} className={`${INPUT_CLASSES} ${error ? ERROR_CLASSES : ''}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {normalised.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldHint hint={hint} />
      <FieldError message={error} />
    </div>
  );
};

// --------------------------------------------------------------- Choice field

interface ChoiceFieldProps {
  formik: OnboardingFormik;
  name: OnboardingTextKey;
  label: string;
  options: OnboardingChoiceOption[];
  required?: boolean;
  hint?: string;
}

/** Two-way question rendered as buttons - faster to answer than a dropdown. */
export const ChoiceField = ({ formik, name, label, options, required, hint }: ChoiceFieldProps) => {
  const error = fieldError(formik, name);
  const selected = formik.values[name];

  return (
    <div className="space-y-2" id={name}>
      <Label className={LABEL_CLASSES}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(option => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                formik.setFieldTouched(name, true, false);
                // Validate straight away so the error clears on selection.
                formik.setFieldValue(name, option.value, true);
              }}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium text-left
                border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-bambinos-blue/30
                ${isSelected
                  ? 'border-bambinos-blue bg-bambinos-blue/10 dark:bg-bambinos-blue/20 text-bambinos-blue dark:text-bambinos-blue-light'
                  : 'border-gray-200/80 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:border-bambinos-blue/40'}
                ${error && !isSelected ? 'border-red-300 dark:border-red-500/50' : ''}
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <FieldHint hint={hint} />
      <FieldError message={error} />
    </div>
  );
};

// ------------------------------------------------------------- Textarea field

interface TextAreaFieldProps {
  formik: OnboardingFormik;
  name: OnboardingTextKey;
  label: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  maxLength?: number;
  rows?: number;
}

export const TextAreaField = ({
  formik, name, label, placeholder, required, hint, maxLength = 2000, rows = 4,
}: TextAreaFieldProps) => {
  const error = fieldError(formik, name);
  const value = formik.values[name];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={name} className={LABEL_CLASSES}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums shrink-0">
          {value.length}/{maxLength}
        </span>
      </div>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => formik.setFieldValue(name, event.target.value, Boolean(error))}
        onBlur={formik.handleBlur}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`
          text-xs resize-none
          bg-gray-50/50 dark:bg-gray-700/50
          border-2 border-gray-200/80 dark:border-gray-600
          rounded-lg
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          transition-all duration-200
          hover:border-bambinos-blue/40 hover:bg-white dark:hover:bg-gray-700
          focus:border-bambinos-blue focus:ring-2 focus:ring-bambinos-blue/10
          focus:bg-white dark:focus:bg-gray-700
          ${error ? ERROR_CLASSES : ''}
        `}
      />
      <FieldHint hint={hint} />
      <FieldError message={error} />
    </div>
  );
};
