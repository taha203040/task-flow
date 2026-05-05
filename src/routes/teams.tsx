import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import ProtectedRoute from "@/components/Protected";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import SearchBox from "@/components/search-box";

export const Route = createFileRoute("/teams")({
  head: () => ({ meta: [{ title: "Teams — Tasky" }] }),
  component: TeamsPage,
});

function TeamsPage() {
  const [data, setData] = useState({ name: "", description: "" });
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const qc = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/verify", { withCredentials: true });
        setUser(res.data);
      } catch {
        // not logged in handled by ProtectedRoute
      }
    })();
  }, []);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => (await api.get("/teams/", { withCredentials: true })).data,
  });

  const deleteTeam = useMutation({
    mutationFn: async (id: string) => api.delete(`/teams/${id}`, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Team deleted");
      qc.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: () => toast.error("Failed to delete team"),
  });

  const createTeamMutation = useMutation({
    mutationFn: async () => api.post("/teams/", data, { withCredentials: true }),
    onSuccess: () => {
      toast.success("Team created");
      qc.invalidateQueries({ queryKey: ["teams"] });
    },
    onError: () => toast.error("Failed to create team"),
  });

  useEffect(() => {
    if (!selectedTeam?.id) return;
    (async () => {
      try {
        const res = await api.get(`/members/t/${selectedTeam.id}`, { withCredentials: true });
        setMembers(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedTeam?.id]);

  const deleteMember = useMutation({
    mutationFn: async ({ teamId, userId }: { teamId: string; userId: string }) =>
      api.delete(`/members/${teamId}/${userId}`, { withCredentials: true }),
    onSuccess: async () => {
      toast.success("Member removed");
      if (selectedTeam?.id) {
        const res = await api.get(`/members/t/${selectedTeam.id}`, { withCredentials: true });
        setMembers(res.data);
      }
    },
    onError: () => toast.error("Failed to remove member"),
  });

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader title="Teams" />
          <div className="flex items-center justify-between border-b p-6">
            <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create Team</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a new team</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createTeamMutation.mutate();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Team name</Label>
                    <Input
                      placeholder="Enter team name"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Short description"
                      value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createTeamMutation.isPending}>
                    {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1 p-6">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teams?.map((team: any) => (
                  <Card
                    key={team.id}
                    onClick={() => {
                      setSelectedTeam(team);
                      setOpen(true);
                    }}
                    className="cursor-pointer transition hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <CardTitle className="truncate">{team.name}</CardTitle>
                          <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                            {team.description || "No description"}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              ⋮
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Save</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteTeam.mutate(team.id)}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            <Drawer direction="right" open={open} onOpenChange={setOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{selectedTeam?.name}</DrawerTitle>
                  <DrawerDescription>
                    {selectedTeam?.description || "No description available."}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="space-y-6 p-4">
                  {selectedTeam?.id && user?.user_id && (
                    <SearchBox teamId={selectedTeam.id} userId={user.user_id} />
                  )}
                  <section>
                    <h3 className="mb-2 text-sm font-semibold">Members</h3>
                    <div className="space-y-2">
                      {members && members.length > 0 ? (
                        members.map((m: any) => (
                          <div
                            key={m.user_id}
                            className="flex items-center justify-between rounded-lg border p-2"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <span className="text-xs">
                                  {m.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{m.name}</p>
                                <p className="text-xs text-muted-foreground">{m.role}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteMember.mutate({
                                  teamId: selectedTeam.id,
                                  userId: m.user_id,
                                })
                              }
                              disabled={deleteMember.isPending}
                            >
                              {deleteMember.isPending ? "Removing..." : "Remove"}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No members found</p>
                      )}
                    </div>
                  </section>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
