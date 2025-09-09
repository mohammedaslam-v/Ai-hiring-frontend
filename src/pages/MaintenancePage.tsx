import React from 'react';
import { Wrench, RefreshCw } from 'lucide-react';

const MaintenancePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Wrench className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We'll Be Right Back
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're currently performing scheduled maintenance to improve your experience. 
            Our team is working hard to get everything back online as quickly as possible.
          </p>

          {/* Status Updates */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-3">
              <RefreshCw className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
              <span className="text-sm font-medium text-blue-800">
                System Status
              </span>
            </div>
            <p className="text-blue-700 text-sm">
              • Database optimization in progress<br />
              • Security updates being applied<br />
              • Performance improvements being implemented
            </p>
          </div>


          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Thank you for your patience. We appreciate your understanding.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              © 2024 Bambinos.live - All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
