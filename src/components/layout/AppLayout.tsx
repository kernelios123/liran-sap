
import { AppSidebar } from "./AppSidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 bg-grove-background overflow-x-hidden bg-leaf-pattern bg-fixed bg-cover">
        <div className="container mx-auto py-8 px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
