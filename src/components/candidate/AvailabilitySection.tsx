
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
    { name: "Late Night (12AM-4AM)", highDemand: true },
    { name: "Early Morning (4AM-8AM)", highDemand: true },
    { name: "Morning (8AM-12PM)", highDemand: false },
    { name: "Afternoon (12PM-4PM)", highDemand: false },
    { name: "Evening (4PM-8PM)", highDemand: true },
    { name: "Night (8PM-12AM)", highDemand: false }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-red-100 shadow-lg hover:shadow-xl transition-all duration-400" style={{animationDelay: '0.3s'}}>
      {/* Available Days Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-red-700 to-pink-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400 group-hover:rotate-12 group-hover:shadow-xl">
            <Calendar className="h-5 w-5 text-white group-hover:animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">Available Days *</h3>
            <p className="text-sm text-gray-600 mt-1">Please select at least one day. Weekend availability increases your chances of selection.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {days.map((day, index) => (
            <div 
              key={day.name} 
              className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-400 hover:shadow-md hover:-translate-y-1 group animate-fade-in-up border border-transparent hover:border-red-200 ${day.highDemand ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100' : 'hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50'}`}
              style={{animationDelay: `${0.4 + index * 0.1}s`}}
            >
              <Checkbox
                id={day.name}
                checked={selectedDays.includes(day.name)}
                onCheckedChange={(checked) => onDayChange(day.name, checked as boolean)}
                className="group-hover:scale-110 transition-transform duration-400"
              />
              <div className="flex-1">
                <Label htmlFor={day.name} className="text-sm font-semibold text-gray-700 cursor-pointer group-hover:text-red-600 transition-colors duration-300">
                  {day.name}
                </Label>
                {day.highDemand && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-yellow-100 text-green-800 animate-pulse border border-orange-200">
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
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-400 group-hover:rotate-12 group-hover:shadow-xl">
            <Clock className="h-5 w-5 text-white group-hover:animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Preferred Time Slots *</h3>
            <p className="text-sm text-gray-600 mt-1">Please select at least one time slot. Multiple selections increase earning potential.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot, index) => (
            <div 
              key={slot.name} 
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-400 hover:shadow-md hover:-translate-y-1 group animate-fade-in-up ${slot.highDemand ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:from-yellow-100 hover:to-orange-100' : 'border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-200'}`}
              style={{animationDelay: `${0.5 + index * 0.1}s`}}
            >
              <Checkbox
                id={slot.name}
                checked={selectedTimeSlots.includes(slot.name)}
                onCheckedChange={(checked) => onTimeSlotChange(slot.name, checked as boolean)}
                className="group-hover:scale-110 transition-transform duration-400"
              />
              <div className="flex-1">
                <Label htmlFor={slot.name} className="text-sm font-semibold text-gray-700 cursor-pointer group-hover:text-purple-600 transition-colors duration-300">
                  {slot.name}
                </Label>
                {slot.highDemand && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 animate-pulse border border-yellow-200">
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
