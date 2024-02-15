import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Link } from '@remix-run/react';

type AnchorProps = Omit<ComponentProps<typeof Link>, 'className'>;

export function Anchor({ children, to, ...props }: AnchorProps) {
  const className = cx(
    'text-electric-violet-500',
    'hover:text-electric-violet-600',
    'active:text-electric-violet-700',
    'disabled:text-electric-violet-200',
    'group-disabled:text-electric-violet-200',
  );

  return (
    <Link className={className} to={to} {...props}>
      {children}
    </Link>
  );
}
