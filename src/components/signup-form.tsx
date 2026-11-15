import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { api } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { inputClass } from "./login-form";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const registerUser = useMutation({
    mutationFn: async () => {
      const res = await api.post("/users/register", form);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registered successfully");
      navigate({ to: "/login" });
    },
    onError: () => toast.error("Registration failed"),
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-2xl border-border/60 shadow-xl shadow-indigo-500/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Tasky</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerUser.mutate();
            }}
          >
            <FieldGroup>
              <Field>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="h-11 rounded-xl">
                    <AppleIcon /> Apple
                  </Button>
                  <Button variant="outline" type="button" className="h-11 rounded-xl">
                    <GoogleIcon /> Google
                  </Button>
                </div>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className={inputClass}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    id="username"
                    placeholder="johndoe"
                    className={inputClass}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={cn(inputClass, "pr-10")}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={registerUser.isPending}
                  className="h-11 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30"
                >
                  {registerUser.isPending ? <Spinner /> : <>Sign up <ArrowRight className="size-4" /></>}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
