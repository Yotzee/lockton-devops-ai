import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/resources/auth";
import { LeftNav } from "@/components/LeftNav/LeftNav";

export function Layout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen">
      <LeftNav />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
