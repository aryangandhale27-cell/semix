import React, { useEffect, useState } from 'react';
import { AlertCircle, Banknote, BriefcaseBusiness, LoaderCircle, Mail, Phone, UserRound, X } from 'lucide-react';
import { AuthUser } from '../../types';
import { getTeamMemberProfile, TeamMemberProfile } from '../../services/teamMemberProfileService';

interface TeamMemberProfileModalProps {
  user: AuthUser;
  onClose: () => void;
}

export const TeamMemberProfileModal: React.FC<TeamMemberProfileModalProps> = ({ user, onClose }) => {
  const [profile, setProfile] = useState<TeamMemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    getTeamMemberProfile(user.id).then((result) => {
      if (active) setProfile(result);
    }).catch((error: unknown) => {
      console.error('[Admin Team Profile] Could not load private profile:', error);
      if (active) setLoadError(true);
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [user.id]);

  const detail = (label: string, value: string | undefined, icon: React.ReactNode) => (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{icon}{label}</p>
      <p className="break-all text-sm font-semibold text-slate-900">{value || 'Not provided'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="team-profile-modal-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 p-4 backdrop-blur sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#561269]/10 text-[#561269]"><UserRound className="h-5 w-5" /></div>
            <div>
              <h2 id="team-profile-modal-title" className="text-base font-extrabold text-slate-900">Team Member Profile</h2>
              <p className="text-xs text-slate-500">Private staff information</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close profile" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><X className="h-5 w-5" /></button>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" />Loading private profile…</div>
        ) : loadError ? (
          <div className="m-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Profile could not be loaded. Check access and connection, then try again.</span>
          </div>
        ) : !profile ? (
          <div className="p-10 text-center">
            <BriefcaseBusiness className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="font-bold text-slate-800">Profile not completed</p>
            <p className="mt-1 text-xs text-slate-500">This team member has not submitted their details yet.</p>
          </div>
        ) : (
          <div className="space-y-5 p-4 sm:p-6">
            <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#561269]/5 to-orange-50 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#561269]/10 text-lg font-black text-[#561269] ring-2 ring-white shadow">
                {profile.photoDataUrl ? <img src={profile.photoDataUrl} alt={`${profile.name} profile`} className="h-full w-full object-cover" /> : profile.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-extrabold text-[#561269]">{profile.name}</h3>
                <p className="mt-0.5 text-xs text-slate-600">Intern ID: <strong>{profile.internId || 'Not provided'}</strong></p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {detail('Email', profile.email || user.email, <Mail className="h-3.5 w-3.5" />)}
              {detail('Mobile number', profile.mobile, <Phone className="h-3.5 w-3.5" />)}
              {detail('Bank', profile.bankName, <Banknote className="h-3.5 w-3.5" />)}
              {detail('Account name', profile.accountName, <UserRound className="h-3.5 w-3.5" />)}
              {detail('Account number', profile.accountNumber, <Banknote className="h-3.5 w-3.5" />)}
              {detail('IFSC code', profile.ifscCode, <Banknote className="h-3.5 w-3.5" />)}
            </div>
            <p className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" /> Confidential staff information. Share only with authorized personnel.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
