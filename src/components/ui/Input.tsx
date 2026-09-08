import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className, id, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        id={id}
        className={cn(
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200',
          icon ? 'pl-10' : '',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = ({ label, error, className, id, ...props }: TextareaProps) => (
  <div className="flex flex-col gap-1.5">
    {label && <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>}
    <textarea
      id={id}
      className={cn(
        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 min-h-[100px] resize-y',
        'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
        error ? 'border-red-400' : 'border-gray-200',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = ({ label, error, className, id, children, ...props }: SelectProps) => (
  <div className="flex flex-col gap-1.5">
    {label && <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>}
    <select
      id={id}
      className={cn(
        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
        error ? 'border-red-400' : 'border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);
