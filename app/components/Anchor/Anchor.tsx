import { cx } from 'class-variance-authority';
import { ComponentProps } from 'react';

type AnchorProps = Omit<ComponentProps<'a'>, 'className'>;

export function Anchor({ children, ...props }: AnchorProps) {
  const className = cx(
    'text-electric-violet-500',
    'hover:text-electric-violet-600',
    'active:text-electric-violet-700',
    'disabled:text-electric-violet-200',
    'group-disabled:text-electric-violet-200',
  );

  return (
    <a className={className} {...props}>
      {children}
    </a>
  );
}
