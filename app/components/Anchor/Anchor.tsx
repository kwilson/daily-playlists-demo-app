import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { Link } from '@remix-run/react';

type AnchorProps = Omit<ComponentProps<typeof Link>, 'className'>;

export function Anchor({ children, to, ...props }: AnchorProps) {
  const className = cx(
    'text-electric-violet-300',
    'hover:text-electric-violet-400',
    'active:text-electric-violet-500',
    'disabled:text-electric-violet-400',
    'group-disabled:text-electric-violet-400',
  );

  return (
    <Link className={className} to={to} {...props}>
      {children}
    </Link>
  );
}
