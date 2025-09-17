import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Wrench } from "lucide-react";
import { APP_CONFIG, APP_IMAGES } from "@/utils/constants/app";

const MaintenancePage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <img 
                  src={APP_IMAGES.LOGO.PATH} 
                  alt={APP_IMAGES.LOGO.ALT} 
                  className="w-12 h-12" 
                />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
              {APP_CONFIG.NAME}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-8">
            {/* Maintenance Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg">
                <Wrench className="h-12 w-12 text-orange-600" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Website Under Maintenance
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We're working hard to improve your experience. Our website will be back online shortly.
              </p>
            </div>

            {/* Time Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-blue-800">Back Online At</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">12:30</div>
            </div>


            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Thank you for your patience. We appreciate your understanding.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenancePage;
