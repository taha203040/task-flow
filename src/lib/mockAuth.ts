// Lightweight mock auth so the UI works without a live backend.
// Credentials: ah@gm.com / 1234

export const MOCK_EMAIL = "ah@gm.com";
export const MOCK_PASSWORD = "1234";
const KEY = "mock_auth_user";

export type MockUser = {
  user_id: string;
  email: string;
  username: string;
};

export function mockSignIn(email: string, password: string): MockUser | null {
  if (email.trim().toLowerCase() === MOCK_EMAIL && password === MOCK_PASSWORD) {
    const user: MockUser = {
      user_id: "mock-user-1",
      email: MOCK_EMAIL,
      username: "Ahmed",
    };
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function getMockUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function mockSignOut() {
  localStorage.removeItem(KEY);
}

export function isMockAuthed() {
  return !!getMockUser();
}
