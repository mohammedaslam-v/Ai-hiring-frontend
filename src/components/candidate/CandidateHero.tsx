
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, User, Award } from "lucide-react";

const CandidateHero = () => {
  const navigate = useNavigate();

  const positions = [
    { 
      id: "educator", 
      label: "Role - Educator", 
      description: "",
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="text-center mb-12 md:mb-16 px-4">
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
        Shape the Future of
        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Digital Education
        </span>
      </h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
        Join our exclusive network of premium educators and unlock unparalleled opportunities 
        for professional growth with industry-leading compensation packages
      </p>
      
      {/* Premium Positions Cards */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-12 md:mb-16 border border-white/20 mx-2 sm:mx-4">
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Opportunities</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 md:mb-10 text-base md:text-lg">Choose your path to educational excellence</p>
        
        <div className="flex justify-center items-center">
          <div className="w-full max-w-xs">
            {positions.map((position) => (
              <div key={position.id} className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 ${position.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white">{position.label}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile-First Payment Structure Button with Double Line for Mobile */}
        <div className="mt-6 md:mt-8 text-center px-2">
          <Button 
            variant="outline"
            className="bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 px-4 sm:px-6 md:px-8 py-4 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-semibold w-full sm:w-auto min-h-[60px] sm:min-h-[56px] md:min-h-[64px] touch-manipulation"
            onClick={() => navigate('/candidate/simplified-salary-structure')}
          >
            <Award className="mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="flex flex-col sm:inline text-center sm:text-left leading-tight">
              <span className="block sm:inline">View Complete</span>
              <span className="block sm:inline sm:ml-1">Payment Structure</span>
            </span>
          </Button>
        </div>
        
        {/* Note for exceptional educators */}
        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl md:rounded-2xl">
          <div className="flex items-center justify-center mb-2 md:mb-3">
            <Award className="h-5 w-5 md:h-6 md:w-6 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
            <span className="text-base md:text-lg font-semibold text-amber-800 dark:text-amber-200">Special Opportunity</span>
          </div>
          <p className="text-amber-700 dark:text-amber-300 text-center text-sm md:text-base leading-relaxed">
            For exceptional educators (8 years plus experience), salary and role is negotiable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateHero;
