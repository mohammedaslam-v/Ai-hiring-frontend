
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";

interface AvailabilitySectionProps {
  selectedDays: string[];
  selectedTimeSlots: string[];
  onDayChange: (day: string, checked: boolean) => void;
  onTimeSlotChange: (slot: string, checked: boolean) => void;
  dayError?: string;
  timeSlotError?: string;
}

const AvailabilitySection = ({ 
  selectedDays, 
  selectedTimeSlots, 
  onDayChange, 
  onTimeSlotChange,
  dayError,
  timeSlotError
}: AvailabilitySectionProps) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [
    "6:00 AM - 8:00 AM",
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
    "8:00 PM - 10:00 PM"
  ];

  return (
    <div className="space-y-6">
      {/* Available Days Section */}
      <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Available Days</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Select days you're available to teach
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={(checked) => onDayChange(day, checked as boolean)}
                />
                <Label htmlFor={day} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  {day}
                </Label>
              </div>
            ))}
          </div>
          
          {dayError && (
            <p className="text-red-500 text-sm mt-2">{dayError}</p>
          )}
        </CardContent>
      </Card>

      {/* Time Slots Section */}
      <Card className="border-0 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Preferred Time Slots</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Select your preferred teaching time slots
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <div key={slot} className="flex items-center space-x-2">
                <Checkbox
                  id={slot}
                  checked={selectedTimeSlots.includes(slot)}
                  onCheckedChange={(checked) => onTimeSlotChange(slot, checked as boolean)}
                />
                <Label htmlFor={slot} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  {slot}
                </Label>
              </div>
            ))}
          </div>
          
          {timeSlotError && (
            <p className="text-red-500 text-sm mt-2">{timeSlotError}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilitySection;
