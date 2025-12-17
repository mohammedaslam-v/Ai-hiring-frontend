
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
    { name: "Monday", short: "Mon", highDemand: false },
    { name: "Tuesday", short: "Tue", highDemand: false },
    { name: "Wednesday", short: "Wed", highDemand: false },
    { name: "Thursday", short: "Thu", highDemand: false },
    { name: "Friday", short: "Fri", highDemand: false },
    { name: "Saturday", short: "Sat", highDemand: true },
    { name: "Sunday", short: "Sun", highDemand: true }
  ];

  const timeSlots = [
    { name: "Late Night (12AM-4AM)", short: "12AM-4AM", highDemand: true },
    { name: "Early Morning (4AM-8AM)", short: "4AM-8AM", highDemand: true },
    { name: "Morning (8AM-12PM)", short: "8AM-12PM", highDemand: false },
    { name: "Afternoon (12PM-4PM)", short: "12PM-4PM", highDemand: false },
    { name: "Evening (4PM-8PM)", short: "4PM-8PM", highDemand: true },
    { name: "Night (8PM-12AM)", short: "8PM-12AM", highDemand: false }
  ];

  return (
    <div className="bg-gradient-to-br from-rose-50/50 to-white rounded-xl p-4 border border-rose-100 h-full flex flex-col">
      {/* Days Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Available Days *</h3>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">★ High Demand</span>
        </div>
        
        <div className="grid grid-cols-4 gap-1.5">
          {days.map((day) => (
            <div 
              key={day.name} 
              className={`flex flex-col items-center p-2 rounded-lg border cursor-pointer transition-all ${
                selectedDays.includes(day.name)
                  ? day.highDemand 
                    ? 'bg-amber-50 border-amber-300' 
                    : 'bg-rose-50 border-rose-300'
                  : 'bg-white border-gray-200 hover:border-rose-200'
              }`}
              onClick={() => onDayChange(day.name, !selectedDays.includes(day.name))}
            >
              <Checkbox
                id={day.name}
                checked={selectedDays.includes(day.name)}
                onCheckedChange={(checked) => onDayChange(day.name, checked as boolean)}
                className={`h-4 w-4 ${day.highDemand ? 'data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600' : 'data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600'}`}
              />
              <Label htmlFor={day.name} className="text-[10px] font-medium text-gray-700 cursor-pointer mt-1">
                {day.short}{day.highDemand && <span className="text-amber-500">★</span>}
              </Label>
            </div>
          ))}
        </div>
        {dayError && <p className="text-red-500 text-[10px] mt-1">{dayError}</p>}
      </div>

      {/* Time Slots Section */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Time Slots *</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {timeSlots.map((slot) => (
            <div 
              key={slot.name} 
              className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-all ${
                selectedTimeSlots.includes(slot.name)
                  ? slot.highDemand 
                    ? 'bg-amber-50 border-amber-300' 
                    : 'bg-purple-50 border-purple-300'
                  : 'bg-white border-gray-200 hover:border-purple-200'
              }`}
              onClick={() => onTimeSlotChange(slot.name, !selectedTimeSlots.includes(slot.name))}
            >
              <Checkbox
                id={slot.name}
                checked={selectedTimeSlots.includes(slot.name)}
                onCheckedChange={(checked) => onTimeSlotChange(slot.name, checked as boolean)}
                className={`h-3.5 w-3.5 ${slot.highDemand ? 'data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600' : 'data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600'}`}
              />
              <Label htmlFor={slot.name} className="text-[10px] font-medium text-gray-700 cursor-pointer">
                {slot.short}{slot.highDemand && <span className="text-amber-500 ml-0.5">★</span>}
              </Label>
            </div>
          ))}
        </div>
        {timeSlotError && <p className="text-red-500 text-[10px] mt-1">{timeSlotError}</p>}
      </div>
    </div>
  );
};

export default AvailabilitySection;
