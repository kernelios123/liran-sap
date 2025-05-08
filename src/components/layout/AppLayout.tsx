
import { AppSidebar } from "./AppSidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6 md:p-10 bg-parchment-leaves bg-cover bg-fixed overflow-x-hidden">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
