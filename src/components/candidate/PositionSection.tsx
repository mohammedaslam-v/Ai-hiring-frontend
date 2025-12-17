
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase } from "lucide-react";
import { PositionSectionProps } from '@/types/candidate';

const PositionSection = ({ selectedPosition, onPositionChange, error }: PositionSectionProps) => {
  const positions = [
    { id: "Educator", title: "Educator", description: "Regular teaching sessions" }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Briefcase className="h-3.5 w-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">Position *</h3>
      </div>
      
      <RadioGroup value={selectedPosition} onValueChange={onPositionChange}>
        {positions.map((position) => (
          <div 
            key={position.id} 
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              selectedPosition === position.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-white border-gray-200 hover:border-blue-200'
            }`}
          >
            <RadioGroupItem value={position.id} id={position.id} />
            <Label htmlFor={position.id} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
              {position.title} <span className="text-gray-400 font-normal">· {position.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {error && <p className="text-red-500 text-[10px] mt-2">{error}</p>}
    </div>
  );
};

export default PositionSection;
