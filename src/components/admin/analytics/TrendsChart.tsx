
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TrendsChartProps } from '@/types/analytics';
import { ChevronDown, ChevronUp } from "lucide-react";

const TrendsChart = ({ data }: TrendsChartProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="border-bambinos-blue/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-bambinos-blue text-xl">Daily Trends</CardTitle>
                <CardDescription>Registrations, interviews and results over time</CardDescription>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#3b82f6" name="Registered" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="interviewsStarted" stroke="#f59e0b" name="Started" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="interviewsCompleted" stroke="#10b981" name="Completed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="passed" stroke="#16a34a" name="Passed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Failed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TrendsChart;
