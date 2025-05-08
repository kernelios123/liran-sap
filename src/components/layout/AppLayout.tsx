
import { AppSidebar } from "./AppSidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-white to-nature-sand/10 bg-leaf-pattern bg-fixed bg-opacity-50">
        {children}
      </main>
    </div>
  );
}
