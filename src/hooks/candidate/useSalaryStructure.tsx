import { useMemo } from 'react';
import { Star, Users, Clock } from 'lucide-react';
import { ClassPayment, RenewalBonus, SessionMilestone } from '@/types/candidate';

export const useSalaryStructure = () => {
  const classPayments = useMemo((): ClassPayment[] => [
    {
      type: "Demo Class",
      day: "₹200",
      night: "₹200",
      icon: <Star className="h-5 w-5" />
    },
    {
      type: "Private 1:1 Class",
      day: "₹250",
      night: "₹300",
      icon: <Users className="h-5 w-5" />
    },
    {
      type: "Group Class",
      day: "₹175 (1st) + ₹50 per additional",
      night: "₹200 (1st) + ₹100 per additional",
      icon: <Users className="h-5 w-5" />
    },
    {
      type: "No Show",
      day: "₹75",
      night: "₹75",
      icon: <Clock className="h-5 w-5" />
    }
  ], []);

  const renewalBonuses = useMemo((): RenewalBonus[] => [
    { rate: "85%+", bonus: "₹500", color: "bg-green-500" },
    { rate: "75%-84%", bonus: "₹400", color: "bg-blue-500" },
    { rate: "65%-74%", bonus: "₹300", color: "bg-yellow-500" },
    { rate: "55%-64%", bonus: "₹200", color: "bg-orange-500" }
  ], []);

  const sessionMilestones = useMemo((): SessionMilestone[] => [
    { sessions: 32, increment: "+10%" },
    { sessions: 64, increment: "+10%" },
    { sessions: 96, increment: "+10%" },
    { sessions: 128, increment: "+10%" }
  ], []);

  const classTimings = useMemo(() => ({
    dayShift: "08:00 AM - 10:00 PM IST",
    nightShift: "10:00 PM - 08:00 AM IST"
  }), []);

  const incentives = useMemo(() => ({
    newEnrollment: { amount: "₹200", description: "per student per conversion" },
    renewal24to32: { amount: "₹200", description: "per student per renewal" },
    renewal33to96: { amount: "₹500", description: "per student per renewal" }
  }), []);

  const exampleCalculation = useMemo(() => ({
    totalStudents: 20,
    renewedStudents: 15,
    renewalRate: "75%",
    bonusPerStudent: "₹400",
    totalBonus: "₹6,000"
  }), []);

  return {
    classPayments,
    renewalBonuses,
    sessionMilestones,
    classTimings,
    incentives,
    exampleCalculation
  };
};
