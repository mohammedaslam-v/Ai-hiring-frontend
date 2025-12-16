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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6 space-y-4">
      {/* First Row: Search and Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
            <SelectValue placeholder="Training Status" />
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
            <SelectValue placeholder="Certification" />
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
            <SelectValue placeholder="Go-Live Status" />
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
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onUpdateFilters({ search: '' })} 
              />
            </span>
          )}
          {filters.demoStatus && filters.demoStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              Demo: {filters.demoStatus}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onUpdateFilters({ demoStatus: 'all' })} 
              />
            </span>
          )}
          {filters.trainingStatus && filters.trainingStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
              Training: {filters.trainingStatus.replace(/_/g, ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onUpdateFilters({ trainingStatus: 'all' })} 
              />
            </span>
          )}
          {filters.certificationStatus && filters.certificationStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
              Certification: {filters.certificationStatus}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onUpdateFilters({ certificationStatus: 'all' })} 
              />
            </span>
          )}
          {filters.goLiveReadiness && filters.goLiveReadiness !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
              Go-Live: {filters.goLiveReadiness.replace(/_/g, ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onUpdateFilters({ goLiveReadiness: 'all' })} 
              />
            </span>
          )}
          {filters.assignedSubject && filters.assignedSubject !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
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

