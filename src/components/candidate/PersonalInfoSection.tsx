
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, AlertTriangle, User } from "lucide-react";
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
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft transition-shadow duration-300 hover:shadow-soft-lg md:h-full flex flex-col">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5 h-8">
        <div className="w-8 h-8 bg-bambinos-blue/10 dark:bg-bambinos-blue/20 rounded-lg flex items-center justify-center shrink-0">
          <User className="h-3.5 w-3.5 text-bambinos-blue" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-none">Personal Information</h3>
      </div>

      {/* Duplicate Warnings */}
      {(duplicateWarnings.email || duplicateWarnings.phone) && (
        <div className="flex items-center gap-2 p-3 mb-4 sm:mb-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg text-xs">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
          <p className="text-amber-700 dark:text-amber-400">
            {duplicateWarnings.email && duplicateWarnings.phone 
              ? 'Email & phone already registered'
              : duplicateWarnings.email ? 'Email already registered' : 'Phone already registered'}
          </p>
        </div>
      )}
      
      <div className="space-y-4 flex-1">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label 
              htmlFor="firstName" 
              className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none block"
            >
              First Name *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={onFirstNameChange}
              className={`
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
                ${fieldErrors.firstName ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/10' : ''}
              `}
              placeholder="John"
            />
            {fieldErrors.firstName && (
              <p className="text-red-500 text-xs font-medium mt-1 leading-none">{fieldErrors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label 
              htmlFor="lastName" 
              className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none block"
            >
              Last Name *
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={onLastNameChange}
              className={`
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
                ${fieldErrors.lastName ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/10' : ''}
              `}
              placeholder="Doe"
            />
            {fieldErrors.lastName && (
              <p className="text-red-500 text-xs font-medium mt-1 leading-none">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none block"
          >
            Email *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onEmailChange}
              className={`
                h-9 pl-9 text-xs
                bg-gray-50/50 dark:bg-gray-700/50
                border-2 border-gray-200/80 dark:border-gray-600
                rounded-lg
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                transition-all duration-200
                hover:border-bambinos-blue/40 hover:bg-white dark:hover:bg-gray-700
                focus:border-bambinos-blue focus:ring-2 focus:ring-bambinos-blue/10 dark:focus:ring-bambinos-blue/20
                focus:bg-white dark:focus:bg-gray-700
                ${fieldErrors.email ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/10' : ''}
              `}
              placeholder="john@example.com"
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-500 text-xs font-medium mt-1 leading-none">{fieldErrors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label 
            htmlFor="phone" 
            className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none block"
          >
            Phone *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onPhoneChange}
              className={`
                h-9 pl-9 text-xs
                bg-gray-50/50 dark:bg-gray-700/50
                border-2 border-gray-200/80 dark:border-gray-600
                rounded-lg
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                transition-all duration-200
                hover:border-bambinos-blue/40 hover:bg-white dark:hover:bg-gray-700
                focus:border-bambinos-blue focus:ring-2 focus:ring-bambinos-blue/10 dark:focus:ring-bambinos-blue/20
                focus:bg-white dark:focus:bg-gray-700
                ${fieldErrors.phone ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/10' : ''}
              `}
              placeholder="656545654565"
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs font-medium mt-1 leading-none">{fieldErrors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
