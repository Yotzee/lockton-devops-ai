import { useAuth } from "@/resources/auth";

export function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
      <p className="mt-2 text-muted-foreground">
        This is the home page. Select an item from the navigation to get started.
      </p>
    </div>
  );
}
