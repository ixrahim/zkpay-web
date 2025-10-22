import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}
