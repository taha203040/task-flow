import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCheck, ListChecks, Users, FolderKanban, UserCheck, MessagesSquare, LayoutGrid, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tasky — Organize tasks, projects and teams in one place" },
      { name: "description", content: "Tasky helps teams plan projects, assign tasks and collaborate on a shared Kanban workspace." },
      { property: "og:title", content: "Tasky — Organize tasks, projects and teams" },
      { property: "og:description", content: "Plan projects, assign tasks and collaborate with your team in one workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: ListChecks, title: "Task Management", text: "Create tasks with priorities, due dates and statuses from Todo to Done." },
  { icon: Users, title: "Team Collaboration", text: "Invite teammates with Owner, Admin or Member roles." },
  { icon: FolderKanban, title: "Project Organization", text: "Group work into projects under each team and track progress." },
  { icon: UserCheck, title: "Task Assignments", text: "Assign work to project or team members so everyone knows what's next." },
  { icon: MessagesSquare, title: "Real-time Communication", text: "Stay in sync with an inbox of activity updates and invitations." },
  { icon: LayoutGrid, title: "Workspace Management", text: "One workspace for dashboards, boards, lists and settings." },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><CheckCheck className="size-5" /></span>
      <span className="text-xl font-bold text-foreground">tasky<span className="text-primary">.</span></span>
    </Link>
  );
}

const columns = [
  { name: "Todo", dot: "bg-muted-foreground", cards: [["Write launch brief", "High"], ["Audit onboarding", "Medium"]] },
  { name: "In Progress", dot: "bg-primary", cards: [["Kanban drag & drop", "Urgent"], ["Team invite emails", "High"]] },
  { name: "In Review", dot: "bg-teal", cards: [["Dashboard charts", "Medium"]] },
  { name: "Done", dot: "bg-teal", cards: [["Auth flow", "Low"], ["Project roles", "Low"]] },
];

function BoardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 text-xs font-medium text-muted-foreground">Design team / Website relaunch</span>
      </div>
      <div className="flex">
        <aside className={`hidden w-44 shrink-0 space-y-1 border-r p-3 text-sm ${compact ? "" : "md:block"}`}>
          {["Overview", "My tasks", "Inbox", "Teams", "Projects"].map((l, i) => (
            <div key={l} className={`rounded-md px-2.5 py-1.5 ${i === 4 ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"}`}>{l}</div>
          ))}
        </aside>
        <div className={`grid flex-1 grid-cols-2 gap-3 overflow-hidden p-4 ${compact ? "" : "lg:grid-cols-4"}`}>
          {columns.map((c) => (
            <div key={c.name} className="space-y-2 rounded-xl bg-muted/60 p-2.5">
              <div className="flex items-center gap-2 px-1 text-xs font-semibold"><span className={`size-2 rounded-full ${c.dot}`} />{c.name}<span className="ml-auto text-muted-foreground">{c.cards.length}</span></div>
              {c.cards.map(([t, p]) => (
                <div key={t} className="rounded-lg border bg-card p-2.5 text-left shadow-sm">
                  <p className="text-xs font-medium">{t}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${p === "Urgent" || p === "High" ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"}`}>{p}</span>
                    <span className="size-5 rounded-full bg-primary/20" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthButtons({ size = "lg" as const }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button asChild size={size}><Link to="/signup">Get Started <ArrowRight /></Link></Button>
      <Button asChild size={size} variant="outline"><Link to="/login">Sign In</Link></Button>
    </div>
  );
}

function Landing() {
  return (
    <div className="landing min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Logo />
          <div className="hidden gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#about" className="transition-colors hover:text-foreground">About</a>
          </div>
          <div className="ml-auto flex gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign In</Link></Button>
            <Button asChild size="sm"><Link to="/signup">Sign Up</Link></Button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"><span className="size-1.5 rounded-full bg-teal" />Teams, projects and tasks in one place</span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">Get your team's work done, <span className="text-primary">together.</span></h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">Organize tasks, plan projects and collaborate with your team on a clear, shared board — so nothing slips.</p>
        <div className="mt-8"><AuthButtons /></div>
        <div className="mt-14"><BoardPreview /></div>
      </section>

      <section id="features" className="scroll-mt-20 border-t bg-card py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold text-primary">Features</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Everything your team needs to ship</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-background p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><f.icon className="size-5" /></span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-sm font-semibold text-primary">Product</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">See every project at a glance</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {["Kanban and list views for every project", "Teams own projects, projects own tasks", "Dashboard with priorities and team activity"].map((t) => (
                <li key={t} className="flex gap-2"><CheckCheck className="size-4 shrink-0 text-teal" />{t}</li>
              ))}
            </ul>
          </div>
          <BoardPreview compact />
        </div>
      </section>

      <section id="about" className="scroll-mt-20 border-t bg-card py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Up and running in three steps</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[["Create your workspace", "Sign up and set up a team for your group."], ["Organize projects and tasks", "Add projects, break them into tasks and set priorities."], ["Collaborate with your team", "Invite teammates, assign work and track progress."]].map(([t, d], i) => (
              <div key={t} className="rounded-xl border bg-background p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-2xl bg-navy px-6 py-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">Start organizing your work today</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/70">Bring your team, projects and tasks together in minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/signup">Get Started <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/login">Sign In</Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="max-w-xs"><Logo /><p className="mt-3 text-sm text-muted-foreground">Task management for teams that want clarity.</p></div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#about" className="hover:text-foreground">About</a>
            <Link to="/login" className="hover:text-foreground">Sign In</Link>
            <Link to="/signup" className="hover:text-foreground">Sign Up</Link>
          </div>
        </div>
        <p className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Tasky. All rights reserved.</p>
      </footer>
    </div>
  );
}
