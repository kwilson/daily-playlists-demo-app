import { type ComponentProps, useId } from 'react';

type SearchFieldProps = Exclude<ComponentProps<'input'>, 'type'> & {
  label: string;
};

export function SearchField({ label, ...props }: SearchFieldProps) {
  const localId = useId();
  const id = props.id ?? localId;

  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        className="flex-1 max-w-96 border border-electric-violet-500 bg-white text-black px-4 font-medium rounded-lg bg-transparent"
        id={id}
        type="search"
        {...props}
      />
    </>
  );
}
