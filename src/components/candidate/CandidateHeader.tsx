
import { Star } from "lucide-react";

const CandidateHeader = () => {
  return (
    <div className="text-center mb-8 md:mb-12 pt-4 md:pt-8 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
        <div className="relative">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Star className="h-2.5 w-2.5 md:h-3 md:w-3 text-yellow-800" />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bambinos.live
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-xs md:text-sm font-medium">Premium Teaching Platform</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateHeader;
