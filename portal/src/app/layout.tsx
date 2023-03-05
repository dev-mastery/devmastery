import "./globals.css";
import { Header } from "../../../lib/components/src/Header";

export const metadata = {
  title: "DevMastery.com",
  description: "Software development mastery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="w-full max-w-screen-xl p-4 mx-auto">{children}</main>
      </body>
    </html>
  );
}
