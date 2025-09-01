
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { TrendsChartProps } from '@/types/analytics';

const TrendsChart = ({ data }: TrendsChartProps) => {
  return (
    <Card className="border-bambinos-blue/20">
      <CardHeader>
        <CardTitle className="text-bambinos-blue text-xl">Daily Trends</CardTitle>
        <CardDescription>Registrations, interviews and results over time</CardDescription>
      </CardHeader>
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
    </Card>
  );
};

export default TrendsChart;
