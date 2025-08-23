
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, DollarSign, Star, GraduationCap, Clock, Users, TrendingUp } from "lucide-react";

const AssessmentSalaryStructure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/candidate/application')}
            className="flex items-center gap-2 text-bambinos-blue hover:text-bambinos-blue/80 hover:bg-bambinos-blue/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Application
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-bambinos-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-bambinos-blue mb-6 tracking-tight">
            Assessment Specialist
          </h1>
          <p className="text-2xl font-semibold text-bambinos-orange mb-4">Payment Structure</p>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Join our team with competitive rates for demo classes and assessments. Build your career while making a difference in children's education.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-bambinos-blue/20 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-bambinos-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-bambinos-orange" />
              </div>
              <h3 className="font-semibold text-bambinos-blue mb-2">Flexible Hours</h3>
              <p className="text-gray-600 text-sm">Choose your preferred 8-hour shift</p>
            </CardContent>
          </Card>
          
          <Card className="border-bambinos-blue/20 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-bambinos-pink/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-bambinos-blue" />
              </div>
              <h3 className="font-semibold text-bambinos-blue mb-2">Comprehensive Training</h3>
              <p className="text-gray-600 text-sm">One week intensive training program</p>
            </CardContent>
          </Card>
          
          <Card className="border-bambinos-blue/20 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-bambinos-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-bambinos-orange" />
              </div>
              <h3 className="font-semibold text-bambinos-blue mb-2">Performance Incentives</h3>
              <p className="text-gray-600 text-sm">Earn extra for each conversion</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Structure Table */}
        <Card className="border-bambinos-blue/20 bg-white shadow-2xl overflow-hidden">
          <CardHeader className="bg-bambinos-blue text-white">
            <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-3">
              <DollarSign className="h-8 w-8" />
              Compensation Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-bambinos-blue/10 bg-gray-50">
                    <th className="text-left py-6 px-8 font-bold text-bambinos-blue text-lg">
                      <div className="flex items-center gap-3">
                        <Award className="h-6 w-6" />
                        Category
                      </div>
                    </th>
                    <th className="text-center py-6 px-8 font-bold text-bambinos-orange text-lg">
                      <div className="flex items-center justify-center gap-3">
                        <Star className="h-6 w-6" />
                        Day Shift
                      </div>
                    </th>
                    <th className="text-center py-6 px-8 font-bold text-bambinos-blue text-lg">
                      <div className="flex items-center justify-center gap-3">
                        <DollarSign className="h-6 w-6" />
                        Night Shift
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-bambinos-pink/10 hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-8 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-bambinos-blue/10 rounded-xl flex items-center justify-center">
                          <DollarSign className="h-7 w-7 text-bambinos-blue" />
                        </div>
                        <div>
                          <h3 className="font-bold text-bambinos-blue text-lg">Fixed Guaranteed Payment</h3>
                          <p className="text-gray-500 text-sm">Monthly compensation</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-8 text-center">
                      <div className="bg-bambinos-yellow/20 rounded-xl p-6">
                        <div className="text-bambinos-orange">
                          <div className="text-3xl font-bold mb-2">₹25,000</div>
                          <div className="text-sm font-medium mb-3">per month</div>
                          <Separator className="my-3 bg-bambinos-orange/20" />
                          <div className="text-xs text-gray-600 bg-white/60 rounded-lg p-2">
                            08:00 AM – 08:00 PM IST<br />
                            <span className="font-medium">(any 8 hours)</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-8 text-center">
                      <div className="bg-bambinos-blue/10 rounded-xl p-6">
                        <div className="text-bambinos-blue">
                          <div className="text-3xl font-bold mb-2">₹30,000</div>
                          <div className="text-sm font-medium mb-3">per month</div>
                          <Separator className="my-3 bg-bambinos-blue/20" />
                          <div className="text-xs text-gray-600 bg-white/60 rounded-lg p-2">
                            09:00 PM – 09:00 AM IST<br />
                            <span className="font-medium">(any 8 hours)</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-bambinos-pink/10 hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-8 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-bambinos-orange/20 rounded-xl flex items-center justify-center">
                          <Award className="h-7 w-7 text-bambinos-orange" />
                        </div>
                        <div>
                          <h3 className="font-bold text-bambinos-blue text-lg">Conversion Incentives</h3>
                          <p className="text-gray-500 text-sm">Performance-based bonus</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-8 text-center">
                      <div className="bg-bambinos-yellow/20 rounded-xl p-6">
                        <div className="text-bambinos-orange">
                          <div className="text-3xl font-bold mb-2">₹200</div>
                          <div className="text-sm font-medium mb-3">per conversion</div>
                          <Separator className="my-3 bg-bambinos-orange/20" />
                          <div className="text-xs text-gray-600 bg-white/60 rounded-lg p-2 italic">
                            When student enrolls
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-8 text-center">
                      <div className="bg-bambinos-blue/10 rounded-xl p-6">
                        <div className="text-bambinos-blue">
                          <div className="text-3xl font-bold mb-2">₹200</div>
                          <div className="text-sm font-medium mb-3">per conversion</div>
                          <Separator className="my-3 bg-bambinos-blue/20" />
                          <div className="text-xs text-gray-600 bg-white/60 rounded-lg p-2 italic">
                            When student enrolls
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-8 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-bambinos-pink/30 rounded-xl flex items-center justify-center">
                          <GraduationCap className="h-7 w-7 text-bambinos-blue" />
                        </div>
                        <div>
                          <h3 className="font-bold text-bambinos-blue text-lg">Training Program</h3>
                          <p className="text-gray-500 text-sm">Complete preparation</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-8 text-center" colSpan={2}>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="text-bambinos-blue">
                          <div className="text-lg font-semibold mb-2">Comprehensive Training Package</div>
                          <div className="text-sm text-gray-600 max-w-md mx-auto">
                            One week intensive training program with demo practice sessions, assessment techniques, and ongoing support
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-bambinos-blue mb-4">Ready to Join Our Team?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start your journey as an Assessment Specialist and make a meaningful impact in children's education while earning competitive compensation.
            </p>
            <Button 
              onClick={() => navigate('/candidate/application')}
              className="bg-bambinos-blue hover:bg-bambinos-blue/90 text-white px-12 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-xl"
            >
              Apply Now
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSalaryStructure;
