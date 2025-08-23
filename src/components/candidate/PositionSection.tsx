
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
    <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Position *</CardTitle>
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
              <div key={position.id} className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <RadioGroupItem value={position.id} id={position.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={position.id} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer block">
                    {position.title}
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
      </CardContent>
    </Card>
  );
};

export default PositionSection;
