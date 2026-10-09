import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

/**
 * The application shell of the Studios, Packs and Automation sections: the same sidebar and header as
 * the dashboard, chat and profile, so moving between sections never drops the navigation.
 */
export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="flex h-screen overflow-hidden bg-surface-0 transition-colors duration-200">
      <Sidebar />
      <section className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <section className="flex-1 overflow-auto scrollbar-thin">{children}</section>
      </section>
    </section>
  );
}
