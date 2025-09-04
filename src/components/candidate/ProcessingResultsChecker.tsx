import { useEffect, useState } from 'react';
import { interviewResultsService } from '@/services/interviewResults';

interface ProcessingResultsCheckerProps {
  applicationId: string;
  onResultsReady: () => void;
}

const ProcessingResultsChecker = ({ applicationId, onResultsReady }: ProcessingResultsCheckerProps) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    console.log('ProcessingResultsChecker: applicationId =', applicationId);
    
    if (!applicationId) {
      console.log('ProcessingResultsChecker: No applicationId provided, stopping');
      return;
    }

    const checkResults = async (currentApplicationId: string) => {
      if (retryCount >= 30) {
        // Stop checking after 30 attempts (about 3 minutes)
        console.log('ProcessingResultsChecker: Stopped checking for results after 30 attempts');
        return;
      }

      try {
        setIsChecking(true);
        console.log(`ProcessingResultsChecker: Checking for results (attempt ${retryCount + 1}/30) for applicationId: ${currentApplicationId}`);
        
        const response = await interviewResultsService.getInterviewResults(currentApplicationId);
        console.log('ProcessingResultsChecker: Response received:', response);
        
        // Only navigate if we get actual results with a real evaluation score
        if (response.status === true && response.data && response.data.score !== undefined) {
          const score = response.data.score;
          console.log('ProcessingResultsChecker: Score found:', score);
          
          // Wait for evaluation score (0 means failed evaluation from Tough Tongue, >0 means passed)
          // Score 0 means failed evaluation (Tough Tongue returned null), any other score means evaluation completed
          if (score !== null && score !== undefined) {
            console.log(`ProcessingResultsChecker: Evaluation score found: ${score} (0 means failed evaluation), navigating to results...`);
            onResultsReady();
            return;
          } else {
            console.log('ProcessingResultsChecker: Score is undefined or invalid, continuing to check...');
          }
        } else {
          // Check specific error types that we should retry for
          if (response.error === 'EVALUATION_IN_PROGRESS' || response.error === 'INTERVIEW_NOT_COMPLETED') {
            console.log('ProcessingResultsChecker: Evaluation still in progress, will retry...');
            // Continue checking
          } else if (response.error === 'APPLICATION_NOT_FOUND') {
            console.log('ProcessingResultsChecker: Application not found, will retry...');
            // Continue checking - maybe it's still being processed
          } else {
            console.log('ProcessingResultsChecker: Other error or no data yet, will retry... Error:', response.error);
            // Continue checking for other errors too
          }
        }
      } catch (error) {
        console.error('ProcessingResultsChecker: Error checking results:', error);
        // Continue checking even on error
      } finally {
        setIsChecking(false);
      }

      // Schedule next check
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 6000); // Check every 6 seconds
    };

    // Start checking immediately since video upload is already complete
    const initialDelay = setTimeout(() => {
      checkResults(applicationId);
    }, 2000); // Start checking after 2 seconds

    return () => {
      clearTimeout(initialDelay);
    };
  }, [applicationId, retryCount, onResultsReady]);

  // This component doesn't render anything visible
  return null;
};

export default ProcessingResultsChecker;
