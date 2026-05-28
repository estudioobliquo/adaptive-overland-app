import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs uppercase tracking-widest text-[#888]">{label}</label>
    <input
      ref={ref}
      {...props}
      className={`bg-white border px-4 py-3 text-sm text-[#1a1714] placeholder:text-[#bbb] outline-none transition-colors focus:border-accent ${
        error ? 'border-red-400' : 'border-[#e0dcd6] hover:border-[#c0bcb8]'
      } ${props.className ?? ''}`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
