import { NavButtonProps, isNavButtonProps, NavButton } from "./NavButton";
import { NavLinkProps, isNavLinkProps, NavLink } from "./NavLink";

export type NavItems = Array<NavLinkProps | NavButtonProps>;
export type NavProps = {
  items: NavItems;
  className?: string;
};
export function Nav({ items, className }: NavProps) {
  const itemNodes = items.map((props, index) => {
    if (isNavLinkProps(props)) {
      return <NavLink key={index} {...(props as NavLinkProps)} />;
    }
    if (isNavButtonProps(props)) {
      return <NavButton key={index} {...(props as NavButtonProps)} />;
    }
    throw new Error("Invalid NavItemProps");
  });
  return (
    <nav className={className}>
      <ul className="flex">{itemNodes}</ul>
    </nav>
  );
}
