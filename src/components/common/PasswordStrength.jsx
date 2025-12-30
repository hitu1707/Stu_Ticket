import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';

export default function PasswordStrength({ password }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    const levels = {
      0: { label: '', color: '', progress: 0 },
      1: { label: 'Very Weak', color: 'bg-red-500', progress: 20 },
      2: { label: 'Weak', color: 'bg-orange-500', progress: 40 },
      3: { label: 'Fair', color: 'bg-yellow-500', progress: 60 },
      4: { label: 'Good', color: 'bg-blue-500', progress: 80 },
      5: { label: 'Strong', color: 'bg-green-500', progress: 100 },
    };

    return { score, checks, ...levels[score] };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium dark:text-gray-300">
            Password Strength:
          </span>
          <span className={`text-xs font-semibold ${strength.color.replace('bg-', 'text-')}`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${strength.progress}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1 text-xs">
        <RequirementItem met={strength.checks?.length} label="At least 8 characters" />
        <RequirementItem met={strength.checks?.lowercase} label="One lowercase letter" />
        <RequirementItem met={strength.checks?.uppercase} label="One uppercase letter" />
        <RequirementItem met={strength.checks?.number} label="One number" />
        <RequirementItem met={strength.checks?.special} label="One special character (@$!%*?&)" />
      </div>
    </div>
  );
}

function RequirementItem({ met, label }) {
  return (
    <div className={`flex items-center gap-2 ${met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {met ? (
        <Check className="w-3 h-3" />
      ) : (
        <X className="w-3 h-3" />
      )}
      <span>{label}</span>
    </div>
  );
}