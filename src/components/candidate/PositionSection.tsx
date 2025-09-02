
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase } from "lucide-react";

import { PositionSectionProps } from '@/types/candidate';

const PositionSection = ({ selectedPosition, onPositionChange, error }: PositionSectionProps) => {
  const positions = [
    {
      id: "Role 1 - Educator",
      title: "Role 1 - Educator",
      description: "Regular teaching sessions"
    },
    {
      id: "Role 2 - Assessment Specialist", 
      title: "Role 2 - Assessment Specialist",
      description: "Demo classes and assessments"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Position *</h3>
      </div>
      
      <div className="space-y-3">
        <RadioGroup value={selectedPosition} onValueChange={onPositionChange} className="space-y-3">
          {positions.map((position) => (
            <div key={position.id} className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <RadioGroupItem value={position.id} id={position.id} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={position.id} className="text-sm font-medium text-gray-700 cursor-pointer block">
                  {position.title}
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  {position.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
        
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default PositionSection;
