// Example usage of the candidate_results edge function
// Add this to your results page component

import { useState, useEffect } from 'react';

interface CandidateResult {
  status: string;
  score: number | null;
  evaluation: Record<string, unknown>;
  feedback: string | null;
  strengths: string[] | null;
  areas_for_improvement: string[] | null;
  created_at: string;
  completed_at: string | null;
}

interface ResultsState {
  result: CandidateResult | null;
  loading: boolean;
  error: string | null;
  notReady: boolean;
}

// Usage in component:
export const CandidateResultsPage = ({ applicationId }: { applicationId: string }) => {
  const [state, setState] = useState<ResultsState>({
    result: null,
    loading: true,
    error: null,
    notReady: false
  });

  const fetchResults = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // TODO: Replace with Node.js API call when backend is ready
      console.log('Candidate results fetch temporarily disabled - migrating to Node.js');
      
      // Simulate loading state for now
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        notReady: true,
        error: null
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchResults();
    }
  }, [applicationId]);

  const { result, loading, error, notReady } = state;

  if (loading) {
    return <div>Loading your results...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading results: {error}</p>
        <button onClick={fetchResults}>Try Again</button>
      </div>
    );
  }

  if (notReady) {
    return (
      <div>
        <p>Your results are not ready yet. Please check back in a few minutes.</p>
        <button onClick={fetchResults}>Check Again</button>
      </div>
    );
  }

  if (!result) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      <h2>Interview Results</h2>
      <p>Status: {result.status}</p>
      {result.score && <p>Score: {result.score}/100</p>}
      {result.feedback && <p>Feedback: {result.feedback}</p>}
      {/* Render other result fields as needed */}
    </div>
  );
};