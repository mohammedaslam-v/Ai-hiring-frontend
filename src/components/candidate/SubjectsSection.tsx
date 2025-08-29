
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const subjects = ["English", "Maths", "Phonics", "Bhagavad Gita"];
  const additionalLanguages = ["Bangali", "Malayalam", "Tamil", "Telugu", "Marathi", "Kannada"];

  return (
    <div className="space-y-6">
      {/* Subjects Section */}
      <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Subjects You Can Teach *</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Please select at least one subject
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={selectedSubjects.includes(subject)}
                  onCheckedChange={(checked) => onSubjectChange(subject, checked as boolean)}
                />
                <Label htmlFor={subject} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  {subject}
                </Label>
              </div>
            ))}
          </div>
          
          {subjectError && (
            <p className="text-red-500 text-sm mt-2">{subjectError}</p>
          )}
        </CardContent>
      </Card>

      {/* Additional Languages Section */}
      <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Languages className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Additional Languages</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Do you know any of the below languages other than English?
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {additionalLanguages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={(checked) => onLanguageChange(language, checked as boolean)}
                />
                <Label htmlFor={language} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectsSection;
