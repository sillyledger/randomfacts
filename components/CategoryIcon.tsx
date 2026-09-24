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

function PawIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M12 11.5c-2.9 0-5.5 3.1-5.5 5.9 0 1.7 1.1 2.6 2.6 2.6 1.2 0 1.9-.7 2.9-.7s1.7.7 2.9.7c1.5 0 2.6-.9 2.6-2.6 0-2.8-2.6-5.9-5.5-5.9Z" />
      <circle cx="4.5" cy="10" r="2.2" />
      <circle cx="9" cy="4.8" r="2.2" />
      <circle cx="15" cy="4.8" r="2.2" />
      <circle cx="19.5" cy="10" r="2.2" />
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

function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M12 20c-6-4-8.5-7.5-8.5-10.8C3.5 6.6 5.5 4.5 8 4.5c1.7 0 3.1.9 4 2.3.9-1.4 2.3-2.3 4-2.3 2.5 0 4.5 2.1 4.5 4.7 0 3.3-2.5 6.8-8.5 10.8Z" />
    </svg>
  );
}

function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </svg>
  );
}

function SpeechBubbleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4 3.5V17H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function MicrochipIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5" />
    </svg>
  );
}

const iconByCategory: Record<Category, (props: IconProps) => JSX.Element> = {
  Science: FlaskIcon,
  Animals: PawIcon,
  Space: SpaceIcon,
  History: HourglassIcon,
  Food: AppleIcon,
  Culture: FlagIcon,
  'Human Body': HeartIcon,
  Earth: GlobeIcon,
  Language: SpeechBubbleIcon,
  Technology: MicrochipIcon,
};

export function CategoryIcon({ category, className }: { category: Category } & IconProps) {
  const Icon = iconByCategory[category];
  return <Icon className={className} />;
}
