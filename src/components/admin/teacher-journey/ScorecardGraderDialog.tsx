import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Printer, RotateCcw, CheckCircle2, XCircle, Clock, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { teacherJourneyService } from "@/services/teacherJourney.service";

// ============================================
// SCORECARD CONFIG
// Frontend-only mock-assessment grader. Nothing is persisted —
// all state is local to this component and discarded on close.
// Text content mirrors the original Teacher_Scorecard_Grader.html.
// ============================================

const MONTSERRAT = "'Montserrat', sans-serif";
const PASS_THRESHOLD = 3.0;

const SUBJECTS = [
  { value: 'Science', label: 'Science' },
  { value: 'Maths', label: 'Mathematics' },
  { value: 'English', label: 'English' },
  { value: 'Gita', label: 'Gita' },
  { value: 'Phonics', label: 'Phonics' },
] as const;

const GRADE_SEGMENTS = [
  { value: '1-4', label: 'Gr1–4' },
  { value: '5-8', label: 'Gr5–8' },
  { value: '9-12', label: 'Gr9–12' },
] as const;

type Criterion = { key: string; title: string; desc: string };
type Section = { key: string; title: string; summaryLabel: string; criteria: Criterion[] };

const SECTIONS: Section[] = [
  {
    key: 'lang',
    title: '1. Language & Communication Skills',
    summaryLabel: 'Language Section Evaluation Average',
    criteria: [
      { key: 'lang_g1', title: 'Grammar & Sentence Construction', desc: 'Evaluates grammatical accuracy, sentence coherence, and proper sentence flow.' },
      { key: 'lang_g2', title: 'Pronunciation & Enunciation', desc: 'Clarity of speech and correct pronunciation of subject-specific terminology.' },
      { key: 'lang_g3', title: 'Mother Tongue Influence (MTI)', desc: 'Minimal mother tongue influence to ensure clear understanding and standard neutral delivery.' },
      { key: 'lang_g4', title: 'Tone & Pacing', desc: 'Warm, encouraging tone and a moderate, learner-friendly speed.' },
    ],
  },
  {
    key: 'delivery',
    title: '2. Session Delivery & Pedagogy',
    summaryLabel: 'Session Delivery Section Evaluation Average',
    criteria: [
      { key: 'del_g1', title: 'Conceptual Clarity & Accuracy', desc: 'Complete correctness in explanations, rules, facts, or texts. Teaches the underlying logic (the "why") rather than just rote rules (the "how").' },
      { key: 'del_g2', title: 'Teacher-Student Interaction', desc: 'Targets 40:60 ratio. Minimizes lecture monologue; maximizes active student answering, solving, reading, or explaining.' },
      { key: 'del_g3', title: 'Real-World Connections & Model Usage', desc: 'Uses the provided visual models and slides effectively to relate the topic to everyday life and real-world examples, making abstract concepts easy to understand.' },
      { key: 'del_g4', title: 'Guided Questioning', desc: 'Guides the student to figure out the answers by asking simple, helpful questions instead of just giving them the answer.' },
    ],
  },
  {
    key: 'parent',
    title: '3. Parent Interaction & Pitch',
    summaryLabel: 'Parent Interaction Section Evaluation Average',
    criteria: [
      { key: 'par_g1', title: 'Understanding Parent Expectations', desc: 'Identifies and acknowledges specific parent expectations and student concerns.' },
      { key: 'par_g2', title: 'Program Value Pitch', desc: "Clearly highlights the benefits of the course curriculum (conceptual depth, student engagement) and connects them back to the parent's goals." },
      { key: 'par_g3', title: 'Listening & Empathy', desc: 'Practices active listening, maintains positive body language, and validates parent concerns.' },
      { key: 'par_g4', title: 'Objection & Feedback Handling', desc: 'Confidently and politely answers concerns about pricing, schedules, homework, or course relevance.' },
    ],
  },
];

const SCORE_VALUES = [0, 1, 2, 3, 4, 5];

