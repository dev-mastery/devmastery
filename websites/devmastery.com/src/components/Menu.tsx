import Link from "next/link";
import styled from "@emotion/styled";
import ThemeMode from "./ThemeMode";

const Nav = styled.nav`
  justify-self: end;
  display: grid;
  align-content: center;
  justify-content: space-evenly;
  grid-gap: 2em;
  grid-template-columns: repeat(6, auto);
`;

const NavItem = styled.a`
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
`;

export default function Menu({ t }: { t: { [key: string]: string } }) {
  return (
    <Nav>
      <Link href="/articles">
        <NavItem>{t["articles"]}</NavItem>
      </Link>
      <Link href="/videos">
        <NavItem>{t["videos"]}</NavItem>
      </Link>
      <Link href="/podcasts">
        <NavItem>{t["podcasts"]}</NavItem>
      </Link>
      <Link href="/books">
        <NavItem>{t["books"]}</NavItem>
      </Link>
      <Link href="/courses">
        <NavItem>{t["courses"]}</NavItem>
      </Link>
      <NavItem>
        <ThemeMode text={t} />
      </NavItem>
    </Nav>
  );
}

export interface MenuItem {
  slug: string;
  priority: number;
  label: string;
}
