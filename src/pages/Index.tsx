
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Users, Clock, Award, Globe, DollarSign, Star, TrendingUp, Shield, ChevronRight } from "lucide-react";
import { APP_CONFIG, APP_CONTENT, APP_STATS, APP_FEATURES, APP_HIRING_STEPS, APP_IMAGES, APP_THEME } from "@/utils/constants/app";
import { ROUTES } from "@/utils/constants/navigation";

const Index = () => {
  const navigate = useNavigate();
  
  const handleApplyAsTeacher = () => {
    navigate(ROUTES.CANDIDATE.LOGIN);
  };

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Users,
    Clock,
    Award,
    Star,
    Globe,
    DollarSign,
    TrendingUp,
    Shield,
  };

  // Feature gradients mapped to Bambinos Blue palette
  const featureGradients = [
    'from-bambinos-blue to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-violet-500 to-purple-500',
    'from-amber-500 to-orange-500',
  ];

  return (
    <div className="min-h-screen bg-neutral-warm">
      {/* Header - Clean, minimal, trustworthy */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-shadow duration-300">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft overflow-hidden">
                <img 
                  src={APP_IMAGES.LOGO.PATH} 
                  alt={APP_IMAGES.LOGO.ALT} 
                  className="w-12 h-12 object-contain" 
                />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-bambinos-blue">
                  {APP_CONFIG.NAME}
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 font-medium tracking-wide">
                  {APP_CONFIG.TAGLINE}
                </p>
              </div>
            </div>
            {/* Desktop CTA in Header */}
            <Button
              onClick={handleApplyAsTeacher}
              className="hidden md:flex btn-primary-bambinos px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              {APP_CONTENT.HERO.CTA_BUTTON}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Calm, inspiring, centered */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-warm to-bambinos-blue/[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-bambinos-blue/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-bambinos-yellow/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
              {APP_CONTENT.HERO.TITLE.split('Future').map((part, index) => 
                index === 0 ? (
                  <span key={index}>
                    {part}
                    <span className="text-bambinos-yellow relative inline-block">
                      Future
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-bambinos-yellow/40 rounded-full" />
                    </span>
                  </span>
                ) : (
                  <span key={index}>{part}</span>
                )
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              {APP_CONTENT.HERO.SUBTITLE}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Button
                onClick={handleApplyAsTeacher}
                className="btn-primary-bambinos px-10 py-4 text-lg font-semibold rounded-2xl min-w-[240px] group"
              >
                <span>{APP_CONTENT.HERO.CTA_BUTTON}</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Balanced, trustworthy metrics */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {APP_STATS.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Users;
              return (
                <div 
                  key={index} 
                  className={`text-center group animate-fade-in-up animation-delay-${(index + 1) * 100}`}
                >
                  <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 icon-container-soft rounded-2xl flex items-center justify-center mb-4">
                    <IconComponent className="h-7 w-7 lg:h-8 lg:w-8 text-bambinos-blue" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm lg:text-base text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Clean cards with subtle elevation */}
      <section className="py-20 lg:py-28 bg-neutral-cool relative">
        <div className="absolute inset-0 bg-dots-pattern opacity-50" />
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-bambinos-blue/8 px-5 py-2.5 rounded-full border border-bambinos-blue/15 mb-6 animate-scale-in">
              <Award className="h-4 w-4 text-bambinos-blue" />
              <span className="text-bambinos-blue font-semibold text-sm">
                {APP_CONTENT.FEATURES.SECTION_TITLE}
              </span>
            </div>
            <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up animation-delay-100">
              {APP_CONTENT.FEATURES.TITLE}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              {APP_CONTENT.FEATURES.SUBTITLE}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {APP_FEATURES.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || Star;
              const gradient = featureGradients[index % featureGradients.length];
              
              return (
                <Card 
                  key={index} 
                  className={`border border-gray-100 shadow-soft hover:shadow-soft-lg card-hover bg-white group animate-fade-in-up animation-delay-${(index + 1) * 100}`}
                >
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-bambinos-blue transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-8">
                    <CardDescription className="text-center text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps Section - Clear visual flow */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              {APP_CONTENT.PROCESS.TITLE}
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
              {APP_CONTENT.PROCESS.SUBTITLE}
            </p>
            <div className="inline-flex items-center gap-3 bg-bambinos-yellow/15 px-6 py-3 rounded-2xl border border-bambinos-yellow/30 animate-fade-in-up animation-delay-200">
              <Clock className="h-5 w-5 text-bambinos-blue" />
              <span className="text-bambinos-blue font-bold">
                {APP_CONTENT.PROCESS.TIMELINE}
              </span>
            </div>
          </div>

          {/* Steps Grid with Connectors */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
            {/* Connector Line (Desktop only) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-bambinos-blue/20 via-bambinos-blue/40 to-bambinos-blue/20" />
            
            {APP_HIRING_STEPS.map((step, index) => {
              const stepColors = [
                'bg-bambinos-blue',
                'bg-violet-500',
                'bg-pink-500',
                'bg-emerald-500',
              ];
              
              return (
                <div 
                  key={index} 
                  className={`text-center group relative animate-fade-in-up animation-delay-${(index + 1) * 100}`}
                >
                  {/* Step Number Circle */}
                  <div className={`mx-auto w-20 h-20 lg:w-24 lg:h-24 ${stepColors[index]} rounded-3xl flex items-center justify-center mb-6 text-white font-bold text-2xl lg:text-3xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 relative z-10`}>
                    {step.step}
                  </div>
                  
                  {/* Step Content */}
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-bambinos-blue transition-colors duration-300">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Professional, trustworthy dark section */}
      <section className="py-20 lg:py-28 bg-gray-900 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-bambinos-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-bambinos-blue/8 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              {APP_CONTENT.CTA.TITLE}
            </h3>
            <p className="text-lg lg:text-xl text-gray-300 mb-12 leading-relaxed animate-fade-in-up animation-delay-100">
              {APP_CONTENT.CTA.SUBTITLE}
            </p>
            <Button
              onClick={handleApplyAsTeacher}
              className="btn-primary-bambinos px-12 py-5 text-lg font-semibold rounded-2xl animate-fade-in-up animation-delay-200 group"
            >
              <span>{APP_CONTENT.HERO.CTA_BUTTON_SECONDARY}</span>
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Clean, minimal */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src={APP_IMAGES.LOGO.PATH} 
                alt={APP_IMAGES.LOGO.ALT} 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <span className="text-2xl font-bold text-bambinos-blue">
              {APP_CONFIG.NAME}
            </span>
          </div>
          <p className="text-gray-400 mb-6">
            {APP_CONTENT.FOOTER.DESCRIPTION}
          </p>
          <p className="text-gray-500 text-sm">
            {APP_CONFIG.COMPANY.COPYRIGHT}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
