
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  GraduationCap, 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp, 
  Gift,
  Award,
  Calendar,
  Star,
  Target,
  Headphones,
  IndianRupee
} from "lucide-react";
import { 
  getClassPayments, 
  getRenewalBonuses, 
  getSessionMilestones, 
  getClassTimings, 
  getIncentives, 
  getExampleCalculation 
} from "@/utils/candidate/salaryStructureUtils";
import { getIconComponent } from "@/utils/candidate/iconUtils";

const SimplifiedSalaryStructure = () => {
  const navigate = useNavigate();

  // Get data from utility functions
  const classPayments = getClassPayments();
  const renewalBonuses = getRenewalBonuses();
  const sessionMilestones = getSessionMilestones();
  const classTimings = getClassTimings();
  const incentives = getIncentives();
  const exampleCalculation = getExampleCalculation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/candidate/application')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Application
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-12 h-12 rounded-full" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight">
            Bambinos.live
          </h1>
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Simplified Payment Structure</p>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Comprehensive payment structure with training, class rates, incentives, and bonus systems designed to reward excellence in education.
          </p>
        </div>

        {/* Training Period */}
        <Card className="mb-12 border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold">Training Period</CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Attend All Training Sessions</h4>
                    <p className="text-gray-600 dark:text-gray-300">Participate in all scheduled training sessions as per the training calendar</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Clear Final Certification</h4>
                    <p className="text-gray-600 dark:text-gray-300">Successfully complete mock demos and certification by the SME</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <IndianRupee className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-bold text-amber-800 dark:text-amber-200 text-lg">Payment Policy</h4>
                </div>
                <p className="text-amber-700 dark:text-amber-300 text-base">
                  <strong>No payment during training period.</strong> Payment starts once the educator is confirmed and goes live after successful completion of training.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Payments */}
        <Card className="mb-12 border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-center mb-4">
              <IndianRupee className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold">Class Payments (45-minute classes)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-6 px-8 font-bold text-gray-900 dark:text-white text-lg">Class Type</th>
                    <th className="text-center py-6 px-8 font-bold text-blue-600 dark:text-blue-400 text-lg">Day Shift Payment</th>
                    <th className="text-center py-6 px-8 font-bold text-purple-600 dark:text-purple-400 text-lg">Night Shift Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {classPayments.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                            {getIconComponent(payment.iconType)}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{payment.type}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-center">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                          <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">{payment.day}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-center">
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                          <span className="text-purple-700 dark:text-purple-300 font-bold text-lg">{payment.night}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Class Timings & 25-Minute Classes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-2xl">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-center">Class Timings</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <span className="font-semibold text-orange-800 dark:text-orange-200">Day Shift</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{classTimings.dayShift}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <span className="font-semibold text-blue-800 dark:text-blue-200">Night Shift</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{classTimings.nightShift}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-2xl">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-center">25-Minute Classes</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Half Rate Payment</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Payout is <strong>50% of the 45-minute class rate</strong> for all class types
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incentives */}
        <Card className="mb-12 border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold">Incentives</CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-2 text-lg">New Enrollment</h4>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{incentives.newEnrollment.amount}</p>
                <p className="text-green-700 dark:text-green-300 text-sm">{incentives.newEnrollment.description}</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2 text-lg">Renewal (24-32 sessions)</h4>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{incentives.renewal24to32.amount}</p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">{incentives.renewal24to32.description}</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2 text-lg">Renewal (33-96 sessions)</h4>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{incentives.renewal33to96.amount}</p>
                <p className="text-purple-700 dark:text-purple-300 text-sm">{incentives.renewal33to96.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regular Class Bonus */}
        <Card className="mb-12 border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-2xl">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Regular Class Bonus</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                <strong>10% payment increment</strong> every time a student completes:
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sessionMilestones.map((milestone, index) => (
                <div key={index} className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">{milestone.sessions}</div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">sessions</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">{milestone.increment}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Additional Renewal Bonus */}
        <Card className="mb-12 border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold">Monthly Additional Renewal Bonus</CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {renewalBonuses.map((bonus, index) => (
                <div key={index} className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className={`w-12 h-12 ${bonus.color} rounded-full flex items-center justify-center`}>
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{bonus.rate} renewal rate</span>
                      <span className="font-bold text-2xl text-gray-900 dark:text-white">{bonus.bonus}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">per student</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Example Calculation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
              <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-4 text-xl flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Example Calculation
              </h4>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{exampleCalculation.totalStudents}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Students up for renewal</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{exampleCalculation.renewedStudents}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Students renewed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{exampleCalculation.renewalRate}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Renewal rate ({exampleCalculation.renewedStudents}/{exampleCalculation.totalStudents})</div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Calculation:</strong> {exampleCalculation.renewalRate} renewal rate = {exampleCalculation.bonusPerStudent} per student
                </p>
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-4">
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {exampleCalculation.bonusPerStudent} × {exampleCalculation.renewedStudents} students = {exampleCalculation.totalBonus} renewal bonus
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="mb-12 border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-2xl">
            <div className="flex items-center justify-center mb-4">
              <Headphones className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Support</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-xl">Dedicated Training Support Managers (TSMs)</h4>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                TSMs are assigned during training to provide comprehensive support and guidance to educators throughout their journey.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/20">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Ready to Join Our Team?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Start your journey with our comprehensive payment structure designed to reward excellence and growth in education.
            </p>
            <Button 
              onClick={() => navigate('/candidate/application')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-2xl"
            >
              Apply Now
              <ArrowLeft className="ml-3 h-6 w-6 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculator component for the example
const Calculator = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" x2="16" y1="6" y2="6"/>
    <line x1="16" x2="16" y1="14" y2="18"/>
    <path d="m16 10 4 4-4 4"/>
    <path d="M8 18v-5a4 4 0 0 1 8 0v5"/>
  </svg>
);

export default SimplifiedSalaryStructure;
