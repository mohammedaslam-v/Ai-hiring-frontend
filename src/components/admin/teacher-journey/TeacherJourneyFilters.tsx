import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TeacherJourneyFilters as FiltersType,
  DEMO_STATUS_OPTIONS,
  TRAINING_STATUS_OPTIONS,
  CERTIFICATION_STATUS_OPTIONS,
  GO_LIVE_OPTIONS,
  SUBJECT_OPTIONS,
  SORT_OPTIONS
} from '@/types/teacherJourney';
import { Search, X, RefreshCw } from 'lucide-react';

interface TeacherJourneyFiltersProps {
  filters: FiltersType;
  onUpdateFilters: (filters: Partial<FiltersType>) => void;
  onResetFilters: () => void;
  onToggleSortOrder: () => void;
  isFiltered: boolean;
}

const TeacherJourneyFilters: React.FC<TeacherJourneyFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  onToggleSortOrder,
  isFiltered
}) => {
  return (
    <div className="bg-white border border-[#F4F6FA] rounded-xl shadow-sm p-4 mb-6 space-y-4">
      {/* First Row: Search and Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(214,100%,15%,0.4)]" />
          <Input
            placeholder="Search by name, email, phone..."
            value={filters.search || ''}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Demo Status */}
        <Select
          value={filters.demoStatus || 'all'}
          onValueChange={(value) => onUpdateFilters({ demoStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Demo Status" />
          </SelectTrigger>
          <SelectContent>
            {DEMO_STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Training Status */}
        <Select
          value={filters.trainingStatus || 'all'}
          onValueChange={(value) => onUpdateFilters({ trainingStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Demo Training Status" />
          </SelectTrigger>
          <SelectContent>
            {TRAINING_STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Certification Status */}
        <Select
          value={filters.certificationStatus || 'all'}
          onValueChange={(value) => onUpdateFilters({ certificationStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Demo Certification" />
          </SelectTrigger>
          <SelectContent>
            {CERTIFICATION_STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Second Row: More Filters and Sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Go-Live Status */}
        <Select
          value={filters.goLiveReadiness || 'all'}
          onValueChange={(value) => onUpdateFilters({ goLiveReadiness: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Demo Go Live Status" />
          </SelectTrigger>
          <SelectContent>
            {GO_LIVE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subject */}
        <Select
          value={filters.assignedSubject || 'all'}
          onValueChange={(value) => onUpdateFilters({ assignedSubject: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={filters.sortBy || 'createdAt'}
          onValueChange={(value) => onUpdateFilters({ sortBy: value as FiltersType['sortBy'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Order Toggle */}
        <Button
          variant="outline"
          onClick={onToggleSortOrder}
          className="flex items-center gap-2"
        >
          {filters.sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </Button>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={onResetFilters}
          disabled={!isFiltered}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Active Filters Display */}
      {isFiltered && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F4F6FA]">
          <span className="text-sm text-[hsl(214,100%,15%,0.6)]">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1E62F2]/10 text-[#1E62F2] rounded-xl text-xs">
              Search: "{filters.search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilters({ search: '' })}
              />
            </span>
          )}
          {filters.demoStatus && filters.demoStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(142,76%,36%,0.1)] text-[hsl(142,76%,36%)] rounded-xl text-xs">
              Demo: {filters.demoStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilters({ demoStatus: 'all' })}
              />
            </span>
          )}
          {filters.trainingStatus && filters.trainingStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(38,92%,50%,0.1)] text-[hsl(38,92%,50%)] rounded-xl text-xs">
              Demo Training: {filters.trainingStatus.replace(/_/g, ' ')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilters({ trainingStatus: 'all' })}
              />
            </span>
          )}
          {filters.certificationStatus && filters.certificationStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FFCC00]/10 text-[#FFCC00] rounded-xl text-xs">
              Demo Certification: {filters.certificationStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilters({ certificationStatus: 'all' })}
              />
            </span>
          )}
          {filters.goLiveReadiness && filters.goLiveReadiness !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(142,76%,36%,0.1)] text-[hsl(142,76%,36%)] rounded-xl text-xs">
              Demo Go Live: {filters.goLiveReadiness.replace(/_/g, ' ')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilters({ goLiveReadiness: 'all' })}
              />
            </span>
          )}
          {filters.assignedSubject && filters.assignedSubject !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[hsl(217,91%,60%,0.1)] text-[hsl(217,91%,60%)] rounded-xl text-xs">
              Subject: {filters.assignedSubject.replace(/_/g, ' ')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onUpdateFilters({ assignedSubject: 'all' })}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherJourneyFilters;

