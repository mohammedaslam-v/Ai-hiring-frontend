
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";
import { AVAILABLE_DAYS, TIME_SLOTS } from "@/utils/constants/data";
import { AvailabilitySectionProps } from '@/types/candidate';

const AvailabilitySection = ({ 
  selectedDays, 
  selectedTimeSlots, 
  onDayChange, 
  onTimeSlotChange,
  dayError,
  timeSlotError
}: AvailabilitySectionProps) => {
  const days = AVAILABLE_DAYS;
  const timeSlots = TIME_SLOTS;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            <Calendar className="h-6 w-6 text-blue-600" />
            Available Days
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Select the days you are available for teaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {days.map((day) => (
              <div key={day.name} className={`flex items-center space-x-2 p-2 rounded-lg ${day.highDemand ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
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

      <Card className="border-2 border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            <Clock className="h-6 w-6 text-green-600" />
            Available Time Slots
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Select the time slots you are available for teaching
          </CardDescription>
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
