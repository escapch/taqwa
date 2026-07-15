'use client';

interface Props {
  icon: React.ReactNode;
  label?: string | number;
  onClick: () => void;
}

export const HadithActionButton: React.FC<Props> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
  >
    {icon}
    {label !== undefined && <span className="text-sm font-medium">{label}</span>}
  </button>
);
