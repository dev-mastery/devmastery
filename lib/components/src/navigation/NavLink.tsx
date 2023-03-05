import { NavItem, NavItemProps } from "./NavItem";

export type NavLinkProps = NavItemProps & {
  href: string;
} & React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >;

export function NavLink({ href, label, ...props }: NavLinkProps) {
  return (
    <NavItem>
      <a href={href} {...props}>
        {label}
      </a>
    </NavItem>
  );
}

export function isNavLinkProps(props: unknown): props is NavLinkProps {
  return "href" in (props as NavLinkProps);
}
