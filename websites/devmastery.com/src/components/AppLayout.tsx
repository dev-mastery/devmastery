import styled from "@emotion/styled";
import Logo from "./Logo";
import Menu from "./Menu";
import { interpolate } from "../label/";
import { PropsWithChildren, useMemo } from "react";

const Container = styled.div`
  display: grid;
  width: 100vw;
  min-height: 100vh;
  grid-template-rows: auto minmax(auto, 90px);
  /* transition: all 1s ease-out; */
`;

const Header = styled.div`
  color: ${({ theme }) =>
    theme.mode === "dark" ? theme.colors.light : theme.colors.white};
  margin: 0 auto;
  padding-top: 2px;
  height: 56px;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.mode === "dark" ? theme.colors.black : theme.colors.brand};
  justify-content: center;
  align-content: center;
  display: grid;
  z-index: 200;
  position: fixed;
  /* border-bottom: 2px solid ${({ theme }) => theme.colors.accent}; */
`;

const TopBar = styled.section`
  display: grid;
  grid-template-columns: 200px auto;
  max-width: 1366px;
  width: 96vw;
  align-content: center;
`;

const LogoWrapper = styled.div`
  justify-self: start;
`;

const Body = styled.main`
  margin-top: 56px;
  height: 100%;
  width: 100%;
  color: ${({ theme }) =>
    theme.mode === "dark" ? theme.colors.black : theme.colors.white};
  background-color: ${({ theme }) =>
    theme.mode === "dark" ? theme.colors.dark : theme.colors.light};
`;

const Footer = styled.small`
  color: white;
  height: 100%;
  width: 100%;
  background-color: #222;
  text-align: center;
  padding: 1vh 0;
`;

export default function AppLayout({
  children,
  t,
}: PropsWithChildren<{
  t: { [key: string]: string };
}>): JSX.Element {
  const { copyright, logo: logoTitle } = t;
  const copyrightNotice = useMemo(
    () =>
      interpolate({
        text: copyright,
        mergeFields: { currentYear: new Date().getFullYear() },
      }),
    [copyright]
  );
  return (
    <Container>
      <Header>
        <TopBar>
          <LogoWrapper>
            <Logo title={logoTitle} />
          </LogoWrapper>
          <Menu t={t ?? {}} />
        </TopBar>
      </Header>
      <Body>{children}</Body>
      <Footer>{copyrightNotice}</Footer>
    </Container>
  );
}
