
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
    <div className="space-y-5 animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-400">
      {/* Premium Section Header */}
      <div className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400 group-hover:rotate-12 group-hover:shadow-xl">
          <User className="h-5 w-5 text-white group-hover:animate-bounce" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Personal Information</h3>
          <p className="text-sm text-gray-600 mt-1">Tell us about yourself</p>
        </div>
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
        <div className="group">
          <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 mb-2 block group-hover:text-purple-600 transition-colors duration-300">
            First Name *
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onFirstNameChange}
            className={`h-10 border border-gray-300 rounded-lg text-sm transition-all duration-300 hover:border-purple-300 hover:shadow-md focus:shadow-lg focus:scale-105 ${
              fieldErrors.firstName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
            }`}
            placeholder="Enter your first name"
            required
          />
          {fieldErrors.firstName && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in font-medium">{fieldErrors.firstName}</p>
          )}
        </div>

        <div className="group">
          <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 mb-2 block group-hover:text-purple-600 transition-colors duration-300">
            Last Name *
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onLastNameChange}
            className={`h-10 border border-gray-300 rounded-lg text-sm transition-all duration-300 hover:border-purple-300 hover:shadow-md focus:shadow-lg focus:scale-105 ${
              fieldErrors.lastName 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
            }`}
            placeholder="Enter your last name"
            required
          />
          {fieldErrors.lastName && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in font-medium">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email and Phone in second row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="group">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block group-hover:text-purple-600 transition-colors duration-300">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onEmailChange}
              className={`pl-10 h-10 border border-gray-300 rounded-lg text-sm transition-all duration-300 hover:border-purple-300 hover:shadow-md focus:shadow-lg focus:scale-105 ${
                fieldErrors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : duplicateWarnings.email 
                    ? 'border-amber-400 bg-amber-50 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
              placeholder="Enter your email address"
              required
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in font-medium">{fieldErrors.email}</p>
          )}
        </div>

        <div className="group">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block group-hover:text-purple-600 transition-colors duration-300">
            Phone Number *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onPhoneChange}
              className={`pl-10 h-10 border border-gray-300 rounded-lg text-sm transition-all duration-300 hover:border-purple-300 hover:shadow-md focus:shadow-lg focus:scale-105 ${
                fieldErrors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : duplicateWarnings.phone 
                    ? 'border-amber-400 bg-amber-50 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
              placeholder="Enter your phone number"
              required
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in font-medium">{fieldErrors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
