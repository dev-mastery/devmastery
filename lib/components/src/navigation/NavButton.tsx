import { NavItem, NavItemProps } from "./NavItem";

export type NavButtonProps = NavItemProps & {
  onClick: Required<ButtonOnClick>;
} & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

export function NavButton({ label, onClick, ...props }: NavButtonProps) {
  return (
    <NavItem>
      <button onClick={onClick} {...props}>
        {label}
      </button>
    </NavItem>
  );
}

export function isNavButtonProps(props: unknown): props is NavButtonProps {
  return "onClick" in (props as NavButtonProps);
}

type ButtonOnClick = React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
