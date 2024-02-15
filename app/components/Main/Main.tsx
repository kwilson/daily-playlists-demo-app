type Props = Exclude<React.ComponentProps<'main'>, 'className'>;

export function Main({ children, ...props }: Props) {
  return (
    <main className="container mx-auto text-white" {...props}>
      {children}
    </main>
  );
}
