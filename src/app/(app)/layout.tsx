import "@/app/globals.css";
import HorizontalSideBar from "@/components/sidebar/horizontal-sidebar";
import VerticalSideBar from "@/components/sidebar/vertical-sidebar";
import { cn } from "@/lib/utils";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const opacityTransition = "transition-opacity duration-500";

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] h-full overflow-x-hidden",
      )}
    >
      <div
        className={cn(
          opacityTransition,
          "w-fit max-md:opacity-0 max-md:w-0 max-md:h-0 bg-black",
        )}
      >
        <VerticalSideBar />
      </div>
      <div
        className={cn(
          "@container/mainLayout flex flex-col gap-4 mx-6 my-4",
          "md:pb-0",
          "max-md:pb-12",
          "sm:pb-22",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          opacityTransition,
          "md:opacity-0 md:h-0 md:w-0 flex flex-col justify-end fixed bottom-0 left-0 right-0 z-50 bg-black",
        )}
      >
        <HorizontalSideBar />
      </div>
    </div>
  );
}
