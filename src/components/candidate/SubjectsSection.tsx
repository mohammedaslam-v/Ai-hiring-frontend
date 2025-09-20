
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
  const additionalLanguages = ["Bengali", "Tamil", "Marathi", "Malayalam", "Telugu", "Kannada"];

  return (
    <div className="space-y-6 animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-400" style={{animationDelay: '0.2s'}}>
      {/* Subjects Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-green-700 to-teal-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400 group-hover:rotate-12 group-hover:shadow-xl">
            <BookOpen className="h-5 w-5 text-white group-hover:animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">Subjects You Can Teach *</h3>
            <p className="text-sm text-gray-600 mt-1">Please select at least one subject</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {subjects.map((subject, index) => (
            <div 
              key={subject} 
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 transition-all duration-400 hover:shadow-md group animate-fade-in-up hover:-translate-y-1 border border-transparent hover:border-green-200"
              style={{animationDelay: `${0.3 + index * 0.1}s`}}
            >
              <Checkbox
                id={subject}
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={(checked) => onSubjectChange(subject, checked as boolean)}
                className="group-hover:scale-110 transition-transform duration-400"
              />
              <Label htmlFor={subject} className="text-sm font-semibold text-gray-700 cursor-pointer group-hover:text-green-600 transition-colors duration-300">
                {subject}
              </Label>
            </div>
          ))}
        </div>
        
        {subjectError && (
          <p className="text-red-500 text-sm mt-2 animate-fade-in">{subjectError}</p>
        )}
      </div>

      {/* Additional Languages Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400 group-hover:rotate-12 group-hover:shadow-xl">
            <Languages className="h-5 w-5 text-white group-hover:animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Additional Languages</h3>
            <p className="text-sm text-gray-600 mt-1">Do you know any of the below languages other than English?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {additionalLanguages.map((language, index) => (
            <div 
              key={language} 
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-400 hover:shadow-md group animate-fade-in-up hover:-translate-y-1 border border-transparent hover:border-blue-200"
              style={{animationDelay: `${0.4 + index * 0.1}s`}}
            >
              <Checkbox
                id={language}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={(checked) => onLanguageChange(language, checked as boolean)}
                className="group-hover:scale-110 transition-transform duration-400"
              />
              <Label htmlFor={language} className="text-sm font-semibold text-gray-700 cursor-pointer group-hover:text-blue-600 transition-colors duration-300">
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
