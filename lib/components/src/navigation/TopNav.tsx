import { Nav } from "./Nav";

const navItemCss = "dark:text-slate-50 text-slate-900 h-8 inline-block my-1";
const navButtonCss =
  "dark:bg-blue-500 rounded-xl text-slate-50 h-8 py-0 font-bold";

const items = [
  { href: "/blog", label: "Blog", className: navItemCss },
  { href: "/newsletter", label: "Newsletter", className: navItemCss },
];

export function TopNav() {
  return <Nav className="mr-4 mt-2" items={items} />;
}
