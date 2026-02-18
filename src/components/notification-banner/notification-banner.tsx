import { Toaster } from "sonner";

export default function NotificationBanner() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={3500}
      visibleToasts={2}
      expand={true}
      toastOptions={{
        className:
          "border border-border rounded-lg shadow-xl bg-app-color text-app-color",
        style: {
          // background: "hsl(var(--background))",
          // color: "hsl(var(--foreground))",
          // borderRadius: "var(--radius)",
        },
      }}
    />
  );
}
