export type Member = { id: string; name: string; email: string; role: "Owner" | "Admin" | "Member" };
export type Team = { id: string; name: string; description: string; avatar: string; members: Member[] };
export const projectStatuses = ["Planning", "Active", "On Hold", "Completed", "Archived"] as const;
export const taskStatuses = ["Todo", "In Progress", "In Review", "Done"] as const;
export const priorities = ["Low", "Medium", "High", "Urgent"] as const;
export type Project = { id: string; teamId: string; name: string; description: string; status: typeof projectStatuses[number]; startDate: string; dueDate: string; memberIds: string[]; icon: string };
export type Comment = { id: string; author: string; text: string; date: string };
export type Task = { id: string; projectId: string; title: string; description: string; assigneeId: string; status: typeof taskStatuses[number]; priority: typeof priorities[number]; dueDate: string; labels: string[]; createdAt: string; comments: Comment[]; attachments: { name: string; url: string }[] };
export type Activity = { id: string; text: string; date: string; projectId?: string; read: boolean };
export type Invitation = { id: string; teamId: string; email: string; role: Member["role"]; status: "Pending" | "Accepted" };
export type Workspace = { teams: Team[]; projects: Project[]; tasks: Task[]; activity: Activity[]; invitations: Invitation[] };
export const currentUserId = "mock-user-1";
export function projectProgress(projectId: string, tasks: Task[]) {
  const items = tasks.filter(t => t.projectId === projectId);
  return items.length ? Math.round(items.filter(t => t.status === "Done").length / items.length * 100) : 0;
}
export function validateAssignment(task: Pick<Task, "projectId" | "assigneeId">, projects: Project[]) {
  const project = projects.find(p => p.id === task.projectId);
  if (!project) throw new Error("Select an existing project.");
  if (task.assigneeId && !project.memberIds.includes(task.assigneeId)) throw new Error("Assignee must be a project member.");
}
export function acceptInvitation(state: Workspace, invitationId: string, member: Member): Workspace {
  const invitation = state.invitations.find(i => i.id === invitationId && i.status === "Pending");
  if (!invitation || invitation.email.toLowerCase() !== member.email.toLowerCase()) throw new Error("This invitation is not addressed to you.");
  return { ...state, invitations: state.invitations.map(i => i.id === invitationId ? { ...i, status: "Accepted" } : i), teams: state.teams.map(t => t.id === invitation.teamId ? { ...t, members: t.members.some(m => m.id === member.id) ? t.members : [...t.members, { ...member, role: invitation.role }] } : t) };
}
export function makeDemoWorkspace(): Workspace {
  const today = new Date();
  const date = (offset: number) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
  const members: Member[] = [
    { id: currentUserId, name: "Ahmed", email: "ah@gm.com", role: "Owner" },
    { id: "sarah", name: "Sarah Chen", email: "sarah@example.com", role: "Admin" },
    { id: "james", name: "James Miller", email: "james@example.com", role: "Member" },
    { id: "maya", name: "Maya Patel", email: "maya@example.com", role: "Member" },
  ];
  const projects: Project[] = [
    { id: "website", teamId: "design", name: "Website redesign", description: "A fresh, thoughtful experience for our next chapter.", status: "Active", startDate: date(-14), dueDate: date(12), memberIds: [currentUserId, "sarah", "james"], icon: "Layout" },
    { id: "mobile", teamId: "design", name: "Mobile experience", description: "Bring the workspace with you, wherever you work.", status: "Active", startDate: date(-7), dueDate: date(24), memberIds: [currentUserId, "maya", "sarah"], icon: "Smartphone" },
    { id: "brand", teamId: "design", name: "Brand guidelines", description: "One cohesive identity across every touchpoint.", status: "Planning", startDate: date(2), dueDate: date(30), memberIds: ["sarah", "maya", currentUserId], icon: "Palette" },
    { id: "platform", teamId: "engineering", name: "Platform improvements", description: "A faster and more reliable foundation.", status: "Active", startDate: date(-10), dueDate: date(18), memberIds: ["james", currentUserId], icon: "Code" },
  ];
  const rows: [string, string, string, Task["status"], Task["priority"], number, string][] = [
    ["Design homepage exploration", "website", currentUserId, "In Progress", "High", 1, "Design"],
    ["Review navigation structure", "website", "sarah", "In Review", "Medium", 2, "Research"],
    ["Build reusable button components", "website", "james", "Todo", "High", 3, "Development"],
    ["Audit accessibility contrast", "website", currentUserId, "Todo", "Urgent", -1, "Design"],
    ["Create wireframes", "website", "sarah", "Done", "Medium", -3, "Design"],
    ["Document design principles", "website", currentUserId, "Done", "Low", -2, "Research"],
    ["Map onboarding journey", "mobile", currentUserId, "In Progress", "High", 2, "Research"],
    ["Explore mobile navigation", "mobile", "maya", "Todo", "Medium", 5, "Design"],
    ["Finalize icon system", "mobile", "sarah", "Done", "Low", -1, "Design"],
    ["Define color foundations", "brand", "maya", "Todo", "Medium", 6, "Brand"],
    ["Review typography pairings", "brand", currentUserId, "Todo", "Low", 7, "Brand"],
    ["Optimize API response times", "platform", "james", "In Progress", "Urgent", 1, "Development"],
    ["Add integration coverage", "platform", currentUserId, "Done", "High", -4, "Development"],
  ];
  return {
    teams: [{ id: "design", name: "Design studio", description: "Building thoughtful digital experiences, together.", avatar: "DS", members }, { id: "engineering", name: "Engineering", description: "Making ambitious ideas work beautifully.", avatar: "EN", members: [members[0], members[2]] }],
    projects,
    tasks: rows.map((r, i) => ({ id: `TSK-${101 + i}`, title: r[0], projectId: r[1], assigneeId: r[2], status: r[3], priority: r[4], dueDate: date(r[5]), labels: [r[6]], description: "Bring the latest exploration together and share it with the team for feedback.", createdAt: date(-7), comments: i === 0 ? [{ id: "c1", author: "Sarah Chen", text: "The new direction is looking great. Let's review the mobile layout too.", date: date(-1) }] : [], attachments: [] })),
    activity: [
      { id: "a1", text: "Sarah Chen moved Review navigation structure to In Review", projectId: "website", date: new Date(today.getTime() - 1200000).toISOString(), read: false },
      { id: "a2", text: "James Miller assigned Build reusable button components", projectId: "website", date: new Date(today.getTime() - 3600000).toISOString(), read: false },
      { id: "a3", text: "You completed Add integration coverage", projectId: "platform", date: new Date(today.getTime() - 7200000).toISOString(), read: true },
      { id: "a4", text: "Maya Patel joined Design studio", date: new Date(today.getTime() - 86400000).toISOString(), read: true },
    ], invitations: [],
  };
}