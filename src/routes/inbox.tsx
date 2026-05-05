import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import ProtectedRoute from "@/components/Protected";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Inbox — Tasky" }] }),
  component: InboxPage,
});

function InboxPage() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Inbox" />
          <div className="p-6">
            <h2 className="text-xl font-semibold">Messages</h2>
            <p className="text-muted-foreground mt-2">Your inbox is empty.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
