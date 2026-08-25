// Onboarding module - the educator's daily teaching window.
//
// Exactly one 5-hour window is chosen, so this behaves like a radio group:
// picking a window replaces whatever was picked before.

import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ONBOARDING_TIME_SLOTS } from '../onboarding.constants';
import { OnboardingFormik } from '../onboarding.types';
import { FieldError } from './OnboardingFields';

interface AvailabilityPickerProps {
  formik: OnboardingFormik;
  onSlotSelect: (slot: string) => void;
}

const AvailabilityPicker = ({ formik, onSlotSelect }: AvailabilityPickerProps) => {
  // Stored as a list to keep the database column's JSON shape; only ever holds one.
  const selected = formik.values.availableSlots[0];
  const error = formik.touched.availableSlots && formik.errors.availableSlots
    ? String(formik.errors.availableSlots)
    : undefined;

  return (
    <div className="space-y-2" id="availableSlots">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Label className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-none block">
          Available Slot <span className="text-red-500">*</span>
        </Label>
        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-semibold">
          <Clock className="h-2.5 w-2.5" />
          5 hours per day
        </span>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400">
        Choose the one 5-hour window you can teach in every day.
      </p>

      <div
        role="radiogroup"
        aria-label="Available slot"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
      >
        {ONBOARDING_TIME_SLOTS.map(slot => {
          const isSelected = selected === slot;
          return (
            <button
              key={slot}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSlotSelect(slot)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left
                border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-bambinos-blue/30
                ${isSelected
                  ? 'border-bambinos-blue bg-bambinos-blue/10 dark:bg-bambinos-blue/20 text-bambinos-blue dark:text-bambinos-blue-light'
                  : 'border-gray-200/80 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:border-bambinos-blue/40'}
                ${error ? 'border-red-300 dark:border-red-500/50' : ''}
              `}
            >
              {/* Radio dot */}
              <span className={`
                w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
                ${isSelected ? 'border-bambinos-blue' : 'border-gray-300 dark:border-gray-500'}
              `}>
                {isSelected && <span className="w-2 h-2 rounded-full bg-bambinos-blue" />}
              </span>
              {slot}
            </button>
          );
        })}
      </div>

      <FieldError message={error} />
    </div>
  );
};

export default AvailabilityPicker;
