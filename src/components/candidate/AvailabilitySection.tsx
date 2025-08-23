
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";

import { AvailabilitySectionProps } from '@/types/candidate';

const AvailabilitySection = ({ 
  selectedDays, 
  selectedTimeSlots, 
  onDayChange, 
  onTimeSlotChange,
  dayError,
  timeSlotError
}: AvailabilitySectionProps) => {
  const days = [
    { name: "Monday", highDemand: false },
    { name: "Tuesday", highDemand: false },
    { name: "Wednesday", highDemand: false },
    { name: "Thursday", highDemand: false },
    { name: "Friday", highDemand: false },
    { name: "Saturday", highDemand: true },
    { name: "Sunday", highDemand: true }
  ];
  
  const timeSlots = [
    { name: "6:00 AM - 8:00 AM", highDemand: false },
    { name: "8:00 AM - 10:00 AM", highDemand: false },
    { name: "10:00 AM - 12:00 PM", highDemand: false },
    { name: "12:00 PM - 2:00 PM", highDemand: false },
    { name: "2:00 PM - 4:00 PM", highDemand: false },
    { name: "4:00 PM - 6:00 PM", highDemand: false },
    { name: "6:00 PM - 8:00 PM", highDemand: true },
    { name: "8:00 PM - 10:00 PM", highDemand: false }
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
              <CardTitle className="text-lg text-gray-900 dark:text-white">Available Days *</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Please select at least one day. Weekend availability increases your chances of selection.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {days.map((day) => (
              <div key={day.name} className={`flex items-center space-x-2 p-2 rounded-lg ${day.highDemand ? 'bg-green-50 border border-green-200' : ''}`}>
                <Checkbox
                  id={day.name}
                  checked={selectedDays.includes(day.name)}
                  onCheckedChange={(checked) => onDayChange(day.name, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={day.name} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    {day.name}
                  </Label>
                  {day.highDemand && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                        High Demand
                      </span>
                    </div>
                  )}
                </div>
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
              <CardTitle className="text-lg text-gray-900 dark:text-white">Preferred Time Slots *</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                Please select at least one time slot. Multiple selections increase earning potential.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <div key={slot.name} className={`flex items-center space-x-2 p-2 rounded-lg ${slot.highDemand ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
                <Checkbox
                  id={slot.name}
                  checked={selectedTimeSlots.includes(slot.name)}
                  onCheckedChange={(checked) => onTimeSlotChange(slot.name, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={slot.name} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    {slot.name}
                  </Label>
                  {slot.highDemand && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                        High Demand
                      </span>
                    </div>
                  )}
                </div>
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
