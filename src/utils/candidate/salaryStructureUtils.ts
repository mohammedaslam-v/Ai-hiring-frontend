export interface ClassPayment {
  type: string;
  day: string;
  night: string;
  iconType: 'star' | 'users' | 'clock';
}

export interface RenewalBonus {
  rate: string;
  bonus: string;
  color: string;
}

export interface SessionMilestone {
  sessions: number;
  increment: string;
}

export interface ClassTimings {
  dayShift: string;
  nightShift: string;
}

export interface Incentive {
  amount: string;
  description: string;
}

export interface Incentives {
  newEnrollment: Incentive;
  renewal24to32: Incentive;
  renewal33to96: Incentive;
}

export interface ExampleCalculation {
  totalStudents: number;
  renewedStudents: number;
  renewalRate: string;
  bonusPerStudent: string;
  totalBonus: string;
}

/**
 * Get class payment structure data
 */
export const getClassPayments = (): ClassPayment[] => [
  {
    type: "Demo Class",
    day: "₹200",
    night: "₹200",
    iconType: 'star'
  },
  {
    type: "Private 1:1 Class",
    day: "₹250",
    night: "₹300",
    iconType: 'users'
  },
  {
    type: "Group Class",
    day: "₹175 (1st) + ₹50 per additional",
    night: "₹200 (1st) + ₹100 per additional",
    iconType: 'users'
  },
  {
    type: "No Show",
    day: "₹75",
    night: "₹75",
    iconType: 'clock'
  }
];

/**
 * Get renewal bonus structure data
 */
export const getRenewalBonuses = (): RenewalBonus[] => [
  { rate: "85%+", bonus: "₹500", color: "bg-green-500" },
  { rate: "75%-84%", bonus: "₹400", color: "bg-blue-500" },
  { rate: "65%-74%", bonus: "₹300", color: "bg-yellow-500" },
  { rate: "55%-64%", bonus: "₹200", color: "bg-orange-500" }
];

/**
 * Get session milestone data for regular class bonus
 */
export const getSessionMilestones = (): SessionMilestone[] => [
  { sessions: 32, increment: "+10%" },
  { sessions: 64, increment: "+10%" },
  { sessions: 96, increment: "+10%" },
  { sessions: 128, increment: "+10%" }
];

/**
 * Get class timing information
 */
export const getClassTimings = (): ClassTimings => ({
  dayShift: "08:00 AM - 10:00 PM IST",
  nightShift: "10:00 PM - 08:00 AM IST"
});

/**
 * Get incentives data
 */
export const getIncentives = (): Incentives => ({
  newEnrollment: { amount: "₹200", description: "per student per conversion" },
  renewal24to32: { amount: "₹200", description: "per student per renewal" },
  renewal33to96: { amount: "₹500", description: "per student per renewal" }
});

/**
 * Get example calculation data
 */
export const getExampleCalculation = (): ExampleCalculation => ({
  totalStudents: 20,
  renewedStudents: 15,
  renewalRate: "75%",
  bonusPerStudent: "₹400",
  totalBonus: "₹6,000"
});
