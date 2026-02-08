import "@/app/globals.css";
import SideBar from "@/components/sidebar/sidebar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // media lg:grid-cols-[120px_1fr] lg:gap-8
    <div className="grid grid-cols-[120px_1fr] h-full">
      <div>
        <SideBar />
      </div>
      <div className="flex flex-col gap-4 mx-6 my-4">{children}</div>
    </div>
  );
}
