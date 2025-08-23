
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface DetailedStats {
  totalRegistered: number;
  totalStartedInterview: number;
  totalCompletedInterview: number;
  totalLeftMidway: number;
  neverStartedInterview: number;
  totalPassed: number;
  totalFailed: number;
  interviewStartRate: number;
  interviewCompletionRate: number;
  passRate: number;
  failRate: number;
  leftMidwayRate: number;
}

interface AlertsBannerProps {
  detailedStats: DetailedStats;
}

const AlertsBanner = ({ detailedStats }: AlertsBannerProps) => {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const a: string[] = [];
    if (detailedStats.passRate > 0 && detailedStats.passRate < 30) {
      a.push("Pass rate is below 30%. Consider reviewing interview difficulty or criteria.");
    }
    if (detailedStats.leftMidwayRate > 40) {
      a.push("High drop-off during interviews (>40%). Investigate candidate experience and stability.");
    }
    if (detailedStats.interviewStartRate < 50) {
      a.push("Less than half of applicants start the interview. Check communication and reminders.");
    }
    setAlerts(a);
  }, [detailedStats]);

  if (alerts.length === 0) return null;

  return (
    <Card className="border-yellow-400 bg-yellow-50/80 mb-6">
      <CardContent className="py-3">
        <div className="flex items-start gap-3 text-yellow-800">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div className="space-y-1">
            {alerts.map((msg, i) => (
              <div key={i} className="text-sm">• {msg}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsBanner;
