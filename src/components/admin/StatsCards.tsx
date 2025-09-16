
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PlayCircle, Target, StopCircle, CheckCircle, XCircle } from "lucide-react";

import { DetailedStats, StatsCardsProps } from '@/types/admin';

const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  // Handle loading state
  if (isLoading || !stats) {
    return (
      <Card className="border-bambinos-blue/20 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-bambinos-blue text-2xl">📊 Simple Stats - Easy to Understand!</CardTitle>
          <CardDescription className="text-lg">Numbers and percentages that tell the whole story</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-gray-100 border-2 border-dashed border-gray-300">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const detailedStatsCards = [
    { 
      title: "📝 Total Registered", 
      value: stats.totalRegistered.toString(), 
      subtitle: "Applicants filled form",
      icon: Users, 
      color: "text-bambinos-blue",
      bgColor: "bg-blue-50"
    },
    { 
      title: "🚀 Started AI Interview", 
      value: `${stats.totalStartedInterview} (${stats.interviewStartRate}%)`, 
      subtitle: `${stats.neverStartedInterview} never started`,
      icon: PlayCircle, 
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    { 
      title: "✅ Completed Interview", 
      value: `${stats.totalCompletedInterview} (${stats.interviewCompletionRate.toFixed(1)}%)`, 
      subtitle: "Finished full AI interview",
      icon: Target, 
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    // Left Midway removed per request
    { 
      title: "🎉 PASSED", 
      value: `${stats.totalPassed} (${stats.passRate.toFixed(1)}%)`, 
      subtitle: "Out of completed interviews",
      icon: CheckCircle, 
      color: "text-green-700",
      bgColor: "bg-green-100"
    },
    { 
      title: "❌ FAILED", 
      value: `${stats.totalFailed} (${stats.failRate.toFixed(1)}%)`, 
      subtitle: "Out of completed interviews",
      icon: XCircle, 
      color: "text-red-700",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <Card className="border-bambinos-blue/20 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-bambinos-blue text-2xl">📊 Simple Stats - Easy to Understand!</CardTitle>
        <CardDescription className="text-lg">Numbers and percentages that tell the whole story</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailedStatsCards.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} border-2 border-dashed border-gray-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.subtitle}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} ml-3`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Summary in Simple Language */}
        <div className="mt-6 p-4 bg-white rounded-lg border-2 border-dashed border-bambinos-blue">
          <h3 className="text-lg font-bold text-bambinos-blue mb-2">🎯 Quick Summary</h3>
          <div className="text-gray-700 space-y-1">
            <p>• <strong>{stats.totalRegistered} people</strong> filled the application form</p>
            <p>• <strong>{stats.totalStartedInterview} people ({stats.interviewStartRate.toFixed(1)}%)</strong> started the AI interview</p>
            <p>• <strong>{stats.neverStartedInterview} people</strong> never even started the interview</p>
            {null}
            <p>• <strong>{stats.totalCompletedInterview} people ({stats.interviewCompletionRate.toFixed(1)}%)</strong> completed the full interview</p>
            <p>• Out of those who completed: <strong>{stats.totalPassed} passed ({stats.passRate.toFixed(1)}%)</strong> and <strong>{stats.totalFailed} failed ({stats.failRate.toFixed(1)}%)</strong></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCards;
