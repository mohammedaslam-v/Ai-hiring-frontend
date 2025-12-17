
import { Star } from "lucide-react";

const CandidateHeader = () => {
  return (
    <div className="text-center py-4">
      <div className="flex items-center justify-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <img src="/lovable-uploads/1bd88e64-73eb-4b2c-8096-218b1fce8646.png" alt="Bambinos.live" className="w-9 h-9 rounded-full" />
            </div>
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <Star className="h-2.5 w-2.5 text-yellow-800" />
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bambinos.live
          </h1>
          <p className="text-slate-500 text-xs font-medium">Premium Teaching Platform</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateHeader;
