import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size: number;
};

function IconBase({ children, size, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

export function ChevronRightIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M9 6l6 6-6 6" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M6 9l6 6 6-6" />
    </IconBase>
  );
}

export function HomeIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M4 11.5L12 5l8 6.5" />
      <path d="M7.5 10.5V19h9v-8.5" />
    </IconBase>
  );
}

export function FolderIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M3 8.5h6l2 2H21v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5z" />
      <path d="M3 8.5V6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2.5" />
    </IconBase>
  );
}

export function ArticleIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M7 4.5h8l3 3V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z" />
      <path d="M15 4.5v4h4" />
      <path d="M8.5 12h7" />
      <path d="M8.5 15.5h7" />
    </IconBase>
  );
}

export function GameIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M7 9.5l-2 7a2 2 0 0 0 3.2 2l2.3-1.7a2 2 0 0 1 2.5 0l2.3 1.7A2 2 0 0 0 18.5 16.5l-2-7A3 3 0 0 0 13.6 7H10.4A3 3 0 0 0 7 9.5z" />
      <path d="M8.5 12h3" />
      <path d="M10 10.5v3" />
      <path d="M15.75 11.25h.01" />
      <path d="M17.25 12.75h.01" />
    </IconBase>
  );
}

export function MediaIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="M10 9.5l5 2.5-5 2.5v-5z" />
    </IconBase>
  );
}

export function MoonIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M19 14.5a7.5 7.5 0 1 1-9.5-9.5A8.5 8.5 0 0 0 19 14.5z" />
    </IconBase>
  );
}

export function SunIcon(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5" />
      <path d="M12 19v2.5" />
      <path d="M4.5 12H2" />
      <path d="M22 12h-2.5" />
      <path d="M5.8 5.8L4 4" />
      <path d="M20 20l-1.8-1.8" />
      <path d="M18.2 5.8L20 4" />
      <path d="M4 20l1.8-1.8" />
    </IconBase>
  );
}
