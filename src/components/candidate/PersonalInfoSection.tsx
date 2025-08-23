
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, AlertTriangle } from "lucide-react";

interface PersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  duplicateWarnings: {
    email: boolean;
    phone: boolean;
  };
  fieldErrors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
      </div>
      
      {/* Duplicate Warnings */}
      {(duplicateWarnings.email || duplicateWarnings.phone) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 flex items-start shadow-lg">
          <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-200 text-base md:text-lg">Duplicate Application Found</h4>
            <ul className="text-amber-700 dark:text-amber-300 mt-2 space-y-1 text-sm md:text-base">
              {duplicateWarnings.email && (
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 flex-shrink-0"></span>An application with this email address already exists.</li>
              )}
              {duplicateWarnings.phone && (
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 flex-shrink-0"></span>An application with this phone number already exists.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <div className="space-y-3">
          <Label htmlFor="firstName" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            First Name *
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
            placeholder="Enter your first name"
            required
          />
          {fieldErrors.firstName && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="lastName" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            Last Name *
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
            placeholder="Enter your last name"
            required
          />
          {fieldErrors.lastName && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            Email Address *
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
              placeholder="Enter your email address"
              required
            />
          </div>
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="phone" className="text-gray-700 font-semibold dark:text-gray-300 text-sm md:text-base">
            Phone Number *
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
              placeholder="Enter your phone number"
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
