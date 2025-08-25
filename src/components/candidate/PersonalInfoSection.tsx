
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, AlertTriangle } from "lucide-react";
import { FORM_LABELS, FORM_PLACEHOLDERS, FORM_SECTIONS } from "@/utils/constants/form";
import { PersonalInfoSectionProps } from '@/types/candidate';

const PersonalInfoSection = ({ 
  formData, 
  duplicateWarnings, 
  fieldErrors = {},
  onEmailChange, 
  onPhoneChange,
  onFirstNameChange,
  onLastNameChange
}: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
          <User className="h-4 w-4 md:h-5 md:h-5 text-white" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{FORM_SECTIONS.PERSONAL_INFORMATION}</h3>
      </div>
      
      {/* Duplicate Warnings */}
      {(duplicateWarnings.email || duplicateWarnings.phone) && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-amber-800 text-sm">
            {duplicateWarnings.email && duplicateWarnings.phone 
              ? 'This email and phone number are already registered. Please use different credentials.'
              : duplicateWarnings.email 
                ? 'This email is already registered. Please use a different email address.'
                : 'This phone number is already registered. Please use a different phone number.'
            }
          </p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <div className="space-y-3">
          <Label htmlFor="firstName" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            {FORM_LABELS.FIRST_NAME}
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onFirstNameChange}
            className={`h-11 md:h-12 border-2 rounded-lg md:rounded-xl text-sm md:text-base ${
              fieldErrors.firstName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
            } dark:border-gray-600 dark:text-gray-300`}
            placeholder={FORM_PLACEHOLDERS.FIRST_NAME}
            required
          />
          {fieldErrors.firstName && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="lastName" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            {FORM_LABELS.LAST_NAME}
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onLastNameChange}
            className={`h-11 md:h-12 border-2 rounded-lg md:rounded-xl text-sm md:text-base ${
              fieldErrors.lastName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
            } dark:border-gray-600 dark:text-gray-300`}
            placeholder={FORM_PLACEHOLDERS.LAST_NAME}
            required
          />
          {fieldErrors.lastName && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            {FORM_LABELS.EMAIL}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 md:left-4 top-3 md:top-4 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onEmailChange}
              className={`pl-10 md:pl-12 h-11 md:h-12 border-2 rounded-lg md:rounded-xl text-sm md:text-base ${
                fieldErrors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : duplicateWarnings.email 
                    ? 'border-amber-400 bg-amber-50 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
              } dark:border-gray-600 dark:text-gray-300`}
              placeholder={FORM_PLACEHOLDERS.EMAIL}
              required
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="phone" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            {FORM_LABELS.PHONE}
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 md:left-4 top-3 md:top-4 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onPhoneChange}
              className={`pl-10 md:pl-12 h-11 md:h-12 border-2 rounded-lg md:rounded-xl text-sm md:text-base ${
                fieldErrors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : duplicateWarnings.phone 
                    ? 'border-amber-400 bg-amber-50 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
              } dark:border-gray-600 dark:text-gray-300`}
              placeholder={FORM_PLACEHOLDERS.PHONE}
              required
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
