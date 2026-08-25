// Onboarding module - admin page listing every submission.
//
// Route: /admin/onboarding (behind ProtectedRoute). The backend restricts this
// data to allow-listed admin accounts, so a 403 is a normal outcome here and is
// shown as a clear message rather than an error.

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, ChevronLeft, ChevronRight, ClipboardList, Loader2, Lock, Search,
} from 'lucide-react';
import { onboardingAdminService, ONBOARDING_FORBIDDEN } from './onboarding.admin.service';
import { OnboardingListItem, OnboardingPagination } from './onboarding.types';
import OnboardingDetailModal from './components/OnboardingDetailModal';

const PAGE_SIZE = 10;

const AdminOnboarding = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<OnboardingListItem[]>([]);
  const [pagination, setPagination] = useState<OnboardingPagination | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const response = await onboardingAdminService.listSubmissions({
      page, limit: PAGE_SIZE, search,
    });

    if (response.status && response.data) {
      setSubmissions(response.data.submissions);
      setPagination(response.data.pagination);
      setIsForbidden(false);
    } else if (response.message === ONBOARDING_FORBIDDEN) {
      setIsForbidden(true);
    } else {
      toast.error(response.message || 'Could not load onboarding submissions');
    }
    setIsLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  /** Search on submit rather than per keystroke, to avoid a request per letter. */
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  if (isForbidden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 flex items-center justify-center p-8">
        <div className="max-w-md text-center bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 mb-2">Restricted</h1>
          <p className="text-sm text-gray-600 mb-5">
            Onboarding submissions contain Aadhaar, PAN and bank details, and are limited to
            specific admin accounts. Your account does not have access.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
            className="text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30">
      <div className="container mx-auto p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
              className="h-9 w-9 p-0 shrink-0"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-bambinos-blue/10 text-bambinos-blue flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Onboarding Submissions</h1>
              <p className="text-xs text-gray-500">
                {pagination ? `${pagination.total} submission${pagination.total === 1 ? '' : 's'}` : 'Loading…'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Name, email, phone, city…"
                className="h-9 pl-9 text-xs w-full sm:w-64 bg-white border-2 border-gray-200 rounded-lg"
              />
            </div>
            <Button type="submit" className="h-9 text-xs bg-bambinos-blue hover:bg-bambinos-blue-dark">
              Search
            </Button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                      Loading…
                    </td>
                  </tr>
                )}

                {!isLoading && submissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">
                      {search ? `No submissions match "${search}"` : 'No onboarding submissions yet'}
                    </td>
                  </tr>
                )}

                {!isLoading && submissions.map(submission => (
                  <tr
                    key={submission.id}
                    onClick={() => setSelectedId(submission.id)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {submission.firstName} {submission.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="text-xs">{submission.email}</div>
                      <div className="text-xs text-gray-400">{submission.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{submission.courseProgram}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{submission.city}</td>
                    <td className="px-4 py-3 text-xs">
                      {submission.applicationId
                        ? <span className="text-bambinos-blue font-medium">{submission.applicationId}</span>
                        : <span className="text-gray-400">Not linked</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(submission.submittedAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-bambinos-blue">View</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 text-xs"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(current => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 text-xs"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(current => current + 1)}
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <OnboardingDetailModal
        submissionId={selectedId}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default AdminOnboarding;
