import {
  IconCirclePlusFilled,
  IconMail,
  IconCheck,
  IconX,
  type Icon,
} from "@tabler/icons-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface Invitation {
  id: string;
  team_id: string;
  invited_by: string;
  name?: string;
  role: string;
  status: string;
}

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon?: Icon }[];
}) {
  const navigate = useNavigate();
  const [data, setData] = useState<Invitation[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/invites/user/", { withCredentials: true });
        if (res.data) setData(res.data);
      } catch (error) {
        console.error("Failed to fetch invites:", error);
      }
    })();
  }, []);

  const count = data.length;

  const handleResponse = async (id: string, action: "rejected" | "accepted") => {
    try {
      await api.patch(`/invites/${id}/respond/`, { action }, { withCredentials: true });
      setData((prev) => prev.map((d) => (d.id === id ? { ...d, status: action } : d)));
    } catch (error) {
      console.error(`Failed to ${action} invitation:`, error);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="size-8 group-data-[collapsible=icon]:opacity-0 relative"
                  variant="outline"
                >
                  <IconMail />
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
                    {count > 9 ? "+9" : count}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {data.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">No invitations</div>
                  )}
                  {data.map((invitation) => (
                    <DropdownMenuItem
                      key={invitation.id}
                      className="flex flex-col items-start gap-2 p-4"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-semibold">{invitation.name || "Unknown Team"}</span>
                        <span className="text-xs text-muted-foreground">
                          By: {invitation.invited_by}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You've been invited to join "{invitation.name || "Unknown Team"}".
                      </p>
                      <div className="flex w-full gap-2 pt-2">
                        {invitation.status === "accepted" ? (
                          <span className="text-sm font-medium text-green-600">Accepted</span>
                        ) : invitation.status === "rejected" ? (
                          <span className="text-sm font-medium text-destructive">Rejected</span>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleResponse(invitation.id, "accepted")}
                            >
                              <IconCheck className="text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleResponse(invitation.id, "rejected")}
                            >
                              <IconX className="text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => navigate({ to: item.url })}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
