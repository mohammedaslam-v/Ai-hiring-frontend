import React, { useId } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  options: readonly Option[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  placeholder: string;
  className?: string;
  activeColor?: string;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  selectedValues,
  onValuesChange,
  placeholder,
  className,
  activeColor = "blue"
}) => {
  const idPrefix = useId();

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onValuesChange(selectedValues.filter(v => v !== value));
    } else {
      onValuesChange([...selectedValues, value]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      return options.find(o => o.value === selectedValues[0])?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  const isActive = selectedValues.length > 0;
  
  const colorClasses = {
    blue: "focus:border-blue-400 focus:ring-blue-400/20",
    emerald: "focus:border-emerald-400 focus:ring-emerald-400/20",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-9 w-full justify-between bg-white border-gray-200 font-normal hover:bg-gray-50",
            isActive && "border-opacity-100 ring-1",
            isActive && activeColor === "blue" && "border-blue-400 ring-blue-400/20",
            isActive && activeColor === "emerald" && "border-emerald-400 ring-emerald-400/20",
            className
          )}
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
          {options.filter(o => o.value !== 'all').map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option.value)}
            >
              {(() => {
                const checkboxId = `${idPrefix}-${option.value}`;
                const labelId = `${checkboxId}-label`;
                return (
                  <>
                    <Checkbox
                      id={checkboxId}
                      checked={selectedValues.includes(option.value)}
                      aria-labelledby={labelId}
                      onCheckedChange={() => toggleOption(option.value)}
                      onClick={(event) => event.stopPropagation()}
                    />
                    <span
                      id={labelId}
                      className="flex-grow cursor-pointer text-sm font-normal"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleOption(option.value);
                      }}
                    >
                      {option.label}
                    </span>
                  </>
                );
              })()}
              {selectedValues.includes(option.value) && (
                <Check className="h-4 w-4 text-blue-500" />
              )}
            </div>
          ))}
        </div>
        {isActive && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs text-blue-600 hover:text-blue-800"
              onClick={() => onValuesChange([])}
            >
              Clear selections
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
