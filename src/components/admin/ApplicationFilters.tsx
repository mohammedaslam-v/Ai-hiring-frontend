
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ApplicationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  subjectFilter: string;
  setSubjectFilter: (value: string) => void;
  resultFilter: string;
  setResultFilter: (value: string) => void;
  fromDate: Date | undefined;
  setFromDate: (date: Date | undefined) => void;
  toDate: Date | undefined;
  setToDate: (date: Date | undefined) => void;
  onClearDateFilters: () => void;
  scoreRange: [number, number];
  setScoreRange: (value: [number, number]) => void;
  hasSessionOnly: boolean;
  setHasSessionOnly: (value: boolean) => void;
}

const ApplicationFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  subjectFilter,
  setSubjectFilter,
  resultFilter,
  setResultFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onClearDateFilters,
  scoreRange,
  setScoreRange,
  hasSessionOnly,
  setHasSessionOnly
}: ApplicationFiltersProps) => {
  const applyPreset = (preset: 'today' | '7d' | '30d' | 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined;

    switch (preset) {
      case 'today': {
        start = new Date(); start.setHours(0,0,0,0);
        end = new Date(); end.setHours(23,59,59,999);
        break;
      }
      case '7d': {
        end = new Date(); end.setHours(23,59,59,999);
        start = new Date(end);
        start.setDate(end.getDate() - 6);
        start.setHours(0,0,0,0);
        break;
      }
      case '30d': {
        end = new Date(); end.setHours(23,59,59,999);
        start = new Date(end);
        start.setDate(end.getDate() - 29);
        start.setHours(0,0,0,0);
        break;
      }
      case 'thisMonth': {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23,59,59,999);
        break;
      }
      case 'lastMonth': {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        end.setHours(23,59,59,999);
        break;
      }
    }

    setFromDate(start);
    setToDate(end);
  };
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name or email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue" 
          />
        </div>
      </div>
      
      {/* Date Range Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, "PPP") : <span>From Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left",
                  !toDate && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, "PPP") : <span>To Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {(fromDate || toDate) && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClearDateFilters}
            className="text-red-500"
          >
            Clear Dates
          </Button>
        )}
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full md:w-48 border-bambinos-blue/30">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Interview</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="passed">Passed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={resultFilter} onValueChange={setResultFilter}>
        <SelectTrigger className="w-full md:w-48 border-bambinos-blue/30">
          <SelectValue placeholder="Filter by result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Results</SelectItem>
          <SelectItem value="passed">Passed (≥60%)</SelectItem>
          <SelectItem value="failed">Failed (&lt;60%)</SelectItem>
        </SelectContent>
      </Select>

      <Select value={subjectFilter} onValueChange={setSubjectFilter}>
        <SelectTrigger className="w-full md:w-48 border-bambinos-blue/30">
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="math">Math</SelectItem>
          <SelectItem value="phonics">Phonics</SelectItem>
          <SelectItem value="gita">Gita</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced Filters */}
      <div className="flex items-center gap-4 min-w-[260px]">
        <div className="flex flex-col gap-2 w-64">
          <Label className="text-xs text-gray-600">Final Total Score Range: {scoreRange[0]}% - {scoreRange[1]}%</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[scoreRange[0], scoreRange[1]]}
            onValueChange={(v) => setScoreRange([v[0], v[1]] as [number, number])}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={hasSessionOnly} onCheckedChange={setHasSessionOnly} id="has-session" />
          <Label htmlFor="has-session" className="text-sm">Has interview session</Label>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
