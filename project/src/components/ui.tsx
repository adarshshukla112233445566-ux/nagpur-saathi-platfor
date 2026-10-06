import type { ReactNode } from 'react';

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Reported': 'bg-blue-50 text-blue-700 ring-blue-200',
    'Verified': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    'Assigned': 'bg-amber-50 text-amber-700 ring-amber-200',
    'In Progress': 'bg-saffron-50 text-saffron-700 ring-saffron-200',
    'Resolved': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    'Rescue in Progress': 'bg-saffron-50 text-saffron-700 ring-saffron-200',
  };
  const style = styles[status] ?? 'bg-navy-50 text-navy-700 ring-navy-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${style}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    'Low': 'bg-slate-100 text-slate-600',
    'Medium': 'bg-blue-100 text-blue-700',
    'High': 'bg-orange-100 text-orange-700',
    'Critical': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${styles[priority] ?? styles['Medium']}`}>
      {priority}
    </span>
  );
}

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        !
      </div>
      <p className="text-sm font-medium text-navy-700">{message}</p>
      {onRetry && <button onClick={onRetry} className="btn-ghost">Try again</button>}
    </div>
  );
}

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
      </div>
      <p className="text-base font-semibold text-navy-800">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-navy-400">{subtitle}</p>}
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg animate-slide-up rounded-t-3xl bg-white p-5 shadow-soft sm:animate-scale-in sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-navy-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Timeline({ steps, current }: { steps: string[]; current: string }) {
  const currentIdx = steps.indexOf(current);
  return (
    <ol className="relative ml-2 border-l border-navy-100">
      {steps.map((step, idx) => {
        const done = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <li key={step} className="mb-5 ml-4 last:mb-0">
            <span className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${done ? 'bg-navy-600' : 'bg-navy-200'} ${isCurrent ? 'h-5 w-5 -left-[11px] bg-saffron-500' : ''}`} />
            <p className={`text-sm font-semibold ${done ? 'text-navy-900' : 'text-navy-300'}`}>{step}</p>
          </li>
        );
      })}
    </ol>
  );
}
