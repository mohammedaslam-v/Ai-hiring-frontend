// Onboarding module - admin detail view.
//
// Shows one candidate's full submission. Document links are signed by the
// backend and expire after a few minutes, so they are fetched fresh each time
// this dialog opens rather than being cached.

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BookOpen, Download, FileText, Landmark, Laptop, Loader2, User, Users,
} from 'lucide-react';
import { onboardingAdminService } from '../onboarding.admin.service';
import { OnboardingSubmissionDetail } from '../onboarding.types';

interface OnboardingDetailModalProps {
  submissionId: number | null;
  open: boolean;
  onClose: () => void;
}

/** One label/value pair. */
const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm text-gray-900 break-words">{value || '—'}</p>
  </div>
);

/** A titled block of fields. */
const Block = ({
  icon: Icon, title, accent, children,
}: {
  icon: typeof User; title: string; accent: string; children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-200 p-4">
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const OnboardingDetailModal = ({ submissionId, open, onClose }: OnboardingDetailModalProps) => {
  const [submission, setSubmission] = useState<OnboardingSubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !submissionId) return;

    let cancelled = false;
    setIsLoading(true);
    setSubmission(null);

    onboardingAdminService.getSubmission(submissionId).then(response => {
      if (cancelled) return;
      if (response.status && response.data) {
        setSubmission(response.data);
      } else {
        toast.error(response.message || 'Could not load the submission');
        onClose();
      }
      setIsLoading(false);
    });

    // The dialog can be closed mid-request; ignore a late response.
    return () => { cancelled = true; };
    // onClose is stable enough here; re-running on it would refetch needlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submissionId]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-bambinos-blue">
            {submission
              ? `${submission.firstName} ${submission.lastName}`
              : 'Onboarding Submission'}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading submission…
          </div>
        )}

        {submission && (
          <div className="space-y-4">
            <Block icon={User} title="Personal Details" accent="bg-blue-100 text-blue-600">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Name (as per bank/PAN)" value={`${submission.firstName} ${submission.lastName}`} />
                <Field label="Email" value={submission.email} />
                <Field label="Contact (WhatsApp)" value={submission.phoneNumber} />
                <Field label="Date of Birth" value={submission.dateOfBirth?.slice(0, 10)} />
                <Field label="Blood Group" value={submission.bloodGroup} />
                <Field label="City" value={submission.city} />
                <Field label="PAN Number" value={submission.panNumber} />
                <Field label="LinkedIn" value={submission.linkedinProfile} />
                <Field label="Linked Application" value={submission.applicationId} />
              </div>
            </Block>

            <Block icon={BookOpen} title="Course & Availability" accent="bg-emerald-100 text-emerald-600">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Course/Program" value={submission.courseProgram} />
                <Field label="Available Slot" value={submission.availableSlots?.join(', ')} />
                <Field label="Weekly Break" value={submission.weeklyBreak} />
                <Field label="Cross-training" value={submission.crossTrainingWilling} />
                <Field label="Applied Via" value={submission.applicationSource} />
                <Field
                  label="Languages"
                  value={[submission.language1, submission.language2, submission.language3]
                    .filter(Boolean).join(', ')}
                />
              </div>
              <div className="mt-4">
                <Field label="Bio" value={submission.bio} />
              </div>
            </Block>

            <Block icon={Users} title="Alternate Contact" accent="bg-rose-100 text-rose-600">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Name" value={submission.altContactName} />
                <Field label="Relationship" value={submission.altContactRelation} />
                <Field label="Number" value={submission.altContactNumber} />
              </div>
            </Block>

            <Block icon={Laptop} title="Teaching Setup" accent="bg-amber-100 text-amber-600">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="8GB RAM" value={submission.hasEightGbRam} />
                <Field label="Camera" value={submission.cameraQualityOk} />
                <Field label="Internet (100 Mbps)" value={submission.hasHighSpeedInternet} />
                <Field label="Lighting" value={submission.lightingAdequate} />
                <Field label="Attire" value={submission.attireWilling} />
              </div>
            </Block>

            <Block icon={Landmark} title="Bank & KYC" accent="bg-sky-100 text-sky-600">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="Aadhaar Number" value={submission.aadhaarNumber} />
                <Field label="PAN Number" value={submission.panNumber} />
                <Field label="Account Number" value={submission.bankAccountNumber} />
                <Field label="Bank" value={submission.bankName} />
                <Field label="Branch" value={submission.bankBranch} />
                <Field label="IFSC" value={submission.ifscCode} />
              </div>
            </Block>

            <Block icon={FileText} title="Documents" accent="bg-violet-100 text-violet-600">
              <p className="text-[11px] text-gray-500 mb-3">
                Links expire a few minutes after this page was opened. Reopen the submission to refresh them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {submission.documents.map(doc => (
                  doc.url ? (
                    <a
                      key={doc.key}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-bambinos-blue/30 bg-bambinos-blue/[0.04] text-xs font-medium text-bambinos-blue hover:bg-bambinos-blue/10 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5 shrink-0" />
                      {doc.label}
                    </a>
                  ) : (
                    <div
                      key={doc.key}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      {doc.label} — not attached
                    </div>
                  )
                ))}
              </div>
            </Block>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDetailModal;
