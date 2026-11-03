import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AdminService from '@/services/admin.service';
import { ApplicantRow, CandidateContactUpdate } from '@/types/admin/applications';

interface EditCandidateModalProps {
  /** Row being edited. Mount the dialog only while editing - the form is seeded from this on mount. */
  application: ApplicantRow;
  onClose: () => void;
  /** Called after a successful save so the table can reload */
  onSaved: () => void;
}

type FormValues = { firstName: string; lastName: string; email: string; phone: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

// Same rules as adminCandidateContactUpdateValidation in the backend (bodyValidation.ts)
const NAME_PATTERN = /^[\p{L}\p{M} .'’-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?\d{10,15}$/;
const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 100;
const NAME_CHARS_MESSAGE = 'Use letters, spaces, dots, apostrophes or hyphens only';

/** "+91 98765-43210" -> "+919876543210", the same form the backend stores */
const normalizePhone = (value: string) => value.replace(/[\s\-().]/g, '');

const adminService = new AdminService();

/**
 * The fields the admin actually changed. Only these are validated and sent, so
 * an unusual value already stored in an untouched field never blocks a save.
 */
function getChanges(values: FormValues, original: FormValues): CandidateContactUpdate {
  const changes: CandidateContactUpdate = {};
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim().toLowerCase();
  const phone = values.phone.trim();

  if (firstName !== original.firstName.trim()) changes.firstName = firstName;
  if (lastName !== original.lastName.trim()) changes.lastName = lastName;
  if (email !== original.email.trim().toLowerCase()) changes.email = email;
  if (phone !== original.phone.trim()) changes.phoneNumber = normalizePhone(phone);
  return changes;
}

function validate(changes: CandidateContactUpdate): FormErrors {
  const errors: FormErrors = {};

  if (changes.firstName !== undefined) {
    if (!changes.firstName) errors.firstName = 'First name is required';
    else if (changes.firstName.length > MAX_NAME_LENGTH) errors.firstName = `Must be ${MAX_NAME_LENGTH} characters or fewer`;
    else if (!NAME_PATTERN.test(changes.firstName)) errors.firstName = NAME_CHARS_MESSAGE;
  }
  if (changes.lastName !== undefined) {
    if (changes.lastName.length > MAX_NAME_LENGTH) errors.lastName = `Must be ${MAX_NAME_LENGTH} characters or fewer`;
    else if (!NAME_PATTERN.test(changes.lastName)) errors.lastName = NAME_CHARS_MESSAGE;
  }
  if (changes.email !== undefined) {
    if (!changes.email) errors.email = 'Email is required';
    else if (changes.email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(changes.email)) {
      errors.email = 'Enter a valid email address';
    }
  }
  if (changes.phoneNumber !== undefined && !PHONE_PATTERN.test(changes.phoneNumber)) {
    errors.phone = 'Enter 10 to 15 digits, optionally starting with +';
  }
  return errors;
}

const EditCandidateModal: React.FC<EditCandidateModalProps> = ({ application, onClose, onSaved }) => {
  const { toast } = useToast();

  const original: FormValues = {
    firstName: application.firstName ?? '',
    lastName: application.lastName ?? '',
    email: application.email ?? '',
    phone: application.phone ?? '',
  };
  // Seeded once on mount. The parent mounts a fresh dialog for every edit,
  // so there is no effect copying props into state.
  const [values, setValues] = useState<FormValues>(original);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const changes = getChanges(values, original);
  const hasChanges = Object.keys(changes).length > 0;

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setServerError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasChanges || saving) return;

    const validationErrors = validate(changes);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    const result = await adminService.updateCandidateContact(application.id, changes);
    setSaving(false);

    if (!result.status) {
      // Keep the dialog open so the admin can fix it (e.g. a mobile already used by another application)
      setServerError(result.message);
      return;
    }

    const savedName = `${changes.firstName ?? original.firstName} ${changes.lastName ?? original.lastName}`.trim();
    toast({
      title: 'Candidate updated',
      description: `Saved changes for ${savedName || 'the candidate'}.`,
    });
    onSaved();
    onClose();
  };

  // A render helper rather than a nested component: a component declared in
  // here would be a new type on every render, remounting the input each
  // keystroke and losing focus.
  const renderField = (
    field: keyof FormValues,
    label: string,
    inputProps: React.InputHTMLAttributes<HTMLInputElement> = {},
    hint?: string
  ) => {
    const id = `edit-candidate-${field}`;
    const messageId = `${id}-message`;
    const error = errors[field];
    return (
      <div className="grid gap-1.5">
        <Label htmlFor={id} className="text-slate-700">{label}</Label>
        <Input
          id={id}
          value={values[field]}
          onChange={handleChange(field)}
          disabled={saving}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error || hint ? messageId : undefined}
          className={error ? 'border-red-500 focus-visible:ring-red-500' : undefined}
          {...inputProps}
        />
        {error ? (
          <p id={messageId} className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p id={messageId} className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={open => { if (!open && !saving) onClose(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Edit candidate details</DialogTitle>
            <DialogDescription>
              {application.name || 'Candidate'} · Application {application.id}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {renderField('firstName', 'First name')}
              {renderField('lastName', 'Last name')}
            </div>
            {renderField('email', 'Email', { type: 'email' })}
            {renderField('phone', 'Mobile number', { type: 'tel' }, 'Candidates log in with this number.')}
          </div>

          {serverError && (
            <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!hasChanges || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCandidateModal;
