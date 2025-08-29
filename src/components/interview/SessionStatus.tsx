import React from 'react';
import { Clock, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { InterviewSessionState } from '@/types/session';

interface SessionStatusProps {
  sessionState: InterviewSessionState;
  onStartInterview?: () => void;
  onCompleteInterview?: (score?: number, evaluation?: Record<string, unknown>) => void;
  onSkipInterview?: () => void;
}

// Session status component with visual indicators
export const SessionStatus: React.FC<SessionStatusProps> = ({
  sessionState,
  onStartInterview,
  onCompleteInterview,
  onSkipInterview
}) => {
  const { sessionId, status, isLoading, error } = sessionState;

  // Get status configuration
  const getStatusConfig = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Ready to Start',
          description: 'Interview session is ready to begin'
        };
      
      case 'started':
        return {
          icon: Play,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'In Progress',
          description: 'Interview is currently running'
        };
      
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Completed',
          description: 'Interview has been completed successfully'
        };
      
      case 'skipped':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Skipped',
          description: 'Interview was skipped or abandoned'
        };
      
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Unknown',
          description: 'Session status is unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const IconComponent = statusConfig.icon;

  if (!sessionId) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-600">No Active Session</p>
            <p className="text-xs text-gray-500">Interview session not yet created</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-lg`}>
      {/* Error Display */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
            <IconComponent className={`h-5 w-5 ${statusConfig.color}`} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </h3>
            <p className="text-xs text-gray-600">{statusConfig.description}</p>
          </div>
        </div>
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-xs text-gray-500">Processing...</span>
          </div>
        )}
      </div>

      {/* Session ID */}
      <div className="mb-3 p-2 bg-white/50 rounded border border-gray-200">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Session ID:</span> {sessionId}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {status === 'pending' && onStartInterview && (
          <button
            onClick={onStartInterview}
            disabled={isLoading}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center space-x-1"
          >
            <Play className="h-3 w-3" />
            <span>Start Interview</span>
          </button>
        )}

        {status === 'started' && (
          <div className="flex gap-2">
            {onCompleteInterview && (
              <button
                onClick={() => onCompleteInterview(85)} // Default score of 85
                disabled={isLoading}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center space-x-1"
              >
                <CheckCircle className="h-3 w-3" />
                <span>Complete</span>
              </button>
            )}
            
            {onSkipInterview && (
              <button
                onClick={onSkipInterview}
                disabled={isLoading}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center space-x-1"
              >
                <XCircle className="h-3 w-3" />
                <span>Skip</span>
              </button>
            )}
          </div>
        )}

        {status === 'completed' && (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Interview completed successfully!
            </span>
          </div>
        )}

        {status === 'skipped' && (
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-700 font-medium">
              Interview was skipped
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionStatus;
