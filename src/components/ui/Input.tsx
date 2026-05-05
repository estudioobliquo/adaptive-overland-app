import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs uppercase tracking-widest text-muted">{label}</label>
    <input
      ref={ref}
      {...props}
      className={`bg-bg border px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition-colors focus:border-accent ${
        error ? 'border-red-500' : 'border-border hover:border-muted/60'
      } ${props.className ?? ''}`}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
