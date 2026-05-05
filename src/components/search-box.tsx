import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface Suggestion {
  username: string;
  id: string;
  email: string;
  inviteStatus?: string | null;
}

export default function SearchBox({ teamId, userId }: { teamId: string; userId: string }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await api.get("/members/search", {
          params: { q: query },
          withCredentials: true,
        });
        const enriched = await Promise.all(
          res.data.map(async (s: Suggestion) => {
            try {
              const p = await api.get(`/invites/pending/${teamId}/${s.id}`, {
                withCredentials: true,
              });
              return { ...s, inviteStatus: p.data?.status || null };
            } catch {
              return { ...s, inviteStatus: null };
            }
          })
        );
        setSuggestions(enriched);
        setShowSuggestions(true);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, teamId]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const inviteMutation = useMutation({
    mutationFn: async (data: {
      teamId: string;
      invitedUserId: string;
      role: string;
      invitedBy: string;
    }) => api.post("/invites", data, { withCredentials: true }),
    onSuccess: () => toast.success("Invite sent"),
    onError: () => toast.error("Failed to send invite"),
  });

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <input
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setShowSuggestions(true)}
        placeholder="Search users..."
        className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-4 py-2 transition-colors hover:bg-accent"
            >
              <div className="flex flex-col">
                <span className="text-sm">{s.username}</span>
                <span className="text-xs text-muted-foreground">{s.email}</span>
              </div>
              <button
                className={`rounded px-3 py-1 text-sm transition-colors ${
                  s.inviteStatus === "pending"
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (s.inviteStatus !== "pending") {
                    inviteMutation.mutate({
                      teamId,
                      invitedUserId: s.id,
                      role: "member",
                      invitedBy: userId,
                    });
                  }
                }}
                disabled={s.inviteStatus === "pending" || inviteMutation.isPending}
              >
                {s.inviteStatus === "pending"
                  ? "Invited"
                  : inviteMutation.isPending
                    ? "Sending..."
                    : "Invite"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
