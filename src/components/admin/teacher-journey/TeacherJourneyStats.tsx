import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TeacherJourneyStats as StatsType } from '@/types/teacherJourney';
import { Users, UserCheck, GraduationCap, Award, Rocket, BookOpen } from 'lucide-react';

interface TeacherJourneyStatsProps {
  stats: StatsType | null;
  loading: boolean;
}

const TeacherJourneyStats: React.FC<TeacherJourneyStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Demo Selected',
      value: stats.demoStats.selected,
      subtitle: `${stats.demoStats.notSelected} not selected`,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Induction Done',
      value: stats.inductionStats.yes,
      subtitle: `${stats.inductionStats.pending} pending`,
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Training Completed',
      value: stats.trainingStats.completed,
      subtitle: `${stats.trainingStats.joined} in progress`,
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Certification Cleared',
      value: stats.certificationStats.cleared,
      subtitle: `${stats.certificationStats.notCleared} not cleared`,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Go-Live Ready',
      value: stats.goLiveStats.yes,
      subtitle: `${stats.goLiveStats.needsMoreTraining} need training`,
      icon: Rocket,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={`${card.bgColor} ${card.borderColor} border hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${card.color}`} />
                <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
              </div>
              <div className="text-sm font-medium text-gray-700">{card.title}</div>
              {card.subtitle && (
                <div className="text-xs text-gray-500 mt-1">{card.subtitle}</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TeacherJourneyStats;

