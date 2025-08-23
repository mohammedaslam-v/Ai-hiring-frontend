
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase } from "lucide-react";

interface PositionSectionProps {
  selectedPosition: string;
  onPositionChange: (value: string) => void;
  error?: string;
}

const PositionSection = ({ selectedPosition, onPositionChange, error }: PositionSectionProps) => {
  const positions = [
    "Online Teacher",
    "Offline Teacher", 
    "Both Online & Offline",
    "Subject Matter Expert",
    "Curriculum Developer",
    "Assessment Specialist"
  ];

  return (
    <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Position</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Select the position you're applying for
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup value={selectedPosition} onValueChange={onPositionChange} className="space-y-3">
            {positions.map((position) => (
              <div key={position} className="flex items-center space-x-3">
                <RadioGroupItem value={position} id={position} />
                <Label htmlFor={position} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  {position}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionSection;
