
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { FunnelChartProps } from '@/types/analytics';

const FunnelChart = ({ data }: FunnelChartProps) => {
  // Transform the data to match the chart format
  const chartData = data.map(item => ({
    stage: item.stage,
    value: item.count
  }));

  return (
    <Card className="border-bambinos-blue/20">
      <CardHeader>
        <CardTitle className="text-bambinos-blue text-xl">Funnel Overview</CardTitle>
        <CardDescription>Conversion across key stages</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="stage" width={90} />
            <Tooltip />
            <Bar dataKey="value" name="Count" fill="#3b82f6" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FunnelChart;
