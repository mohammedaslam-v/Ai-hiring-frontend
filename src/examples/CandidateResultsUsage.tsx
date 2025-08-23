// Example usage of the candidate_results edge function
// Add this to your results page component

import { useState, useEffect } from 'react';

interface CandidateResult {
  status: string;
  score: number | null;
  evaluation: any;
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

export const useCandidateResults = (applicationId: string) => {
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
      return;

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        
        if (res.status === 404) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            notReady: true,
            error: null
          }));
          return;
        }
        
        throw new Error(body?.error || `Function failed: ${res.status}`);
      }

      const { result } = await res.json();
      setState({
        result,
        loading: false,
        error: null,
        notReady: false
      });

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

  return {
    ...state,
    refetch: fetchResults
  };
};

// Usage in component:
export const CandidateResultsPage = ({ applicationId }: { applicationId: string }) => {
  const { result, loading, error, notReady, refetch } = useCandidateResults(applicationId);

  if (loading) {
    return <div>Loading your results...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading results: {error}</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }

  if (notReady) {
    return (
      <div>
        <p>Your results are not ready yet. Please check back in a few minutes.</p>
        <button onClick={refetch}>Check Again</button>
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