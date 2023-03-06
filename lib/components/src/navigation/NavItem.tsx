export type NavItemProps = {
  label: string;
};
export function NavItem({ children }: React.PropsWithChildren<{}>) {
  return <li className="mr-4 dark:text-slate-50 text-slate-900">{children}</li>;
}
