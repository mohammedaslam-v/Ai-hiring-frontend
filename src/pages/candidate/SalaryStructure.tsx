
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, TrendingUp, Shield, GraduationCap, Clock, Users, Star } from "lucide-react";

const SalaryStructure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/candidate/application')}
            className="flex items-center gap-2 text-bambinos-blue hover:text-bambinos-blue/80 hover:bg-bambinos-blue/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-bambinos-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-bambinos-blue mb-4">Educator Payment Structure</h1>
          <p className="text-gray-600 text-lg">Competitive compensation with growth opportunities</p>
        </div>

        {/* Average Monthly Earnings */}
        <Card className="mb-8 border-bambinos-blue/20 bg-white shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-4xl font-bold text-bambinos-blue mb-2">₹50,000+</h2>
            <h3 className="text-xl font-semibold text-bambinos-blue mb-2">Average Monthly Earnings</h3>
            <p className="text-gray-600">Based on 220 teaching hours per month</p>
          </CardContent>
        </Card>

        {/* Session Rates */}
        <Card className="mb-8 border-bambinos-blue/20 bg-white shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-bambinos-blue" />
              <CardTitle className="text-xl text-bambinos-blue">Session Rates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-bambinos-blue/20">
                    <th className="text-left py-3 font-semibold text-bambinos-blue">Session Type</th>
                    <th className="text-left py-3 font-semibold text-bambinos-blue">Duration</th>
                    <th className="text-left py-3 font-semibold text-bambinos-blue">Day Shift Rate (₹)</th>
                    <th className="text-left py-3 font-semibold text-bambinos-blue">Night Shift Rate (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-bambinos-pink/20">
                    <td className="py-3 text-gray-700">Shift Timings</td>
                    <td className="py-3 text-gray-700">—</td>
                    <td className="py-3 text-bambinos-orange font-medium">8:00 AM - 10:00 PM</td>
                    <td className="py-3 text-bambinos-blue font-medium">10:00 PM - 8:00 AM</td>
                  </tr>
                  <tr className="border-b border-bambinos-pink/20">
                    <td className="py-3 text-gray-700">Private Session (1:1)</td>
                    <td className="py-3 text-gray-700">25 min</td>
                    <td className="py-3 text-bambinos-orange font-medium">₹125</td>
                    <td className="py-3 text-bambinos-blue font-medium">₹150</td>
                  </tr>
                  <tr className="border-b border-bambinos-pink/20">
                    <td className="py-3 text-gray-700">Private Session (1:1)</td>
                    <td className="py-3 text-gray-700">45 min</td>
                    <td className="py-3 text-bambinos-orange font-medium">₹225</td>
                    <td className="py-3 text-bambinos-blue font-medium">₹300</td>
                  </tr>
                  <tr className="border-b border-bambinos-pink/20">
                    <td className="py-3 text-gray-700">Group Session (Max 6 students)</td>
                    <td className="py-3 text-gray-700">45 min</td>
                    <td className="py-3 text-bambinos-orange font-medium">₹150 + ₹50/student</td>
                    <td className="py-3 text-bambinos-blue font-medium">₹200 + ₹100/student</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-700">No-Show</td>
                    <td className="py-3 text-gray-700">—</td>
                    <td className="py-3 text-bambinos-orange font-medium">₹50</td>
                    <td className="py-3 text-bambinos-blue font-medium">₹50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Conversion & Renewal Incentives */}
        <Card className="mb-8 border-bambinos-blue/20 bg-white shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-bambinos-blue" />
              <CardTitle className="text-xl text-bambinos-blue">Conversion & Renewal Incentives</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-bambinos-blue/10 rounded-xl p-6 text-center border border-bambinos-blue/20">
                <h3 className="text-2xl font-bold text-bambinos-blue mb-2">₹200</h3>
                <p className="text-gray-700 font-medium">24-32 Sessions</p>
              </div>
              <div className="bg-bambinos-yellow/20 rounded-xl p-6 text-center border border-bambinos-yellow/30">
                <h3 className="text-2xl font-bold text-bambinos-orange mb-2">₹500</h3>
                <p className="text-gray-700 font-medium">33-64 Sessions</p>
              </div>
              <div className="bg-bambinos-pink/20 rounded-xl p-6 text-center border border-bambinos-pink/30">
                <h3 className="text-2xl font-bold text-bambinos-blue mb-2">₹1000</h3>
                <p className="text-gray-700 font-medium">65-96 Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Benefits */}
        <Card className="mb-8 border-bambinos-blue/20 bg-white shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-bambinos-blue" />
              <CardTitle className="text-xl text-bambinos-blue">Additional Benefits</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-bambinos-blue/10 rounded-xl p-6 border border-bambinos-blue/20">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-bambinos-blue" />
                  <h3 className="font-semibold text-bambinos-blue">Monthly Renewal Bonus</h3>
                </div>
                <p className="text-gray-600">Generous bonus every month</p>
              </div>
              <div className="bg-bambinos-yellow/20 rounded-xl p-6 border border-bambinos-yellow/30">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-6 w-6 text-bambinos-orange" />
                  <h3 className="font-semibold text-bambinos-orange">10% Increment</h3>
                </div>
                <p className="text-gray-600">For every 32 sessions completed</p>
              </div>
              <div className="bg-bambinos-pink/20 rounded-xl p-6 border border-bambinos-pink/30">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-6 w-6 text-bambinos-blue" />
                  <h3 className="font-semibold text-bambinos-blue">Health Insurance</h3>
                </div>
                <p className="text-gray-600">Coverage worth ₹2 lakhs</p>
              </div>
              <div className="bg-bambinos-orange/20 rounded-xl p-6 border border-bambinos-orange/30">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="h-6 w-6 text-bambinos-orange" />
                  <h3 className="font-semibold text-bambinos-orange">Training Support</h3>
                </div>
                <p className="text-gray-600">Comprehensive training programs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Minimum Requirements */}
        <Card className="mb-8 border-bambinos-blue/20 bg-white shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-bambinos-blue" />
              <CardTitle className="text-xl text-bambinos-blue">Minimum Requirements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-bambinos-blue rounded-full"></div>
                <span className="text-gray-700">120 hours per month dedication</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-bambinos-blue rounded-full"></div>
                <span className="text-gray-700">Minimum 12-month commitment</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-bambinos-blue rounded-full"></div>
                <span className="text-gray-700">Complete training certification</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-bambinos-blue rounded-full"></div>
                <span className="text-gray-700">Weekly break allowed (preferably not weekends)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/candidate/application')}
            className="bg-bambinos-blue hover:bg-bambinos-blue/90 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalaryStructure;
