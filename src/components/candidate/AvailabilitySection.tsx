import { Label } from "@/components/ui/label";
import { Calendar, Clock, Check, Star } from "lucide-react";
import { AvailabilitySectionProps } from '@/types/candidate';

const DayCheckbox = ({ checked, highDemand }: { checked: boolean; highDemand?: boolean }) => {
  const getColorClasses = () => {
    if (!checked) return 'border-gray-300 dark:border-gray-600';
    return highDemand 
      ? 'bg-amber-500 border-amber-500' 
      : 'bg-rose-500 border-rose-500';
  };

  return (
    <div className={`
      h-4 w-4 shrink-0 rounded border-2
      flex items-center justify-center
      transition-all duration-200
      ${getColorClasses()}
      ${checked ? 'shadow-sm' : ''}
    `}>
      {checked && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
    </div>
  );
};

const TimeSlotCheckbox = ({ checked, highDemand }: { checked: boolean; highDemand?: boolean }) => {
  const getColorClasses = () => {
    if (!checked) return 'border-gray-300 dark:border-gray-600';
    return highDemand 
      ? 'bg-amber-500 border-amber-500' 
      : 'bg-violet-500 border-violet-500';
  };

  return (
    <div className={`
      h-4 w-4 shrink-0 rounded border-2
      flex items-center justify-center
      transition-all duration-200
      ${getColorClasses()}
      ${checked ? 'shadow-sm' : ''}
    `}>
      {checked && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
    </div>
  );
};

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
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/50 shadow-soft transition-shadow duration-300 hover:shadow-soft-lg md:h-full flex flex-col">
      {/* Days Section */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-5">
          <div className="flex items-center gap-3 h-8">
            <div className="w-8 h-8 bg-rose-500/10 dark:bg-rose-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-none">Available Days *</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-semibold leading-none self-start sm:self-auto">
            <Star className="h-2.5 w-2.5 fill-current" />
            High Demand
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {days.map((day) => {
            const isSelected = selectedDays.includes(day.name);
            return (
              <div 
                key={day.name} 
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer
                  min-h-[60px]
                  transition-all duration-200 ease-out
                  group
                  ${isSelected
                    ? day.highDemand 
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-600/50 shadow-sm' 
                      : 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-600/50 shadow-sm'
                    : 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/50 hover:border-rose-300 dark:hover:border-rose-600/50 hover:bg-rose-50/50 dark:hover:bg-rose-900/10'
                  }
                `}
                onClick={() => onDayChange(day.name, !isSelected)}
              >
                <DayCheckbox checked={isSelected} highDemand={day.highDemand} />
                <Label className={`
                  text-xs font-semibold cursor-pointer select-none mt-2 leading-none
                  transition-colors duration-200
                  ${isSelected 
                    ? day.highDemand 
                      ? 'text-amber-700 dark:text-amber-400' 
                      : 'text-rose-700 dark:text-rose-400'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-400'
                  }
                `}>
                  {day.short}
                  {day.highDemand && (
                    <Star className="inline h-2 w-2 ml-0.5 text-amber-500 fill-amber-500" />
                  )}
                </Label>
              </div>
            );
          })}
        </div>
        {dayError && (
          <p className="text-red-500 text-xs font-medium mt-2 leading-none">{dayError}</p>
        )}
      </div>

      {/* Time Slots Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-5 h-8 shrink-0">
          <div className="w-8 h-8 bg-violet-500/10 dark:bg-violet-500/20 rounded-lg flex items-center justify-center shrink-0">
            <Clock className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-none">Time Slots *</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 content-start">
          {timeSlots.map((slot) => {
            const isSelected = selectedTimeSlots.includes(slot.name);
            return (
              <div 
                key={slot.name} 
                className={`
                  flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer
                  min-h-9
                  transition-all duration-200 ease-out
                  group
                  ${isSelected
                    ? slot.highDemand 
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-600/50 shadow-sm' 
                      : 'bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-600/50 shadow-sm'
                    : 'bg-gray-50/50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600/50 hover:border-violet-300 dark:hover:border-violet-600/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
                  }
                `}
                onClick={() => onTimeSlotChange(slot.name, !isSelected)}
              >
                <TimeSlotCheckbox checked={isSelected} highDemand={slot.highDemand} />
                <Label className={`
                  text-xs font-semibold cursor-pointer select-none leading-none
                  transition-colors duration-200
                  ${isSelected 
                    ? slot.highDemand 
                      ? 'text-amber-700 dark:text-amber-400' 
                      : 'text-violet-700 dark:text-violet-400'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                  }
                `}>
                  {slot.short}
                  {slot.highDemand && (
                    <Star className="inline h-2 w-2 ml-1 text-amber-500 fill-amber-500" />
                  )}
                </Label>
              </div>
            );
          })}
        </div>
        {timeSlotError && (
          <p className="text-red-500 text-xs font-medium mt-2 leading-none">{timeSlotError}</p>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySection;
