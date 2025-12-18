import { Label } from "@/components/ui/label";
import { BookOpen, Languages, Check } from "lucide-react";
import { SubjectsSectionProps } from '@/types/candidate';

const CustomCheckbox = ({ checked, className }: { checked: boolean; className?: string }) => (
  <div className={`h-4 w-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors ${
    checked 
      ? `bg-green-600 border-green-600 ${className?.includes('indigo') ? 'bg-indigo-600 border-indigo-600' : ''}` 
      : 'border-gray-300'
  }`}>
    {checked && <Check className="h-3 w-3 text-white" />}
  </div>
);

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
    <div className="bg-gradient-to-br from-green-50/50 to-white rounded-xl p-4 border border-green-100">
      {/* Subjects */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Subjects *</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {subjects.map((subject) => (
            <div 
              key={subject} 
              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                selectedSubjects.includes(subject)
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-200 hover:border-green-200'
              }`}
              onClick={() => onSubjectChange(subject, !selectedSubjects.includes(subject))}
            >
              <CustomCheckbox checked={selectedSubjects.includes(subject)} />
              <Label className="text-xs font-medium text-gray-700 cursor-pointer">{subject}</Label>
            </div>
          ))}
        </div>
        {subjectError && <p className="text-red-500 text-[10px] mt-1">{subjectError}</p>}
      </div>

      {/* Languages */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Languages className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Languages</h3>
          <span className="text-[10px] text-gray-400">(optional)</span>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5">
          {additionalLanguages.map((language) => (
            <div 
              key={language} 
              className={`flex items-center gap-1.5 p-1.5 rounded border cursor-pointer transition-all ${
                selectedLanguages.includes(language)
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'bg-white border-gray-200 hover:border-indigo-200'
              }`}
              onClick={() => onLanguageChange(language, !selectedLanguages.includes(language))}
            >
              <CustomCheckbox checked={selectedLanguages.includes(language)} className="indigo" />
              <Label className="text-[10px] font-medium text-gray-700 cursor-pointer">{language}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectsSection;