// Shared grid template so column headers line up with each criterion row.
const ROW_GRID = 'grid grid-cols-1 sm:grid-cols-[1.1fr_1.9fr_minmax(170px,auto)] gap-x-4 gap-y-1';

interface ScorecardGraderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCandidateName?: string;
  applicationId?: string;
  onSaved?: () => void;
}

const ScorecardGraderDialog: React.FC<ScorecardGraderDialogProps> = ({
  open,
  onOpenChange,
  defaultCandidateName = '',
  applicationId,
  onSaved,
}) => {
  // Metadata
  const [candidateName, setCandidateName] = useState(defaultCandidateName);
  const [evaluatorName, setEvaluatorName] = useState('');
  const [assessDate, setAssessDate] = useState('');
  const [subject, setSubject] = useState<string>('Science');
  const [grade, setGrade] = useState<string>('1-4');
  const [demoTopic, setDemoTopic] = useState('');

  // Scores keyed by criterion key -> 0..5
  const [scores, setScores] = useState<Record<string, number>>({});

  // Comments
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  // Save state
  const [saving, setSaving] = useState(false);
  // Loading + the id of the existing scorecard (so we update instead of duplicating)
  const [loading, setLoading] = useState(false);
  const [loadedId, setLoadedId] = useState<number | null>(null);
  // Becomes true after a save attempt with missing fields — drives the red highlighting
  const [showErrors, setShowErrors] = useState(false);

  // Prefill candidate name when reopened
  React.useEffect(() => {
    if (open) setCandidateName(prev => prev || defaultCandidateName);
  }, [open, defaultCandidateName]);

  // When opened, load the latest saved scorecard for this candidate (if any) and prefill the form
  React.useEffect(() => {
    if (!open || !applicationId) return;
    let cancelled = false;
    setLoading(true);
    setShowErrors(false);
    teacherJourneyService.getMockAssessments(applicationId)
      .then(res => {
        if (cancelled) return;
        const latest = res.status && res.data && res.data.length > 0 ? res.data[0] : null;
        if (latest) {
          setLoadedId(latest.id);
          setEvaluatorName(latest.evaluatorName || '');
          setAssessDate(latest.assessmentDate ? latest.assessmentDate.split('T')[0] : '');
          setSubject(latest.subject || 'Science');
          setGrade(latest.gradeSegment || '1-4');
          setDemoTopic(latest.demoTopic || '');
          setScores(latest.scores || {});
          setRecommendation(
            latest.overallResult === 'SELECTED' ? 'YES'
              : latest.overallResult === 'REJECTED' ? 'NO'
                : null
          );
          setStrengths(latest.strengths || '');
          setImprovements(latest.improvements || '');
          setNextSteps(latest.nextSteps || '');
          setCandidateName(latest.firstName ? `${latest.firstName} ${latest.lastName || ''}`.trim() : defaultCandidateName);
        } else {
          setLoadedId(null);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, applicationId, defaultCandidateName]);

  const setScore = (key: string, value: number) =>
    setScores(prev => ({ ...prev, [key]: value }));

  // Per-section average (null until at least one criterion scored)
  const sectionAverages = useMemo(() => {
    const result: Record<string, number | null> = {};
    for (const section of SECTIONS) {
      let total = 0;
      let count = 0;
      for (const c of section.criteria) {
        if (scores[c.key] !== undefined) {
          total += scores[c.key];
          count += 1;
        }
      }
      result[section.key] = count === 0 ? null : total / count;
    }
    return result;
  }, [scores]);

  // Final recommendation — chosen MANUALLY by the evaluator (not auto-derived from scores)
  const [recommendation, setRecommendation] = useState<'YES' | 'NO' | null>(null);

  // ----- required-field validation -----
  const allScoreKeys = useMemo(() => SECTIONS.flatMap(s => s.criteria.map(c => c.key)), []);
  const missingScoreKeys = allScoreKeys.filter(k => scores[k] === undefined);
  const errors = {
    candidateName: !candidateName.trim(),
    evaluatorName: !evaluatorName.trim(),
    assessDate: !assessDate,
    demoTopic: !demoTopic.trim(),
    strengths: !strengths.trim(),
    improvements: !improvements.trim(),
    nextSteps: !nextSteps.trim(),
    recommendation: recommendation === null,
    scores: missingScoreKeys.length > 0,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleReset = () => {
    setScores({});
    setEvaluatorName('');
    setDemoTopic('');
    setStrengths('');
    setImprovements('');
    setNextSteps('');
    setAssessDate('');
    setSubject('Science');
    setGrade('1-4');
    setCandidateName(defaultCandidateName);
    setRecommendation(null);
    setShowErrors(false);
  };

  const handleSave = async () => {
    if (!applicationId) {
      toast.error('Missing application ID — cannot save scorecard.');
      return;
    }
    if (hasErrors) {
      setShowErrors(true);
      toast.error('Please fill all required fields before saving.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        applicationId,
        evaluatorName: evaluatorName || undefined,
        assessmentDate: assessDate || undefined,
        subject,
        gradeSegment: grade,
        demoTopic: demoTopic || undefined,
        scores,
        overallResult: recommendation === 'YES' ? 'SELECTED' : recommendation === 'NO' ? 'REJECTED' : undefined,
        strengths: strengths || undefined,
        improvements: improvements || undefined,
        nextSteps: nextSteps || undefined,
      } as const;

      // Update the existing scorecard if one was loaded, otherwise create a new one
      const result = loadedId
        ? await teacherJourneyService.updateMockAssessment(loadedId, payload)
        : await teacherJourneyService.saveMockAssessment(payload);

      if (result.status) {
        toast.success(loadedId ? 'Scorecard updated' : 'Scorecard saved successfully');
        onSaved?.();
        onOpenChange(false);
      } else {
        toast.error(result.message || 'Failed to save scorecard');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 bg-[#f1f5f9]"
        style={{ fontFamily: MONTSERRAT }}
      >
        {/* a11y title (visually replaced by the styled header below) */}
        <DialogHeader className="sr-only">
          <DialogTitle>Bambinos Teacher Assessment Grader</DialogTitle>
          <DialogDescription>Multi-subject mock assessment scorecard</DialogDescription>
        </DialogHeader>

        <div className="m-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <span className="text-lg font-extrabold uppercase tracking-[0.08em] text-[#2563eb]">
              Bambinos
            </span>
            <div className="text-right">
              <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
                Teacher Mock Assessment
              </h2>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Grader: Multi-Subject Scorecard
              </p>
            </div>
          </div>

          {/* Utility actions */}
          <div className="mt-5 flex items-center justify-end gap-3">
            {loading && (
              <span className="mr-auto flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading saved scorecard…
              </span>
            )}
            <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg text-[11px] font-bold uppercase tracking-wide" onClick={handleReset} disabled={saving || loading}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Clear Form
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg text-[11px] font-bold uppercase tracking-wide" onClick={() => window.print()} disabled={saving || loading}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Save PDF
            </Button>
          </div>

          {/* Metadata grid */}
          <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-[#2563eb]/15 bg-[#2563eb]/[0.06] p-4 sm:grid-cols-3">
            <MetaField label="Candidate Name" required>
              <Input value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="Enter name"
                className={cn('h-9 bg-white text-xs font-semibold', showErrors && errors.candidateName && 'border-red-500 focus-visible:ring-red-500')} />
            </MetaField>
            <MetaField label="Evaluator Name" required>
              <Input value={evaluatorName} onChange={e => setEvaluatorName(e.target.value)} placeholder="Enter name"
                className={cn('h-9 bg-white text-xs font-semibold', showErrors && errors.evaluatorName && 'border-red-500 focus-visible:ring-red-500')} />
            </MetaField>
            <MetaField label="Assessment Date" required>
              <Input type="date" value={assessDate} onChange={e => setAssessDate(e.target.value)}
                className={cn('h-9 bg-white text-xs font-semibold', showErrors && errors.assessDate && 'border-red-500 focus-visible:ring-red-500')} />
            </MetaField>

            <MetaField label="Subject / Course" className="sm:col-span-2" required>
              <PillGroup options={SUBJECTS} value={subject} onChange={setSubject} />
            </MetaField>
            <MetaField label="Grade Segment" required>
              <PillGroup options={GRADE_SEGMENTS} value={grade} onChange={setGrade} />
            </MetaField>

            <MetaField label="Demo Topic Covered" className="sm:col-span-3" required>
              <Input value={demoTopic} onChange={e => setDemoTopic(e.target.value)} placeholder="e.g. Fractions, Gravity, Subject-Verb Agreement"
                className={cn('h-9 bg-white text-xs font-semibold', showErrors && errors.demoTopic && 'border-red-500 focus-visible:ring-red-500')} />
            </MetaField>
          </div>

          {/* Rubric sections */}
          <div className="mt-6 space-y-6">
            {SECTIONS.map(section => {
              const avg = sectionAverages[section.key];
              return (
                <div key={section.key} className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  {/* Section header */}
                  <div className="flex items-center justify-between bg-slate-900 px-4 py-2.5 text-white">
                    <h3 className="text-xs font-bold uppercase tracking-wide">{section.title}</h3>
                    <span className="rounded bg-white/15 px-2 py-0.5 text-[9px] font-bold">Scored 0–5</span>
                  </div>

                  {/* Column headers */}
                  <div className={cn(ROW_GRID, 'hidden border-b border-slate-200 bg-slate-50 px-4 py-2 sm:grid')}>
                    <span className="text-[9px] font-bold uppercase tracking-wide text-slate-600">Assessment Rubric</span>
                    <span className="text-[9px] font-bold uppercase tracking-wide text-slate-600">Detailed Criteria Description</span>
                    <span className="text-center text-[9px] font-bold uppercase tracking-wide text-slate-600">Score (0 - 5)<span className="ml-0.5 text-red-500">*</span></span>
                  </div>

                  {/* Criteria rows */}
                  <div className="divide-y divide-slate-100">
                    {section.criteria.map(c => {
                      const rowMissing = showErrors && scores[c.key] === undefined;
                      return (
                      <div key={c.key} className={cn(ROW_GRID, 'items-center px-4 py-3', rowMissing && 'bg-red-50')}>
                        <div className="text-xs font-semibold text-slate-900">{c.title}</div>
                        <div className="text-[11px] leading-relaxed text-slate-500">{c.desc}</div>
                        <div className="flex justify-start gap-1.5 sm:justify-center">
                          {(c.key === 'lang_g3' ? [...SCORE_VALUES].reverse() : SCORE_VALUES).map(v => {
                            const selected = scores[c.key] === v;
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setScore(c.key, v)}
                                className={cn(
                                  'h-[22px] w-[22px] rounded border text-[10px] font-bold transition-colors',
                                  selected
                                    ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-[0_2px_4px_rgba(37,99,235,0.3)]'
                                    : rowMissing
                                      ? 'border-red-400 bg-white text-red-500 hover:border-[#2563eb] hover:bg-[#2563eb]/5 hover:text-[#2563eb]'
                                      : 'border-slate-300 bg-white text-slate-500 hover:border-[#2563eb] hover:bg-[#2563eb]/5 hover:text-[#2563eb]'
                                )}
                              >
                                {v}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      );
                    })}

                    {/* Section summary */}
                    <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                      <span className="text-[11px] font-bold text-slate-900">{section.summaryLabel}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-extrabold text-slate-900">{avg === null ? '0.00' : avg.toFixed(2)}</span>
                        <SectionBadge avg={avg} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final recommendation */}
          <div
            className={cn(
              'mt-6 flex items-center justify-between rounded-xl border-2 px-5 py-4 transition-colors',
              recommendation === 'YES' && 'border-emerald-600 bg-emerald-50',
              recommendation === 'NO' && 'border-red-600 bg-red-50',
              recommendation === null && (showErrors && errors.recommendation ? 'border-red-500 bg-red-50' : 'border-slate-900 bg-slate-50')
            )}
          >
            <span className="text-[13px] font-extrabold uppercase tracking-wide text-slate-900">
              Selected for Demo / Paid Sessions:<span className="ml-0.5 text-red-500">*</span>
            </span>
            <div className="flex items-center gap-5">
              <RecommendationChoice label="YES" active={recommendation === 'YES'} tone="yes" onClick={() => setRecommendation('YES')} />
              <RecommendationChoice label="NO" active={recommendation === 'NO'} tone="no" onClick={() => setRecommendation('NO')} />
            </div>
          </div>

          {/* Qualitative comments */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CommentField label="Candidate Key Strengths" value={strengths} onChange={setStrengths} placeholder="Write key strengths..." required error={showErrors && errors.strengths} />
            <CommentField label="Areas of Improvement / Action Items" value={improvements} onChange={setImprovements} placeholder="Write areas to improve..." required error={showErrors && errors.improvements} />
            <CommentField label="Actionable Next Steps" value={nextSteps} onChange={setNextSteps} placeholder="Write next steps..." className="sm:col-span-2" required error={showErrors && errors.nextSteps} />
          </div>

          {/* Footer */}
          <p className="mt-6 border-t border-slate-200 pt-3 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            Bambinos Learning Solutions © 2026 | Private and Confidential
          </p>
        </div>

        {/* Sticky action footer (always visible while scrolling) */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-3">
          <Button type="button" variant="outline" size="sm" className="h-9 rounded-lg text-[11px] font-bold uppercase tracking-wide" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" size="sm" className="h-9 rounded-lg bg-[#2563eb] text-[11px] font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#1d4ed8]" onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
            {saving ? 'Saving...' : loadedId ? 'Update Scorecard' : 'Save Scorecard'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---- small presentational helpers ----

const MetaField: React.FC<{ label: string; className?: string; required?: boolean; children: React.ReactNode }> = ({ label, className, required, children }) => (
  <div className={cn('flex flex-col gap-1', className)}>
    <Label className="text-[9px] font-extrabold uppercase tracking-wide text-[#2563eb]">
      {label}{required && <span className="ml-0.5 text-red-500">*</span>}
    </Label>
    {children}
  </div>
);

const PillGroup: React.FC<{
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(o => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={cn(
          'rounded-md border px-3.5 py-2 text-[11px] font-semibold transition-colors',
          value === o.value
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-300 bg-white text-slate-500 hover:border-[#2563eb] hover:text-[#2563eb]'
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const CommentField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  required?: boolean;
  error?: boolean;
}> = ({ label, value, onChange, placeholder, className, required, error }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label className="text-[9px] font-extrabold uppercase tracking-wide text-[#2563eb]">
      {label}{required && <span className="ml-0.5 text-red-500">*</span>}
    </Label>
    <Textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={3}
      placeholder={placeholder}
      className={cn('border-dashed text-[11px] font-medium focus:border-solid', error && 'border-red-500 border-solid focus-visible:ring-red-500')}
    />
  </div>
);

// Section pass/fail/pending badge
const SectionBadge: React.FC<{ avg: number | null }> = ({ avg }) => {
  if (avg === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-slate-500">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  }
  if (avg >= PASS_THRESHOLD) {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Selected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-red-700">
      <XCircle className="h-3 w-3" /> Rejected
    </span>
  );
};

// Read-only YES / NO indicator (auto-derived from scores)
const RecommendationChoice: React.FC<{ label: string; active: boolean; tone: 'yes' | 'no'; onClick: () => void }> = ({ label, active, tone, onClick }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-2 text-xs font-bold text-slate-900">
    <span
      className={cn(
        'flex h-4 w-4 items-center justify-center rounded-[3px] border-2 transition-colors',
        !active && 'border-slate-900 bg-white',
        active && tone === 'yes' && 'border-emerald-600 bg-emerald-600',
        active && tone === 'no' && 'border-red-600 bg-red-600'
      )}
    >
      {active && (
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    {label}
  </button>
);

export default ScorecardGraderDialog;
