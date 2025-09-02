
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
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
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
      
      {/* First Name and Last Name in top row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-1 block">
            First Name *
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onFirstNameChange}
            className={`h-10 border border-gray-300 rounded-lg text-sm ${
              fieldErrors.firstName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
            placeholder="Enter your first name"
            required
          />
          {fieldErrors.firstName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-1 block">
            Last Name *
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onLastNameChange}
            className={`h-10 border border-gray-300 rounded-lg text-sm ${
              fieldErrors.lastName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
            placeholder="Enter your last name"
            required
          />
          {fieldErrors.lastName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email and Phone in second row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onEmailChange}
              className={`pl-10 h-10 border border-gray-300 rounded-lg text-sm ${
                fieldErrors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : duplicateWarnings.email 
                    ? 'border-amber-400 bg-amber-50 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              placeholder="Enter your email address"
              required
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">
            Phone Number *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onPhoneChange}
              className={`pl-10 h-10 border border-gray-300 rounded-lg text-sm ${
                fieldErrors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : duplicateWarnings.phone 
                    ? 'border-amber-400 bg-amber-50 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              placeholder="Enter your phone number"
              required
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
