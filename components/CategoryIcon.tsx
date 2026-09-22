import type { Category } from '@/types/fact';

type IconProps = {
  className?: string;
};

const strokeProps = {
  fill: 'none',
  stroke: 'white',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function FlaskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M10 3h4" />
      <path d="M10.5 3v5.5L5.5 18a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3l-5-9.5V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M20 4c-8.5 0-14.5 5-14.5 13.5C13.8 17.5 19.7 12 20 4Z" />
      <path d="M6.5 17.5 15 9" />
    </svg>
  );
}

function SpaceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="12" cy="12" r="4.5" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.2" />
    </svg>
  );
}

function HourglassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M6 3h12" />
      <path d="M6 21h12" />
      <path d="M7 3c0 5 4 6.5 5 7.5-1 1-5 2.5-5 7.5" />
      <path d="M17 3c0 5-4 6.5-5 7.5 1 1 5 2.5 5 7.5" />
    </svg>
  );
}

function AppleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M12 8c-3.5 0-6 2.8-6 6.5S8.2 21 11 21c.7 0 1.3-.2 1.9-.5.5.3 1.1.5 1.8.5 2.8 0 5.3-2.8 5.3-6.5C20 10.8 17.5 8 14 8c-.7 0-1.4.2-2 .5-.6-.3-1.3-.5-2-.5Z" />
      <path d="M12 8c0-1.8 1-3.2 2.5-4" />
    </svg>
  );
}

function FlagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M6 3v18" />
      <path d="M6 4.5c2.5-1.5 4.5-1.5 7 0s4.5 1.5 5 0v8c-.5 1.5-2.5 1.5-5 0s-4.5-1.5-7 0Z" />
    </svg>
  );
}

const iconByCategory: Record<Category, (props: IconProps) => JSX.Element> = {
  Science: FlaskIcon,
  Nature: LeafIcon,
  Space: SpaceIcon,
  History: HourglassIcon,
  Food: AppleIcon,
  Culture: FlagIcon,
};

export function CategoryIcon({ category, className }: { category: Category } & IconProps) {
  const Icon = iconByCategory[category];
  return <Icon className={className} />;
}
