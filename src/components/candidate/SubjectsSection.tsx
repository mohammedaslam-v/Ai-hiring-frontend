import { Label } from "@/components/ui/label";
import { BookOpen, Languages, Check } from "lucide-react";
import { SubjectsSectionProps } from '@/types/candidate';

const CustomCheckbox = ({ checked, variant = 'green' }: { checked: boolean; variant?: 'green' | 'blue' }) => {
  const colorClasses = {
    green: checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600',
    blue: checked ? 'bg-bambinos-blue border-bambinos-blue' : 'border-gray-300 dark:border-gray-600'
  };
  
  return (
    <div className={`
      h-4 w-4 shrink-0 rounded border-2
      flex items-center justify-center
      transition-all duration-200
      ${colorClasses[variant]}
      ${checked ? 'shadow-sm' : ''}
    `}>
      {checked && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
    </div>
  );
};

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
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft transition-shadow duration-300 hover:shadow-soft-lg md:h-full flex flex-col">
      {/* Subjects Section */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-4 sm:mb-5 h-8">
          <div className="w-8 h-8 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-none">Subjects *</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {subjects.map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            return (
              <div 
                key={subject} 
                className={`
                  flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer
                  min-h-9
                  transition-all duration-200 ease-out
                  group
                  ${isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-600/50 shadow-sm'
                    : 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/50 hover:border-emerald-300 dark:hover:border-emerald-600/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                  }
                `}
                onClick={() => onSubjectChange(subject, !isSelected)}
              >
                <CustomCheckbox checked={isSelected} variant="green" />
                <Label className={`
                  text-xs font-medium cursor-pointer select-none leading-none
                  transition-colors duration-200
                  ${isSelected 
                    ? 'text-emerald-700 dark:text-emerald-300' 
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  }
                `}>
                  {subject}
                </Label>
              </div>
            );
          })}
        </div>
        {subjectError && (
          <p className="text-red-500 text-xs font-medium mt-2 leading-none">{subjectError}</p>
        )}
      </div>

      {/* Languages Section */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4 sm:mb-5 h-8">
          <div className="w-8 h-8 bg-bambinos-blue/10 dark:bg-bambinos-blue/20 rounded-lg flex items-center justify-center shrink-0">
            <Languages className="h-3.5 w-3.5 text-bambinos-blue" />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-none">Languages</h3>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-none">(optional)</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {additionalLanguages.map((language) => {
            const isSelected = selectedLanguages.includes(language);
            return (
              <div 
                key={language} 
                className={`
                  flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer
                  min-h-9
                  transition-all duration-200 ease-out
                  group
                  ${isSelected
                    ? 'bg-bambinos-blue/5 dark:bg-bambinos-blue/10 border-bambinos-blue/40 dark:border-bambinos-blue/50 shadow-sm'
                    : 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/50 hover:border-bambinos-blue/40 dark:hover:border-bambinos-blue/50 hover:bg-bambinos-blue/5 dark:hover:bg-bambinos-blue/10'
                  }
                `}
                onClick={() => onLanguageChange(language, !isSelected)}
              >
                <CustomCheckbox checked={isSelected} variant="blue" />
                <Label className={`
                  text-xs font-medium cursor-pointer select-none leading-none
                  transition-colors duration-200
                  ${isSelected 
                    ? 'text-bambinos-blue dark:text-bambinos-blue-light' 
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-bambinos-blue dark:group-hover:text-bambinos-blue-light'
                  }
                `}>
                  {language}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectsSection;
