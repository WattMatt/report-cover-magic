import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthCriteria {
  label: string;
  met: boolean;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const criteria: StrengthCriteria[] = useMemo(() => [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /[0-9]/.test(password) },
    { label: "Contains special character (!@#$%^&*)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ], [password]);

  const strength = useMemo(() => {
    const metCount = criteria.filter(c => c.met).length;
    if (metCount === 0) return { level: 0, label: "", color: "bg-muted" };
    if (metCount <= 2) return { level: 1, label: "Weak", color: "bg-destructive" };
    if (metCount === 3) return { level: 2, label: "Fair", color: "bg-orange-500" };
    if (metCount === 4) return { level: 3, label: "Good", color: "bg-yellow-500" };
    return { level: 4, label: "Strong", color: "bg-green-500" };
  }, [criteria]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                level <= strength.level ? strength.color : "bg-muted"
              }`}
            />
          ))}
        </div>
        {strength.label && (
          <p className={`text-xs font-medium ${
            strength.level === 1 ? "text-destructive" :
            strength.level === 2 ? "text-orange-500" :
            strength.level === 3 ? "text-yellow-600" :
            "text-green-600"
          }`}>
            {strength.label}
          </p>
        )}
      </div>

      {/* Criteria checklist */}
      <ul className="space-y-1">
        {criteria.map((criterion, index) => (
          <li
            key={index}
            className={`flex items-center gap-2 text-xs transition-colors ${
              criterion.met ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {criterion.met ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;