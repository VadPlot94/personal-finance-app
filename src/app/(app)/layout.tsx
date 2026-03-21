import "@/app/globals.css";
import HorizontalSideBar from "@/components/sidebar/horizontal-sidebar";
import VerticalSideBar from "@/components/sidebar/vertical-sidebar";
import { cn } from "@/lib/utils";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] h-full overflow-x-hidden",
        "max-md:grid-cols-1",
      )}
    >
      <div className="w-fit max-md:hidden bg-black">
        <VerticalSideBar />
      </div>
      <div className="@container flex flex-col gap-4 mx-6 my-4 pb-12">
        {children}
      </div>
      <div className="md:hidden flex flex-col justify-end fixed bottom-0 left-0 right-0 z-50 h-12 bg-black">
        <HorizontalSideBar />
      </div>
    </div>
  );
}
