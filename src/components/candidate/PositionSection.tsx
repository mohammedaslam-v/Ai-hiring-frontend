
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
    <div className="space-y-5 animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-400" style={{animationDelay: '0.1s'}}>
      <div className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400 group-hover:rotate-12 group-hover:shadow-xl">
          <Briefcase className="h-5 w-5 text-white group-hover:animate-bounce" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Position *</h3>
          <p className="text-sm text-gray-600 mt-1">Choose your preferred role</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <RadioGroup value={selectedPosition} onValueChange={onPositionChange} className="space-y-3">
          {positions.map((position, index) => (
            <div 
              key={position.id} 
              className={`flex items-start space-x-3 p-4 bg-gradient-to-r from-white to-purple-50/30 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-400 hover:-translate-y-1 hover:border-purple-300 group cursor-pointer animate-fade-in-up hover:scale-[1.01]`}
              style={{animationDelay: `${0.2 + index * 0.1}s`}}
            >
              <RadioGroupItem value={position.id} id={position.id} className="mt-1 group-hover:scale-110 transition-transform duration-400" />
              <div className="flex-1">
                <Label htmlFor={position.id} className="text-base font-semibold text-gray-700 cursor-pointer block group-hover:text-purple-600 transition-colors duration-300">
                  {position.title}
                </Label>
                <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                  {position.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
        
        {error && (
          <p className="text-red-500 text-sm mt-2 animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
};

export default PositionSection;
