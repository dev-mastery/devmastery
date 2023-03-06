import { Logo } from "./Logo";
import { TopNav } from "./navigation/";

export function Header() {
  return (
    <header className={`w-full dark:bg-slate-900 bg-slate-50`}>
      <div className="max-w-screen-xl mx-auto flex items-center h-10 justify-between">
        <span className="ml-4">
          <Logo className="h-6" />
        </span>
        <TopNav />
      </div>
    </header>
  );
}
