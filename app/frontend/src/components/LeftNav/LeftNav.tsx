import { NavLink } from "react-router-dom";
import { Home, LogOut, MessageSquare } from "lucide-react";
import { useAuth } from "@/resources/auth";
import { Button } from "@/components/ui/button";

export function LeftNav() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-sidebar-background text-sidebar-foreground">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        Lockton App
      </div>

      <nav className="flex-1 space-y-1 p-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`
          }
        >
          <Home className="h-4 w-4" />
          Home
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`
          }
        >
          <MessageSquare className="h-4 w-4" />
          AI Chat
        </NavLink>
      </nav>

      <div className="border-t p-4">
        <div className="mb-2 text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user?.username}</span>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
