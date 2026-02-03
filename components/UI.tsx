import React from 'react';

// --- Glass Card ---
export const GlassCard = ({ children, className = '', hoverEffect = false }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => {
  return (
    <div className={`
      relative bg-[rgba(255,255,255,0.03)] backdrop-blur-xl
      border border-[rgba(255,255,255,0.08)] rounded-2xl
      shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      transition-all duration-300 ease-out
      ${hoverEffect ? 'hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'danger';
}

export const Button = ({ children, variant = 'glass', className = '', ...props }: ButtonProps) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    glass: `
      bg-gradient-to-br from-[rgba(0,245,255,0.1)] to-[rgba(191,90,242,0.1)]
      border border-[rgba(255,255,255,0.1)] text-white
      hover:from-[rgba(0,245,255,0.2)] hover:to-[rgba(191,90,242,0.2)]
      hover:border-[rgba(255,255,255,0.2)]
      hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
    `,
    primary: `
      bg-gradient-to-r from-[#00f5ff] to-[#bf5af2]
      text-black border-none shadow-[0_4px_20px_rgba(0,245,255,0.3)]
      hover:shadow-[0_6px_30px_rgba(0,245,255,0.4)] hover:-translate-y-0.5
    `,
    danger: `
      bg-[rgba(255,55,95,0.1)] border border-[rgba(255,55,95,0.3)] text-[#ff375f]
      hover:bg-[rgba(255,55,95,0.2)] hover:shadow-[0_0_20px_rgba(255,55,95,0.2)]
    `
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
      {variant !== 'primary' && <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-0 h-0 bg-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 active:w-[300px] active:h-[300px] active:opacity-0" />
      </div>}
    </button>
  );
};

// --- Input ---
export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`
      w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]
      rounded-xl px-4 py-3 text-white placeholder-white/30
      focus:outline-none focus:bg-[rgba(255,255,255,0.08)]
      focus:border-[#00f5ff] focus:shadow-[0_0_20px_rgba(0,245,255,0.2)]
      transition-all duration-300
    `}
    {...props}
  />
);

// --- Subject Badge ---
export const SubjectBadge = ({ subject }: { subject: string }) => {
  const colors: Record<string, string> = {
    Maths: 'text-[#0a84ff] bg-[rgba(10,132,255,0.15)] border-[rgba(10,132,255,0.3)]',
    Physics: 'text-[#bf5af2] bg-[rgba(191,90,242,0.15)] border-[rgba(191,90,242,0.3)]',
    Chemistry: 'text-[#30d158] bg-[rgba(48,209,88,0.15)] border-[rgba(48,209,88,0.3)]',
    Other: 'text-[#8e8e93] bg-[rgba(142,142,147,0.15)] border-[rgba(142,142,147,0.3)]',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[subject] || colors['Other']}`}>
      {subject}
    </span>
  );
};

// --- Modal ---
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="w-full max-w-md p-6 animate-in fade-in zoom-in duration-300 relative z-10">
        <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">{title}</h2>
        {children}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
      </GlassCard>
    </div>
  );
};