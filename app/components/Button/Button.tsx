import type { ComponentProps } from 'react';
import { VariantProps, cx } from 'class-variance-authority';

type ButtonProps = Omit<ComponentProps<'button'>, 'className'>;

export function Button(props: ButtonProps) {
  const className = cx(
    'py-3 px-6 rounded-lg',
    'text-white bg-electric-violet-500',
    'hover:bg-electric-violet-600',
    'active:bg-electric-violet-700',
    'disabled:bg-electric-violet-200 disabled:text-electric-violet-700',
    'group-disabled:bg-electric-violet-200 group-disabled:text-electric-violet-700',
  );

  return <button className={className} {...props} />;
}
