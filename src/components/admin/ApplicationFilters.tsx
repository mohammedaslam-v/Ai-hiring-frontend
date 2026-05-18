
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarDays } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";



//t


const ApplicationFilters = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 border-bambinos-blue/30 focus:border-bambinos-blue focus:ring-bambinos-blue"
            disabled
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
                className="w-[180px] justify-start text-left"
                disabled
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>From Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                disabled
                className="p-3 pointer-events-none"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[180px] justify-start text-left"
                disabled
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>To Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                disabled
                className="p-3 pointer-events-none"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          disabled
        >
          Clear Dates
        </Button>
      </div>

      <Select disabled>
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

      <Select disabled>
        <SelectTrigger className="w-full md:w-48 border-bambinos-blue/30">
          <SelectValue placeholder="Filter by result" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Results</SelectItem>
          <SelectItem value="passed">Passed (≥60%)</SelectItem>
          <SelectItem value="failed">Failed (&lt;60%)</SelectItem>
        </SelectContent>
      </Select>

      <Select disabled>
        <SelectTrigger className="w-full md:w-48 border-bambinos-blue/30">
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="math">Math</SelectItem>
          <SelectItem value="phonics">Phonics</SelectItem>
          <SelectItem value="gita">Gita</SelectItem>
          <SelectItem value="science">Science</SelectItem>
          <SelectItem value="sanatan-unbox">Sanatan Unbox</SelectItem>
          <SelectItem value="kannada">Kannada</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced Filters */}
      <div className="flex items-center gap-4 min-w-[260px]">
        <div className="flex flex-col gap-2 w-64">
          <Label className="text-xs text-gray-600">Final Total Score Range: 0% - 100%</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[0, 100]}
            disabled
            className="pointer-events-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch disabled id="has-session" />
          <Label htmlFor="has-session" className="text-sm text-gray-400">Has interview session</Label>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;
