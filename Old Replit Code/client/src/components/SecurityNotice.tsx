import { LockIcon, ShieldIcon } from "lucide-react";

export default function SecurityNotice() {
  return (
    <div className="bg-neutral-100 rounded-lg p-6 border border-neutral-200">
      <div className="flex items-center mb-4">
        <LockIcon className="h-4 w-4 text-primary mr-2" />
        <h3 className="text-sm font-semibold text-neutral-900">Security Notice</h3>
      </div>
      <p className="text-sm text-neutral-700 mb-3">
        Your information is encrypted and secure. We never share your personal data with unauthorized third parties.
      </p>
      <div className="flex items-center text-xs text-neutral-500">
        <ShieldIcon className="h-3 w-3 mr-1" />
        <span>256-bit SSL Encryption</span>
      </div>
    </div>
  );
}
