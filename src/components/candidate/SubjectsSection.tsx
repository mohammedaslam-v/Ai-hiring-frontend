
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen, Languages } from "lucide-react";

import { SubjectsSectionProps } from '@/types/candidate';

const SubjectsSection = ({ 
  selectedSubjects, 
  selectedLanguages, 
  onSubjectChange, 
  onLanguageChange,
  subjectError
}: SubjectsSectionProps) => {
  const subjects = ["English", "Phonics", "Maths", "Bhagavad Gita"];
  const additionalLanguages = ["Bangali", "Marathi", "Telugu", "Tamil", "Malayalam", "Kannada"];

  return (
    <div className="space-y-6">
      {/* Subjects Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Subjects You Can Teach *</h3>
        </div>
        <p className="text-sm text-gray-600">Please select at least one subject</p>
        
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={subject}
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={(checked) => onSubjectChange(subject, checked as boolean)}
              />
              <Label htmlFor={subject} className="text-sm font-medium text-gray-700 cursor-pointer">
                {subject}
              </Label>
            </div>
          ))}
        </div>
        
        {subjectError && (
          <p className="text-red-500 text-sm mt-2">{subjectError}</p>
        )}
      </div>

      {/* Additional Languages Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Languages className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Additional Languages</h3>
        </div>
        <p className="text-sm text-gray-600">Do you know any of the below languages other than English?</p>
        
        <div className="grid grid-cols-2 gap-3">
          {additionalLanguages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={(checked) => onLanguageChange(language, checked as boolean)}
              />
              <Label htmlFor={language} className="text-sm font-medium text-gray-700 cursor-pointer">
                {language}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectsSection;
