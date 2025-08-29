
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import { SystemStatusProps } from '@/types/admin';

const SystemStatus = ({ applicants, onRefreshData, onForceRefresh, onTestApi, onBulkSync }: SystemStatusProps) => {
  const calculateAverageScore = () => {
    const applicantsWithScore = applicants.filter(a => a.score);
    if (applicantsWithScore.length === 0) return 'N/A';
    return Math.round(applicantsWithScore.reduce((sum, a) => sum + (a.score || 0), 0) / applicantsWithScore.length);
  };

  const calculatePassRate = () => {
    const completedInterviews = applicants.filter(a => a.interview_status === 'completed');
    if (completedInterviews.length === 0) return '0';
    const passed = completedInterviews.filter(a => (a.score || 0) >= 60);
    return Math.round((passed.length / completedInterviews.length) * 100);
  };

  return (
    <Card className="border-bambinos-blue/20 mb-6 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-bambinos-blue">System Integration Status</CardTitle>
        <CardDescription>Real-time data synchronization and API connectivity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <p><strong>Backend Connection:</strong> <span className="text-yellow-600">⚠️ Migrating to Node.js</span></p>
            <p><strong>Total Records:</strong> {applicants.length}</p>
            <p><strong>Interview Sessions:</strong> {applicants.filter(a => a.session_id).length}</p>
          </div>
          <div>
            <p><strong>ToughTongue API:</strong> <span className="text-green-600">✓ Connected</span></p>
            <p><strong>Completed Interviews:</strong> {applicants.filter(a => a.interview_status === 'completed').length}</p>
            <p><strong>Failed Interviews:</strong> {applicants.filter(a => a.interview_status === 'failed').length}</p>
          </div>
          <div>
            <p><strong>Active Interviews:</strong> {applicants.filter(a => a.interview_status === 'in_progress').length}</p>
            <p><strong>With Evaluation Data:</strong> {applicants.filter(a => a.evaluation).length}</p>
            <p><strong>With Scores:</strong> {applicants.filter(a => a.score).length}</p>
          </div>
          <div>
            <p><strong>Average Score:</strong> {calculateAverageScore()}%</p>
            <p><strong>Overall Pass Rate:</strong> {calculatePassRate()}%</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
<div className="mt-4 flex gap-2">
          <Button onClick={onRefreshData} className="bg-bambinos-blue hover:bg-bambinos-blue/90" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All Data & Test Connections
          </Button>
          {onForceRefresh && (
            <Button onClick={onForceRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Refresh ToughTongue (All)
            </Button>
          )}
          {onTestApi && (
            <Button onClick={onTestApi} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Test ToughTongue API
            </Button>
          )}
          {onBulkSync && (
            <Button onClick={onBulkSync} variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Bulk Sync All Missing Data
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
