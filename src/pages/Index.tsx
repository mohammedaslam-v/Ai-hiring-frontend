
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Users, Clock, Award, Globe, DollarSign, Star, TrendingUp, Shield } from "lucide-react";
import { stats, features, hiringSteps } from "@/utils/const";

const Index = () => {
  const navigate = useNavigate();
  const handleApplyAsTeacher = () => {
    navigate('/candidate/login');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-xl">
                <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-14 h-14 rounded-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-bambinos-blue to-blue-600 bg-clip-text text-transparent">
                  Bambinos.live
                </h1>
                <p className="text-sm text-gray-500 font-medium">Empowering education, one distinguished teacher at a time</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-bambinos-blue/5"></div>
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Shape the <span className="bg-gradient-to-r from-bambinos-yellow to-yellow-500 bg-clip-text text-transparent">Future</span> of
              <br />
              <span className="bg-gradient-to-r from-bambinos-blue to-blue-600 bg-clip-text text-transparent">Online Education</span>
            </h2>

            <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Join Bambinos.live's exclusive community of world-class educators. Experience the
              future of teaching with cutting-edge technology and premium compensation packages
              designed for excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={handleApplyAsTeacher}
                className="bg-gradient-to-r from-bambinos-blue to-blue-600 hover:from-blue-600 hover:to-bambinos-blue text-white px-16 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform"
              >
                Apply as a Teacher →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm border-y border-gray-100/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-bambinos-blue/10 to-purple-600/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-bambinos-blue" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bambinos-blue/5 to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-bambinos-blue/10 px-6 py-3 rounded-full border border-bambinos-blue/20 mb-6">
              <Award className="h-5 w-5 text-bambinos-blue" />
              <span className="text-bambinos-blue font-semibold">Why Choose Us</span>
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-8">
              Elevate Your Teaching Journey with
              <br />
              <span className="bg-gradient-to-r from-bambinos-blue to-blue-600 bg-clip-text text-transparent">Bambinos.live</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled opportunities in a platform designed for educational excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-sm group overflow-hidden">
                <CardHeader className="text-center pb-6 relative">
                  <div className={`mx-auto w-18 h-18 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="h-9 w-9 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-bambinos-blue transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-gray-600 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Streamlined Excellence Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-bold text-gray-900 mb-8">
              Streamlined Excellence
            </h3>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              A refined application process designed for efficiency and excellence
            </p>
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-bambinos-yellow/20 to-yellow-500/20 px-8 py-4 rounded-2xl border border-bambinos-yellow/30">
              <Clock className="h-6 w-6 text-bambinos-blue" />
              <span className="text-bambinos-blue font-bold text-lg">Application to Selection in 24 Hours</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {hiringSteps.map((step, index) => (
              <div key={index} className="text-center group relative">
                {index < hiringSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-4"></div>
                )}
                <div className={`mx-auto w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center mb-8 text-white font-bold text-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                  {step.step}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-bambinos-blue transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-bambinos-blue/20 via-purple-600/20 to-bambinos-pink/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-bambinos-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Transform Education?
            </h3>
            <p className="text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
              Join thousands of distinguished educators who are already shaping the future through
              innovative online education.
            </p>
            <Button
              onClick={handleApplyAsTeacher}
              className="bg-gradient-to-r from-bambinos-blue to-blue-600 hover:from-blue-600 hover:to-bambinos-blue text-white px-16 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform"
            >
              Begin Your Journey →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-12 h-12 rounded-2xl" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-bambinos-blue to-blue-600 bg-clip-text text-transparent">
              Bambinos.live
            </span>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            Empowering education, one distinguished teacher at a time.
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            <button className="text-gray-400 hover:text-bambinos-blue transition-colors duration-300 font-medium">
              Super Admin
            </button>
          </div>
          <p className="text-gray-500">
            © 2024 Bambinos.live. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
