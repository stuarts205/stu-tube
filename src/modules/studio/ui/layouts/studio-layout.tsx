import { SidebarProvider } from "@/components/ui/sidebar";
import StudioNavbar from "../components/studio-navbar";
import HomeSidebar from "../components/studio-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex m-h-screen pt-[4rem]">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
