
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
    { name: "Wednesday", highDemand: false },
    { name: "Friday", highDemand: false },
    { name: "Tuesday", highDemand: false },
    { name: "Thursday", highDemand: false },
    { name: "Saturday", highDemand: true },
    { name: "Sunday", highDemand: true }
  ];

  const timeSlots = [
    { name: "Late Night (12AM-4AM)", highDemand: true },
    { name: "Early Morning (4AM-8AM)", highDemand: true },
    { name: "Morning (8AM-12PM)", highDemand: false },
    { name: "Afternoon (12PM-4PM)", highDemand: false },
    { name: "Evening (4PM-8PM)", highDemand: true },
    { name: "Night (8PM-12AM)", highDemand: false }
  ];

  return (
    <div className="space-y-6">
      {/* Available Days Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Available Days *</h3>
        </div>
        <p className="text-sm text-gray-600">Please select at least one day. Weekend availability increases your chances of selection.</p>
        
        <div className="grid grid-cols-2 gap-3">
          {days.map((day) => (
            <div key={day.name} className={`flex items-center space-x-2 p-3 rounded-lg ${day.highDemand ? 'bg-green-50 border border-green-200' : ''}`}>
              <Checkbox
                id={day.name}
                checked={selectedDays.includes(day.name)}
                onCheckedChange={(checked) => onDayChange(day.name, checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor={day.name} className="text-sm font-medium text-gray-700 cursor-pointer">
                  {day.name}
                </Label>
                {day.highDemand && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
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
      </div>

      {/* Preferred Time Slots Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Preferred Time Slots *</h3>
        </div>
        <p className="text-sm text-gray-600">Please select at least one time slot. Multiple selections increase earning potential.</p>
        
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <div key={slot.name} className={`flex items-center space-x-2 p-3 rounded-lg border ${slot.highDemand ? 'bg-yellow-50 border-yellow-300' : 'border-gray-200'}`}>
              <Checkbox
                id={slot.name}
                checked={selectedTimeSlots.includes(slot.name)}
                onCheckedChange={(checked) => onTimeSlotChange(slot.name, checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor={slot.name} className="text-sm font-medium text-gray-700 cursor-pointer">
                  {slot.name}
                </Label>
                {slot.highDemand && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
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
      </div>
    </div>
  );
};

export default AvailabilitySection;
