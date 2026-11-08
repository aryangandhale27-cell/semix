import React, { useEffect, useState } from 'react';
import { AlertCircle, Banknote, Camera, Check, LoaderCircle, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { AuthUser } from '../../types';
import { INDIAN_SCHEDULED_BANKS, TeamMemberProfile, getTeamMemberProfile, saveTeamMemberProfile } from '../../services/teamMemberProfileService';
import { useApp } from '../../context/AppContext';

const createInitialProfile = (user: AuthUser): TeamMemberProfile => ({
  name: user.name || '',
  mobile: user.phone || '',
  email: user.email || '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountName: user.name || '',
  internId: '',
  photoDataUrl: '',
});

async function resizeProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choose an image file to upload.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Choose a photo smaller than 5 MB.');
  }

  const image = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    const size = 320;
    const scale = Math.min(size / image.width, size / image.height);
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not process the selected photo.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
    if (dataUrl.length > 450_000) {
      throw new Error('This photo could not be compressed enough. Please choose another image.');
    }
    return dataUrl;
  } finally {
    image.close();
  }
}

interface TeamMemberProfileCardProps {
  user: AuthUser;
}

export const TeamMemberProfileCard: React.FC<TeamMemberProfileCardProps> = ({ user }) => {
  const { showToast } = useApp();
  const [profile, setProfile] = useState<TeamMemberProfile>(() => createInitialProfile(user));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(false);
    getTeamMemberProfile(user.id).then((savedProfile) => {
      if (active && savedProfile) {
        setProfile({ ...createInitialProfile(user), ...savedProfile, email: user.email });
      }
    }).catch((error: unknown) => {
      console.error('[Team Profile] Could not load private profile:', error);
      if (active) {
        setLoadError(true);
        showToast('Profile Load Failed', 'Your private profile could not be loaded. Please retry.', 'error');
      }
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [showToast, user]);

  const updateField = (field: keyof TeamMemberProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      updateField('photoDataUrl', await resizeProfilePhoto(file));
    } catch (error) {
      showToast('Photo Not Added', error instanceof Error ? error.message : 'The selected photo could not be processed.', 'error');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mobileDigits = profile.mobile.replace(/\D/g, '');
    if (mobileDigits.length < 10 || mobileDigits.length > 13) {
      showToast('Check Mobile Number', 'Enter a valid mobile number with 10 to 13 digits.', 'error');
      return;
    }
    if (!/^\d{6,20}$/.test(profile.accountNumber.trim())) {
      showToast('Check Bank Account Number', 'Enter an account number containing 6 to 20 digits.', 'error');
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(profile.ifscCode.trim())) {
      showToast('Check IFSC Code', 'Enter a valid 11-character IFSC code.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveTeamMemberProfile(user.id, {
        ...profile,
        name: profile.name.trim(),
        mobile: profile.mobile.trim(),
        email: user.email,
        bankName: profile.bankName.trim(),
        accountNumber: profile.accountNumber.trim(),
        ifscCode: profile.ifscCode.trim().toUpperCase(),
        accountName: profile.accountName.trim(),
        internId: profile.internId.trim(),
      });
      showToast('Profile Saved', 'Your team profile was saved securely.', 'success');
    } catch (error) {
      console.error('[Team Profile] Could not save private profile:', error);
      showToast('Profile Save Failed', 'Your profile could not be saved. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 lg:py-2 text-sm text-slate-900 outline-none transition focus:border-[#561269] focus:ring-2 focus:ring-[#561269]/10 disabled:bg-slate-50';
  const labelClassName = 'mb-1.5 lg:mb-1 block text-xs font-bold text-slate-700';
  const initials = profile.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'TM';

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="team-profile-title">
      <div className="bg-gradient-to-r from-[#561269]/5 via-white to-orange-50/70 px-4 py-4 sm:px-5 lg:px-4 lg:py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#561269] text-white shadow-sm">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h2 id="team-profile-title" className="text-sm font-extrabold text-[#561269]">Team Member Profile</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">Contact, internship and payment details</p>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="m-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Profile details could not be loaded. Refresh the page to try again.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5 lg:space-y-3 lg:p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 lg:p-2.5">
            <div className="flex h-14 w-14 lg:h-12 lg:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#561269]/10 text-sm font-black text-[#561269] ring-2 ring-white shadow-sm">
              {profile.photoDataUrl
                ? <img src={profile.photoDataUrl} alt={`${profile.name || 'Team member'} profile`} className="h-full w-full object-cover" />
                : initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{profile.name || 'Your name'}</p>
              <p className="truncate text-xs text-slate-500">{profile.email}</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#561269]/20 bg-white px-2.5 py-2 text-xs font-bold text-[#561269] transition hover:bg-[#561269]/5">
              <Camera className="h-3.5 w-3.5" />
              Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" disabled={isLoading || isSaving} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-x-3 lg:gap-y-2">
            <label>
              <span className={labelClassName}>Full name</span>
              <input required autoComplete="name" value={profile.name} onChange={(event) => updateField('name', event.target.value)} className={inputClassName} disabled={isLoading || isSaving} />
            </label>
            <label>
              <span className={labelClassName}>Mobile number</span>
              <span className="relative block">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input required type="tel" autoComplete="tel" value={profile.mobile} onChange={(event) => updateField('mobile', event.target.value)} className={`${inputClassName} pl-9`} disabled={isLoading || isSaving} />
              </span>
            </label>
            <label className="sm:col-span-2">
              <span className={labelClassName}>Email address</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="email" value={user.email} className={`${inputClassName} pl-9`} disabled readOnly />
              </span>
            </label>
            <label className="sm:col-span-2">
              <span className={labelClassName}>Bank</span>
              <input required list="indian-scheduled-banks" value={profile.bankName} onChange={(event) => updateField('bankName', event.target.value)} className={inputClassName} placeholder="Search or select a scheduled bank" disabled={isLoading || isSaving} />
              <datalist id="indian-scheduled-banks">
                {INDIAN_SCHEDULED_BANKS.map((bank) => <option key={bank} value={bank} />)}
              </datalist>
            </label>
            <label>
              <span className={labelClassName}>Account number</span>
              <span className="relative block">
                <Banknote className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input required inputMode="numeric" autoComplete="off" value={profile.accountNumber} onChange={(event) => updateField('accountNumber', event.target.value.replace(/\D/g, ''))} className={`${inputClassName} pl-9`} disabled={isLoading || isSaving} />
              </span>
            </label>
            <label>
              <span className={labelClassName}>IFSC code</span>
              <input required autoComplete="off" maxLength={11} value={profile.ifscCode} onChange={(event) => updateField('ifscCode', event.target.value.toUpperCase())} className={inputClassName} placeholder="e.g. HDFC0001234" disabled={isLoading || isSaving} />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClassName}>Bank account name</span>
              <input required autoComplete="name" value={profile.accountName} onChange={(event) => updateField('accountName', event.target.value)} className={inputClassName} disabled={isLoading || isSaving} />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClassName}>Intern ID received</span>
              <input required value={profile.internId} onChange={(event) => updateField('internId', event.target.value)} className={inputClassName} placeholder="Enter your assigned intern ID" disabled={isLoading || isSaving} />
            </label>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5 lg:py-2 text-[11px] leading-relaxed text-emerald-800">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Private profile: only you and authorized administrators can view these details.</span>
          </div>

          <button type="submit" disabled={isLoading || isSaving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#561269] px-4 py-2.5 lg:py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#460e56] disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {isLoading ? 'Loading profile…' : isSaving ? 'Saving securely…' : 'Save Profile'}
          </button>
        </form>
      )}
    </section>
  );
};
