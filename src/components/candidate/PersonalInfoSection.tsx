
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
    <div className="bg-gradient-to-br from-purple-50/50 to-white rounded-xl p-4 border border-purple-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <User className="h-3.5 w-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">Personal Information</h3>
      </div>

      {(duplicateWarnings.email || duplicateWarnings.phone) && (
        <div className="flex items-center gap-2 p-2 mb-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          <p className="text-amber-700">
            {duplicateWarnings.email && duplicateWarnings.phone 
              ? 'Email & phone already registered'
              : duplicateWarnings.email ? 'Email already registered' : 'Phone already registered'}
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" className="text-xs font-medium text-gray-600 mb-1 block">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={onFirstNameChange}
              className={`h-9 text-sm border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${fieldErrors.firstName ? 'border-red-400' : ''}`}
              placeholder="John"
            />
            {fieldErrors.firstName && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-xs font-medium text-gray-600 mb-1 block">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={onLastNameChange}
              className={`h-9 text-sm border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${fieldErrors.lastName ? 'border-red-400' : ''}`}
              placeholder="Doe"
            />
            {fieldErrors.lastName && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.lastName}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-xs font-medium text-gray-600 mb-1 block">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onEmailChange}
              className={`pl-9 h-9 text-sm border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${fieldErrors.email ? 'border-red-400' : ''}`}
              placeholder="john@example.com"
            />
          </div>
          {fieldErrors.email && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="text-xs font-medium text-gray-600 mb-1 block">Phone *</Label>
          <div className="relative">
            <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={onPhoneChange}
              className={`pl-9 h-9 text-sm border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 ${fieldErrors.phone ? 'border-red-400' : ''}`}
              placeholder="+91 98765 43210"
            />
          </div>
          {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.phone}</p>}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
